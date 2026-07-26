import React from 'react';
import { RotateCw, ArrowDownUp, RefreshCw, Recycle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorksTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'TWIST & LIFT',
      subtitle: 'Open the top cover with a gentle twist.',
      icon: RotateCw,
    },
    {
      num: '02',
      title: 'PULL OUT',
      subtitle: 'Remove the old module you want to replace.',
      icon: ArrowDownUp,
    },
    {
      num: '03',
      title: 'SWAP & CLOSE',
      subtitle: 'Insert the new module. Close and breathe easy.',
      icon: RefreshCw,
    },
    {
      num: '04',
      title: 'RECYCLE',
      subtitle: 'Return old modules for 100% circular credit.',
      icon: Recycle,
    },
  ];

  return (
    <section className="bg-[#F8F7F3] text-[#09090B] py-16 border-t border-b border-gray-300 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-gray-300 text-[#6C3EF4] text-xs font-black tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#6C3EF4]" />
            <span>SIMPLE 4-STEP SWAP</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-syne tracking-tighter uppercase leading-none text-[#09090B]">
            HOW IT <span className="text-[#6C3EF4]">WORKS</span>
          </h2>
          <p className="text-[#666666] text-sm font-semibold">
            Designed for human simplicity. Zero technical knowledge required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-300 rounded-2xl p-6 relative space-y-4 hover:border-[#09090B] transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-syne font-black text-3xl text-[#09090B]">{step.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-[#09090B] group-hover:bg-[#09090B] group-hover:text-[#D7FF2F] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-syne font-black text-lg text-[#09090B] tracking-wide uppercase">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed font-semibold">
                    {step.subtitle}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-gray-400 font-bold text-base">
                    →
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
