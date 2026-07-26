import React from 'react';
import { HowItWorksTimeline } from '../components/workflow/HowItWorksTimeline';
import { ExplodedViewSection } from '../components/modular/ExplodedViewSection';
import { Sparkles } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-[#09090B] text-white min-h-screen py-12 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111] border border-gray-800 text-[#D7FF2F] text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODULAR ARCHITECTURE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-syne tracking-tighter uppercase text-white">
            HOW PAVITRA <span className="text-[#D7FF2F]">WORKS</span>
          </h1>
          <p className="text-gray-300 text-sm font-semibold leading-relaxed">
            Swap filters, motors, and AQI monitors in seconds without tools. Engineered for total simplicity and zero waste.
          </p>
        </div>

        <div className="space-y-16">
          <HowItWorksTimeline />
          <ExplodedViewSection />
        </div>

      </div>
    </div>
  );
};
