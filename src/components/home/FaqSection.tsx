import type { Faq } from "@/features/faqs/types";

interface FaqSectionProps {
  faqs: Faq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="bg-surface-muted px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Pertanyaan Umum
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Masih bingung? Mungkin ini jawabannya
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <article
              key={faq.id}
              className="rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-yumm-pink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink sm:text-lg">
                {faq.question}
              </h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
