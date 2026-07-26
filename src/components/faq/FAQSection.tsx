import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FAQSection: React.FC = () => {
  const { faqs } = useProductStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const categories = ['All', 'Modules & Specs', 'General', 'Shipping & Order', 'Sustainability', 'Warranty'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(search.toLowerCase()) || 
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-[#09090B] text-white py-20 border-t border-gray-800 font-inter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111] border border-gray-700 text-[#D7FF2F] text-xs font-black tracking-widest uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-syne tracking-tighter uppercase leading-none text-white">
            FREQUENTLY ASKED <span className="text-[#D7FF2F]">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4 mb-10">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs (e.g. HEPA filter, warranty, PLA material)..."
              className="w-full bg-[#111111] border border-[#27272A] rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D7FF2F] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#D7FF2F] text-[#09090B]'
                    : 'bg-[#111111] border border-[#27272A] text-gray-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-[#111111] rounded-2xl border border-[#27272A] text-gray-400 text-xs font-bold">
              No matching questions found.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-[#111111] border border-[#27272A] rounded-2xl overflow-hidden transition-colors hover:border-gray-600"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left font-syne font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4"
                  >
                    <span className="text-white font-extrabold">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#D7FF2F] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs text-gray-300 leading-relaxed font-medium border-t border-[#27272A] pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
