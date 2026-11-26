import { test } from "node:test";
import assert from "node:assert/strict";
import { briefSummary, splitQuestion } from "../src/lib/ai/present.ts";
import { emptyBrief } from "../src/lib/ai/contract.ts";

test("the closing question is taken out so it can sit after the cards", () => {
  assert.deepEqual(splitQuestion("Good scope. These usually apply. Which two things must it do?"), { lead: "Good scope. These usually apply.", question: "Which two things must it do?" });
  assert.deepEqual(splitQuestion("Who is it for?"), { lead: "", question: "Who is it for?" });
  assert.deepEqual(splitQuestion("Here are the projects."), { lead: "Here are the projects.", question: null });
});

test("splitting never loses or invents words", () => {
  for (const text of ["A.\nB? C.", "Version 2.5 works. Ready?", "What? Now what?", "বাংলা। কী চান?", ""]) {
    const { lead, question } = splitQuestion(text);
    assert.equal([lead, question].filter(Boolean).join(" ").replace(/\s+/g, " "), text.replace(/\s+/g, " ").trim(), text);
  }
});

test("a brief is summarised from what was said, and the rest is counted, not filled", () => {
  const brief = { ...emptyBrief(), goal: "A booking app", users: "Clinics", features: ["a", "b", "c", "d", "e"], timeline: "Spring", platforms: "Web" };
  assert.deepEqual(briefSummary(brief), { goal: "A booking app", features: ["a", "b", "c"], moreFeatures: 2, facts: [["Who it is for", "Clinics"], ["Platforms", "Web"]], open: 3 });
  assert.deepEqual(briefSummary(emptyBrief()), { goal: null, features: [], moreFeatures: 0, facts: [], open: 8 });
});
