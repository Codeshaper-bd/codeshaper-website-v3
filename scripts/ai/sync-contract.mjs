#!/usr/bin/env node
/** Copies the AI response contract from the CMS, which owns it:  node scripts/ai/sync-contract.mjs [path-to-cms] */
import { copyFileSync } from "node:fs";

const cms = process.argv[2] ?? "../codeshaper-cms";
copyFileSync(`${cms}/docs/ai/ui-response.v1.schema.json`, "src/lib/ai/schema/response.v1.schema.json");
copyFileSync(`${cms}/docs/ai/fixtures/response.v1.json`, "tests/fixtures/ai/response.v1.json");
console.log("contract copied; now run: pnpm test");
