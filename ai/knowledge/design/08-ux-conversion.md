# 08 · UX & conversion

The website exists to win high-quality software projects. Every section must answer a buyer's question and move them one step closer to a call.

## The buyer's questions, and where the page answers them

| Question in the buyer's head | Answered by |
|---|---|
| What do you do, and is it for me? | Hero heading + sub-line, Services |
| Can I trust you? | Client logos, At a glance (figures + map), Case studies, Client reviews, Leadership, Team photos |
| Are you any good technically? | Products (we build and run our own), Human + AI, Tools & technology |
| How would we work together, and what does it cost? | Engagement models (+ price hints), FAQ |
| What happens next? | Let's talk: three steps + booking form |

## CTA hierarchy

- **One primary action per view.** Primary = black pill. Everything else is an outline pill or a text link.
- The global primary is **Book a call** (navigation button). The hero's primary is the **chat box**; "Book a call" there is a quiet link.
- CTA text says what happens: "Book a demo", "Request a call", "Read the case study". Never "Submit" or "Learn more".

## Trust and proof

- **Proof sits next to the decision** (e.g. the proof line under the hero chat box; product track record on each product card).
- **Specific beats general:** "400+ copies sold on CodeCanyon" beats "trusted by many".
- **Real only:** every figure must be checkable; unconfirmed ones get a `CHECK` comment in code and are confirmed before launch.

## Forms

- Ask for the minimum: the homepage booking form is name, work email, service, optional note. The full contact page can ask more.
- Labels above fields, "(optional)" on optional ones, inline error message, success state that says what happens next and when.
- Every form posts to `/api/contact` → CMS › Leads (spam honeypot + one id per enquiry).

## Psychology to apply (Laws of UX)

- **Hick's law:** fewer choices → faster decisions (3 products, 5 engagement models, 4 form fields).
- **Jakob's law:** use patterns people know (tabs look like tabs, links are underlined).
- **Aesthetic-usability effect:** a calm, polished page is trusted more. Polish is a conversion tool.
- **Serial position:** the first and last sections are remembered most: hero and Let's talk get the most care.
- **Goal-gradient:** show progress ("three steps from first call to first release").

## Measure

A change "works" only if it moves a number: booked calls, hero chat sends, form completions. Track them before redesigning on opinion.
