import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { ArrowRight, Play, Leaf, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { purifierImg } from '../../assets/productAssets';

export const HeroSection: React.FC = () => {
  const { cms } = useProductStore();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative bg-[#F8F7F3] text-[#09090B] overflow-hidden font-inter border-b border-gray-300 py-8 lg:py-16 min-h-[650px] lg:min-h-[750px] flex items-center">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column Content (7 Cols) matching reference design */}
          <div className="lg:col-span-7 space-y-6 lg:pr-4 z-20">
            
            {/* Category Tag */}
            <div className="text-xs font-black tracking-widest uppercase text-[#6C3EF4]">
              {cms.heroBannerTag || 'MODULAR AIR PURIFIERS'}
            </div>

            {/* Headline Stack: CLEAN AIR. CLEVER DESIGN. ZERO WASTE. */}
            <div className="space-y-0.5 uppercase leading-[0.92]">
              <h1 className="text-5xl sm:text-7xl lg:text-7xl xl:text-[84px] font-black font-syne tracking-tighter text-[#09090B]">
                {cms.heroTitleLine1}
              </h1>
              <h1 className="text-5xl sm:text-7xl lg:text-7xl xl:text-[84px] font-black font-syne tracking-tighter text-[#09090B]">
                {cms.heroTitleLine2}
              </h1>
              <h1 className="text-5xl sm:text-7xl lg:text-7xl xl:text-[84px] font-black font-syne tracking-tighter text-[#D7FF2F]">
                {cms.heroTitleHighlight}
              </h1>
            </div>

            {/* Subtitle Paragraph */}
            <p className="text-sm sm:text-base text-[#666666] max-w-md font-semibold leading-relaxed">
              Affordable. Upgradeable. Planet-friendly.<br />
              Air purifiers that adapt to your life<br />
              and the planet's future.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] px-7 py-4 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-3 transition-colors shadow-sm"
              >
                <span>SHOP AIR PURIFIERS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="group flex items-center gap-3 px-5 py-3.5 border border-[#09090B] text-[#09090B] text-xs sm:text-sm font-extrabold tracking-wider uppercase hover:bg-[#09090B] hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-full border border-[#09090B] flex items-center justify-center group-hover:border-white transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>WATCH VIDEO</span>
              </button>
            </div>

            {/* Square Callout Box below buttons */}
            <div className="pt-4">
              <Link 
                to="/sustainability" 
                className="inline-block bg-white border border-gray-300 p-3.5 px-5 hover:border-[#09090B] transition-all group shadow-sm"
              >
                <span className="text-[11px] font-black text-[#09090B] block uppercase group-hover:text-[#6C3EF4] transition-colors">
                  MADE FROM PLANT-BASED PLA →
                </span>
              </Link>
            </div>

          </div>

          {/* Right Column Product Display (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-start items-center py-6 lg:py-0 min-h-[620px] lg:min-h-[740px] xl:min-h-[780px]">
            
            {/* Extra-Wide Vertical Purple Backdrop */}
            <div className="absolute w-[440px] sm:w-[540px] lg:w-[620px] xl:w-[700px] h-[580px] sm:h-[660px] lg:h-[730px] xl:h-[780px] bg-[#6C3EF4] rounded-none z-0 shadow-2xl left-0 lg:left-4" />

            {/* Purifier Image Container */}
            <div className="relative z-10 w-full max-w-[440px] sm:max-w-[520px] lg:max-w-[600px] xl:max-w-[660px] flex justify-start items-center pt-8 pl-0 lg:pl-4">
              
              {/* Air Purifier Bundled Image Render */}
              <img
                src={purifierImg}
                alt="Pavitra Air Module One Smart Purifier"
                className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />

              {/* Circular Biodegradable Badge centered exactly over the top-right vertex corner */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-8 sm:-top-12 -right-8 sm:-right-12 lg:-right-14 w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-[#D7FF2F] text-[#09090B] p-2.5 flex items-center justify-center text-[9px] font-black uppercase text-center tracking-tighter leading-tight shadow-2xl z-30 cursor-pointer"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-full border border-dashed border-[#09090B]/40">
                  <div className="flex flex-col items-center">
                    <Leaf className="w-4 h-4 mb-0.5 stroke-[2.5]" />
                    <span>BIODEGRADABLE</span>
                    <span className="text-[8px] opacity-80">PLA</span>
                    <span className="text-[7px] text-[#09090B]">BETTER FOR EARTH</span>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </div>

      {/* Extreme Right 'SCROLL TO EXPLORE ↓' Indicator on White Side */}
      <div className="hidden xl:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 text-[10px] font-black tracking-widest text-[#09090B] uppercase z-40">
        <span className="[writing-mode:vertical-rl] tracking-[0.2em] uppercase">SCROLL TO EXPLORE</span>
        <div className="w-[1.5px] h-6 bg-[#09090B]/60" />
        <ArrowDown className="w-4 h-4 text-[#09090B] animate-bounce shrink-0" />
      </div>

      {/* Video Modal with User Specified YouTube Link */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-gray-800 max-w-4xl w-full p-6 relative rounded-2xl shadow-2xl">
            <button 
              onClick={() => setIsVideoModalOpen(false)} 
              className="absolute top-4 right-4 text-white hover:text-[#D7FF2F] font-bold text-2xl transition-colors"
            >
              ✕
            </button>
            <h3 className="font-syne font-bold text-xl text-white mb-4 uppercase tracking-tight">
              Pavitra Innovations — Modular Design Story
            </h3>
            <div className="aspect-video w-full bg-[#09090B] rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-800">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/U9x9-w-o8iM?autoplay=1"
                title="Pavitra Innovations YouTube Showcase Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
