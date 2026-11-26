import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { ERROR_CODES, parseResponse } from "../src/lib/ai/contract.ts";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const cases = read("tests/fixtures/ai/response.v1.json");
const schema = read("src/lib/ai/schema/response.v1.schema.json");
/** Strictly in the contract: accepted with nothing dropped or changed. */
const conforms = (c) => isDeepStrictEqual(parseResponse(c), c);

test("every shared valid case is accepted unchanged", () => {
  for (const [name, c] of Object.entries(cases.valid)) assert.ok(conforms(c), name);
});

test("no shared invalid case gets through as it is", () => {
  for (const [name, c] of Object.entries(cases.invalid)) assert.ok(!conforms(c), name);
});

test("the error codes are the schema's", () => {
  assert.deepEqual([...ERROR_CODES].sort(), [...schema.properties.error.properties.code.enum].sort());
});

// the CMS owns the contract; when it is on this computer the copies here must match it
const cms = [process.env.CMS_DIR, "../codeshaper-cms-01c", "../codeshaper-cms"].filter(Boolean).find((d) => existsSync(`${d}/docs/ai/fixtures/response.v1.json`));
test("the copies match the CMS's originals", { skip: cms ? false : "no CMS checkout beside this one" }, () => {
  assert.deepEqual(schema, read(`${cms}/docs/ai/ui-response.v1.schema.json`));
  assert.deepEqual(cases, read(`${cms}/docs/ai/fixtures/response.v1.json`));
});
