import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanPageUrl } from "../src/lib/pageUrl.ts";

test("only campaign tags survive", () => {
  assert.equal(cleanPageUrl("https://codeshaper.net/contact?brief=my+idea&utm_source=ads&email=a%40b.test#brief=x"), "https://codeshaper.net/contact?utm_source=ads");
  assert.equal(cleanPageUrl("http://localhost:3000/contact?brief=secret"), "http://localhost:3000/contact");
});

test("sign-in details in an address are dropped", () => {
  assert.equal(cleanPageUrl("https://user:pass@codeshaper.net/x"), "https://codeshaper.net/x");
});

test("anything that is not a web address is dropped", () => {
  for (const v of ["", "not a url", "javascript:alert(1)", null, undefined]) assert.equal(cleanPageUrl(v), "");
});
