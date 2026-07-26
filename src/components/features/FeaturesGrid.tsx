import React from 'react';
import { Leaf, ShieldCheck, Wallet, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Leaf,
      title: 'ECO-FRIENDLY',
      description: 'Made from biodegradable PLA. Better for you, better for Earth.',
    },
    {
      icon: ShieldCheck,
      title: 'HEALTH-FIRST',
      description: 'Removes PM2.5, pollen, dust, smoke & more. Breathe cleaner, live better.',
    },
    {
      icon: Wallet,
      title: 'BUDGET SMART',
      description: 'Premium features. Fair prices. No compromises.',
    },
    {
      icon: RefreshCw,
      title: 'BUILT TO EVOLVE',
      description: 'Upgrade individual modules. Not the whole device. Save money. Reduce waste.',
    },
  ];

  return (
    <section className="bg-[#F8F7F3] text-[#09090B] py-12 border-t border-b border-gray-300 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-300">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="pt-6 lg:pt-0 lg:px-6 first:lg:pl-0 last:lg:pr-0 space-y-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#09090B] flex items-center justify-center text-[#09090B] shrink-0 group-hover:bg-[#09090B] group-hover:text-[#D7FF2F] transition-colors">
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="font-syne font-black text-sm sm:text-base tracking-wider uppercase text-[#09090B]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed font-semibold">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
