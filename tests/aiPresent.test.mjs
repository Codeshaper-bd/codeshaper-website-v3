import { test } from "node:test";
import assert from "node:assert/strict";
import { splitQuestion, visibleWhileStreaming } from "../src/lib/ai/present.ts";

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


test("while arriving, a closing question is held back so it never jumps below the cards", () => {
  assert.equal(visibleWhileStreaming("These usually apply. Which two things"), "These usually apply.");
  assert.equal(visibleWhileStreaming("These usually apply. Which two things must it do?"), "These usually apply.");
  assert.equal(visibleWhileStreaming("Who is it"), "");
  // ordinary sentences keep arriving word by word
  assert.equal(visibleWhileStreaming("These usually apply. A short list"), "These usually apply. A short list");
  assert.equal(visibleWhileStreaming("What we do. Here are"), "What we do. Here are");
  assert.equal(visibleWhileStreaming(""), "");
});
