import type { Faq } from "@/features/faqs/types";

interface FaqSectionProps {
  faqs: Faq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    // Latar belakang disamakan dengan section Cara Mudah Pesan
    <section className="bg-yumm-pink/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Mungkin <span className="text-yumm-pink">Kamu</span> Bertanya
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Belum ketemu jawabannya? Jangan ragu untuk hubungi admin kami langsung.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <article
              key={faq.id}
              className="group relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-yumm-pink/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-yumm-pink/40 sm:p-8"
            >
              {/* Watermark Tanda Tanya Transparan */}
              <span
                aria-hidden
                className="absolute -right-4 -top-4 font-display text-[8rem] font-black leading-none text-yumm-pink/5 transition-colors duration-300 group-hover:text-yumm-pink/10"
              >
                ?
              </span>

              <div className="relative">
                {/* Label Kategori Kecil */}
                <span className="font-display text-[10px] font-bold uppercase tracking-widest text-yumm-pink">
                  Pertanyaan {index + 1}
                </span>
                
                {/* Teks Pertanyaan */}
                <h3 className="mt-2 font-display text-base font-bold leading-snug text-ink sm:text-lg">
                  {faq.question}
                </h3>

                {/* Garis Pemisah */}
                <div className="my-4 h-px w-full bg-neutral-100 transition-colors group-hover:bg-neutral-200" />

                {/* Teks Jawaban */}
                <div className="space-y-1.5">
                  <span className="font-display text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">
                    Jawaban
                  </span>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}