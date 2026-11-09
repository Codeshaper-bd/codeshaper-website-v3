export const CASE_STUDIES_FAQS: { q: string; a: string }[] = [
  {
    q: "Can you share examples similar to my industry?",
    a: "We'll point you to the closest real case study we have, and speak honestly about what's the same and what's different if we don't have an exact match yet.",
  },
  {
    q: "Can we start with a pilot or MVP Sprint first?",
    a: "Yes — an MVP Sprint is one of our standing engagement models, built specifically to validate an idea in 6–10 weeks before committing to a bigger scope.",
  },
  {
    q: "Do you sign an NDA before sharing details?",
    a: "Yes, we're glad to sign an NDA before any project-specific discussion — most clients ask for one, and it's a normal part of an early conversation.",
  },
  {
    q: "Who owns the IP and source code?",
    a: "You do. Source files, design assets, and documentation are handed over as part of every engagement's clean-handover step.",
  },
  {
    q: "How do you handle timezone/collaboration?",
    a: "Bangladesh is our delivery hub, with collaboration hubs across Japan, the USA, the UK, Australia, and New Zealand — weekly demos and shared board visibility keep async work from turning into blind spots.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Yes — IT Staff Augmentation and a Dedicated Development Team are both built for that: our people slot into your process rather than replacing it.",
  },
];

export const CASE_STUDIES_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CASE_STUDIES_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
