import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { FAQ_ITEMS } from '../data/sinergikaData';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <p className="text-xs font-semibold tracking-wide text-neutral-500">
              Pertanyaan Umum
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0D1B2A] [text-wrap:balance]">
              Jawaban teknis sebelum memulai.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600">
              Masih ada detail mengenai integrasi mesin lama, keamanan jaringan, atau estimasi
              biaya? Hubungi tim arsitek kami secara langsung.
            </p>
          </motion.div>

          <div className="lg:col-span-8 rounded-2xl border border-neutral-200 bg-white px-6 sm:px-8 divide-y divide-neutral-200">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  data-open={isOpen}
                  className="accordion-item py-5 sm:py-6"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    data-cursor-label={isOpen ? 'Tutup' : 'Buka'}
                    className="flex w-full items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A2E5C] rounded-md cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold tracking-tight text-[#0D1B2A]">
                      {item.question}
                    </span>
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen ? 'bg-[#0A2E5C] text-[#A3E635]' : 'bg-[#F4F4F2] text-[#0A2E5C]'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                  </button>

                  <div id={`${item.id}-panel`} className="accordion-content">
                    <div className="accordion-inner">
                      <p className="pt-3 pr-10 text-sm sm:text-base leading-relaxed text-neutral-600">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
