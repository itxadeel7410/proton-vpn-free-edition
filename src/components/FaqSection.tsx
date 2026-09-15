import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-[#13141B] border-y border-white/10 py-16 sm:py-20 px-4 sm:px-8" id="faq">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#8E72FF] uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-['Manrope'] text-base text-[#A2A4B5]">
            Clear, honest answers about our Free Edition and cryptographic privacy model.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl bg-[#1a1b22] border transition-all cursor-pointer ${
                  isOpen ? 'border-[#6D4AFF]/60 bg-[#1e1f26]' : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => toggleFaq(item.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    {item.question}
                  </h4>
                  <span
                    className={`material-symbols-outlined text-[#A2A4B5] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#6D4AFF]' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>

                {isOpen && (
                  <div className="mt-4 pt-3 border-t border-white/10 text-[#c9c4d9] font-['Manrope'] text-[15px] leading-relaxed animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
