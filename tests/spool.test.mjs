import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createSpool, httpSender } from "../src/lib/spool.ts";

/** A small stand-in for the CMS: a real server, which keeps one lead per submission id. */
async function fakeCms() {
  const cms = { mode: "up", leads: new Map(), announced: [], requests: 0, answer: null };
  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (d) => (body += d));
    req.on("end", () => {
      cms.requests++;
      const data = JSON.parse(body || "{}");
      const forced = cms.answer?.(data);
      if (forced) return res.writeHead(forced).end();
      if (cms.mode === "down") return res.writeHead(503).end();
      const isNew = !cms.leads.has(data.submission_id);
      if (isNew) {
        cms.leads.set(data.submission_id, data);
        cms.announced.push(data.submission_id);
      }
      // saved, but the answer never arrives
      if (cms.mode === "saves-then-drops") return req.socket.destroy();
      res.writeHead(isNew ? 201 : 200).end("{}");
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  cms.url = `http://127.0.0.1:${server.address().port}`;
  cms.close = () => new Promise((r) => server.close(r));
  return cms;
}

async function setup(t) {
  const cms = await fakeCms();
  const dir = await mkdtemp(path.join(tmpdir(), "cs-spool-"));
  t.after(async () => {
    await cms.close();
    await rm(dir, { recursive: true, force: true });
  });
  /** A fresh one each time is a restarted website: nothing is kept in memory. */
  const start = (url = cms.url) => createSpool({ dir: () => dir, send: httpSender(() => ({ url, token: "synthetic" }), 1500), log: () => {} });
  return { cms, dir, start };
}

const lead = (n = 1) => ({ kind: "leads", data: { submission_id: `00000000-0000-4000-8000-00000000000${n}`, name: "Synthetic", email: "person@example.test", service: "Other" } });
const files = async (dir) => (await readdir(dir).catch(() => [])).sort();

test("during an outage the enquiry is kept, and the visitor is told it was received", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  assert.equal(await start().submit(lead()), "ok");
  assert.deepEqual(await files(dir), ["00000000-0000-4000-8000-000000000001.json"]);
  assert.equal((await start().status()).pending, 1);
});

test("after a restart, waiting enquiries are sent with no new traffic", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  const before = start();
  await before.submit(lead(1));
  await before.submit(lead(2));

  cms.mode = "up";
  await start().flush();
  assert.equal(cms.leads.size, 2);
  assert.deepEqual(await files(dir), []);
});

test("saved by the CMS but the answer was lost: the retry makes no second lead or notification", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "saves-then-drops";
  await start().submit(lead());
  assert.equal((await files(dir)).length, 1);

  cms.mode = "up";
  await start().flush();
  assert.equal(cms.leads.size, 1);
  assert.equal(cms.announced.length, 1);
  assert.deepEqual(await files(dir), []);
});

test("the same submission twice while the CMS is down is kept once", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  const spool = start();
  await spool.submit(lead());
  await spool.submit(lead());
  assert.equal((await files(dir)).length, 1);
  cms.mode = "up";
  await spool.flush();
  assert.equal(cms.announced.length, 1);
});

test("two copies of the website flushing at once still make one lead", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  await start().submit(lead());
  cms.mode = "up";
  await Promise.all([start().flush(), start().flush()]);
  assert.equal(cms.announced.length, 1);
  assert.deepEqual(await files(dir), []);
});

test("an enquiry the CMS rejects for good is set aside, never deleted", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  await start().submit(lead());
  cms.mode = "up";
  cms.answer = () => 422;
  await start().flush();
  assert.deepEqual(await files(dir), ["00000000-0000-4000-8000-000000000001.json.refused"]);
  const status = await start().status();
  assert.deepEqual([status.pending, status.refused], [0, 1]);
});

test("rejected while the visitor waits: they are told, and nothing is kept", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.answer = () => 422;
  assert.equal(await start().submit(lead()), "invalid");
  assert.deepEqual(await files(dir), []);
});

test("one enquiry that keeps failing does not hold back the others", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  await start().submit(lead(1));
  await start().submit(lead(2));
  cms.mode = "up";
  cms.answer = (data) => (data.submission_id.endsWith("1") ? 500 : null);
  await start().flush();
  assert.deepEqual([...cms.leads.keys()], ["00000000-0000-4000-8000-000000000002"]);
  assert.deepEqual(await files(dir), ["00000000-0000-4000-8000-000000000001.json"]);
});

test("a wrong token or a busy CMS keeps everything for later", async (t) => {
  const { cms, dir, start } = await setup(t);
  for (const code of [401, 429]) {
    cms.answer = () => code;
    await start().submit(lead(1));
    await start().flush();
    assert.equal((await files(dir)).length, 1, String(code));
  }
});

test("when the CMS cannot be reached, one attempt is made, not one for every file", async (t) => {
  const { cms, start } = await setup(t);
  cms.mode = "down";
  for (const n of [1, 2, 3]) await start().submit(lead(n));
  cms.requests = 0;
  await start().flush();
  assert.equal(cms.requests, 1);
});

test("a damaged file is set aside for a person, and the rest are sent", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  await start().submit(lead(2));
  await writeFile(path.join(dir, "aaaa.json"), "{ half");
  cms.mode = "up";
  await start().flush();
  assert.equal(cms.leads.size, 1);
  assert.deepEqual(await files(dir), ["aaaa.json.refused"]);
});

test("an id can never write outside the spool folder", async (t) => {
  const { cms, dir, start } = await setup(t);
  cms.mode = "down";
  await start().submit({ kind: "leads", data: { submission_id: "../../escape" } });
  const kept = await files(dir);
  assert.equal(kept.length, 1);
  assert.doesNotMatch(kept[0], /escape|\.\./);
});

test("if the enquiry cannot be kept anywhere, the visitor is told it failed", async (t) => {
  const { cms, dir } = await setup(t);
  cms.mode = "down";
  const file = path.join(dir, "not-a-folder");
  await writeFile(file, "x");
  const spool = createSpool({ dir: () => path.join(file, "inside"), send: httpSender(() => ({ url: cms.url, token: "t" })), log: () => {} });
  assert.equal(await spool.submit(lead()), "failed");
});

test("log lines never contain anything the visitor typed", async (t) => {
  const { cms, dir } = await setup(t);
  cms.mode = "down";
  const lines = [];
  const spool = createSpool({ dir: () => dir, send: httpSender(() => ({ url: cms.url, token: "synthetic-token" })), log: (...a) => lines.push(a.join(" ")) });
  await spool.submit({ kind: "leads", data: { ...lead().data, brief: "VERY-PRIVATE" } });
  await spool.flush();
  assert.ok(lines.length > 0);
  assert.doesNotMatch(lines.join("\n"), /VERY-PRIVATE|person@example|Synthetic|synthetic-token/);
});
