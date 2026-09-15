import React from 'react';
import { REVIEWS } from '../data/mockData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="w-full bg-[#13141B] border-y border-white/10 py-16 sm:py-20 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#8E72FF] uppercase tracking-wider">
            Independent Press Validation
          </span>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Recommended Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-2xl bg-[#1a1b22] border border-white/10 flex flex-col justify-between space-y-5 hover:border-[#8E72FF]/40 transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#FFB020]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px]">
                      star
                    </span>
                  ))}
                </div>
                <blockquote className="font-['Manrope'] text-[15px] text-white italic leading-relaxed">
                  {rev.quote}
                </blockquote>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-['JetBrains_Mono'] text-[12px] text-[#6C6F82]">
                <span className="text-white font-bold">{rev.outlet}</span>
                <span className="text-[#00E5FF] font-medium">{rev.award}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
