import Link from "next/link";
import { Icon } from "@/lib/icons";
import { BLOG_POSTS } from "@/lib/blog";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

const TOPIC_ICONS: Record<string, string> = {
  "Product Strategy": "compass",
  "UX/UI": "layout-dashboard",
  Commerce: "shopping-bag",
  "AI & Automation": "bot",
  "Web Engineering": "code-2",
  Integrations: "plug",
};

export default function TopicCollections() {
  const counts = new Map<string, number>();
  for (const p of BLOG_POSTS) counts.set(p.topic, (counts.get(p.topic) ?? 0) + 1);

  return (
    <section id="topics" className="border-t border-hairline-light bg-light-surface py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow>Topics</SectionEyebrow>
          <SectionTitle id="topics-heading">Browse by topic</SectionTitle>
          <SectionDescription className="mt-3">Jump straight to what you need.</SectionDescription>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...counts.entries()].map(([topic, count], i) => (
            <Reveal key={topic} delay={i * 60}>
              <Link
                href={`/blog?topic=${encodeURIComponent(topic)}#browse`}
                className="group flex items-center gap-4 rounded-2xl border border-hairline-light bg-light-raised p-5 transition-colors duration-300 hover:border-aurora-violet/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline-light text-aurora-indigo transition-colors duration-300 group-hover:border-aurora-violet/40">
                  <Icon name={TOPIC_ICONS[topic] ?? "file-text"} size={18} />
                </span>
                <span>
                  <span className="block font-urbanist text-[15px] font-bold text-ink">{topic}</span>
                  <span className="mt-0.5 block font-urbanist text-[12.5px] text-ink-faint">
                    {count} {count === 1 ? "article" : "articles"}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
