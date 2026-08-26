import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { READING_PATHS, getPostBySlug } from "@/lib/blog";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

export default function ReadingPaths() {
  return (
    <section className="bg-canvas py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow>Start here</SectionEyebrow>
          <SectionTitle id="paths-heading">Reading paths</SectionTitle>
          <SectionDescription className="mt-3">
            Curated sequences to go from confusion → plan → execution.
          </SectionDescription>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {READING_PATHS.map((path, i) => (
            <Reveal key={path.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6">
                <h3 className="font-urbanist text-lg font-bold tracking-tight text-ink">{path.title}</h3>
                <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{path.description}</p>
                <ol className="mt-5 flex-1 space-y-3">
                  {path.slugs.map((slug, idx) => {
                    const post = getPostBySlug(slug);
                    if (!post) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/blog/${slug}`} className="group flex items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hairline-light font-urbanist text-[11px] font-semibold text-ink-faint">
                            {idx + 1}
                          </span>
                          <span className="font-urbanist text-[13.5px] font-medium text-ink-dim transition-colors duration-200 group-hover:text-aurora-violet">
                            {post.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
