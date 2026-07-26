import React, { useState } from 'react';
import { ExplodedPurifierSVG } from '../common/PurifierRenders';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';
import { Sliders, ChevronRight, ShoppingBag, Play } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExplodedViewSection: React.FC = () => {
  const [explodedOffset, setExplodedOffset] = useState<number>(65);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('hepa_filter');
  const { addToCart } = useCartStore();
  const { products } = useProductStore();

  const moduleDataMap: Record<string, { title: string; desc: string; prodId: string; price: number; icon: string }> = {
    top_cover: {
      title: 'TOP COVER LID',
      desc: 'Plant-based bio-PLA cap with aerodynamic air intake slots.',
      prodId: 'prod-005',
      price: 499,
      icon: '🌀'
    },
    hepa_filter: {
      title: 'HEPA FILTER',
      desc: 'Captures 99.97% of particles as small as 0.3µm.',
      prodId: 'prod-002',
      price: 799,
      icon: '🛡️'
    },
    power_module: {
      title: 'POWER MODULE',
      desc: 'USB-C powered. Efficient. Reliable. Replaceable.',
      prodId: 'prod-003',
      price: 1299,
      icon: '⚡'
    },
    aqi_meter: {
      title: 'AQI METER',
      desc: 'Real-time air quality monitoring. Swap anytime.',
      prodId: 'prod-004',
      price: 1499,
      icon: '📊'
    },
    main_body: {
      title: 'BIODEGRADABLE BASE',
      desc: '100% Plant-based PLA perforated base housing.',
      prodId: 'prod-001',
      price: 4999,
      icon: '🌱'
    }
  };

  const selectedModule = moduleDataMap[selectedModuleId];

  const handleAddSelectedModuleToCart = () => {
    const matchedProduct = products.find((p) => p.id === selectedModule.prodId) || products[0];
    addToCart(matchedProduct, 1);
    toast.success(`Added ${selectedModule.title} to your cart!`);
  };

  return (
    <section className="bg-[#09090B] text-white py-20 border-t border-gray-800 relative overflow-hidden font-inter">
      
      {/* Background Grid Lines matching reference image 2 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag & Headlines matching reference image 2 */}
        <div className="mb-12">
          <div className="text-xs font-black tracking-widest text-[#D7FF2F] uppercase mb-2">
            MODULAR BY DESIGN
          </div>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black font-syne tracking-tighter uppercase leading-[0.9] text-white">
            YOU CAN REPLACE. <br />
            YOU CAN UPGRADE.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-medium mt-3 max-w-xl">
            No tools. No tech skills. <br />
            Just a simple swap in seconds.
          </p>
        </div>

        {/* Layout matching reference image 2: Left Cards, Center 3D Render, Right Numbered Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column Cards matching reference image 2 (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* HEPA FILTER CARD */}
            <div 
              onClick={() => setSelectedModuleId('hepa_filter')}
              className={`p-5 border transition-all cursor-pointer flex items-center justify-between ${
                selectedModuleId === 'hepa_filter' 
                  ? 'bg-[#6C3EF4] text-white border-transparent shadow-xl' 
                  : 'bg-[#111111] border-[#1E1E1E] hover:border-gray-600 text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-xl shrink-0">
                  🛡️
                </div>
                <div>
                  <h4 className="font-syne font-black text-base tracking-wider uppercase text-white">HEPA FILTER</h4>
                  <p className="text-xs text-gray-200 font-medium">Captures 99.97% of particles as small as 0.3µm.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 text-white" />
            </div>

            {/* POWER MODULE CARD */}
            <div 
              onClick={() => setSelectedModuleId('power_module')}
              className={`p-5 border transition-all cursor-pointer flex items-center justify-between ${
                selectedModuleId === 'power_module' 
                  ? 'bg-[#6C3EF4] text-white border-transparent shadow-xl' 
                  : 'bg-[#111111] border-[#1E1E1E] hover:border-gray-600 text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-xl shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="font-syne font-black text-base tracking-wider uppercase text-white">POWER MODULE</h4>
                  <p className="text-xs text-gray-200 font-medium">USB-C powered. Efficient. Reliable. Replaceable.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 text-white" />
            </div>

            {/* AQI METER CARD */}
            <div 
              onClick={() => setSelectedModuleId('aqi_meter')}
              className={`p-5 border transition-all cursor-pointer flex items-center justify-between ${
                selectedModuleId === 'aqi_meter' 
                  ? 'bg-[#6C3EF4] text-white border-transparent shadow-xl' 
                  : 'bg-[#111111] border-[#1E1E1E] hover:border-gray-600 text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-xl shrink-0">
                  📊
                </div>
                <div>
                  <h4 className="font-syne font-black text-base tracking-wider uppercase text-white">AQI METER</h4>
                  <p className="text-xs text-gray-200 font-medium">Real-time air quality monitoring. Swap anytime.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 text-white" />
            </div>

            {/* Bottom SEE HOW IT WORKS button matching reference image 2 */}
            <div className="pt-4">
              <a 
                href="#starter-kit" 
                className="inline-flex items-center gap-3 text-xs font-black tracking-widest text-white uppercase group hover:text-[#D7FF2F] transition-colors"
              >
                <span>SEE HOW IT WORKS</span>
                <div className="w-7 h-7 rounded-full border border-white flex items-center justify-center group-hover:border-[#D7FF2F]">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </a>
            </div>

            {/* Selected Module Add to Cart Box */}
            <div className="p-4 bg-[#111111] border border-[#1E1E1E] space-y-3 pt-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-300">COMPONENT: {selectedModule.title}</span>
                <span className="text-[#D7FF2F] font-mono">₹{selectedModule.price}</span>
              </div>
              <button
                onClick={handleAddSelectedModuleToCart}
                className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-2.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> ADD MODULE TO CART
              </button>
            </div>

          </div>

          {/* Right Column: Exploded 3D Render Diagram with Steps matching reference image 2 (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Exploded Distance Control Slider */}
            <div className="flex items-center justify-between bg-[#111111] border border-[#1E1E1E] p-3 px-4 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sliders className="w-4 h-4 text-[#D7FF2F]" />
                <span>EXPLODED VIEW CONTROL</span>
              </div>
              <div className="flex items-center gap-3 w-1/2 max-w-xs">
                <span className="text-[10px] font-mono text-gray-400">ASSEMBLED</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodedOffset}
                  onChange={(e) => setExplodedOffset(Number(e.target.value))}
                  className="w-full accent-[#D7FF2F] cursor-pointer h-1.5 bg-gray-800 rounded-lg"
                />
                <span className="text-[10px] font-mono text-[#D7FF2F]">EXPLODED</span>
              </div>
            </div>

            {/* Clean 2-column flex grid for clean exploded render on left and steps on right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#09090B] border border-[#1E1E1E] p-6 rounded-2xl">
              
              <div className="md:col-span-7 flex items-center justify-center">
                <ExplodedPurifierSVG 
                  className="w-full max-w-md h-auto" 
                  explodedOffset={explodedOffset}
                  activeModule={selectedModuleId}
                  onSelectModule={(id) => setSelectedModuleId(id)}
                />
              </div>

              {/* Step Callouts Column (5 Cols) - Clean, Non-Overlapping Layout */}
              <div className="md:col-span-5 space-y-8 text-white pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0">
                
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-[#D7FF2F] text-[#D7FF2F] font-syne font-black text-lg flex items-center justify-center shrink-0 bg-[#111111]">
                    1
                  </div>
                  <div>
                    <h5 className="font-syne font-black text-sm uppercase tracking-wider text-white">TWIST & LIFT</h5>
                    <p className="text-xs text-gray-300 font-medium">Open the top cover with a gentle twist.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-[#D7FF2F] text-[#D7FF2F] font-syne font-black text-lg flex items-center justify-center shrink-0 bg-[#111111]">
                    2
                  </div>
                  <div>
                    <h5 className="font-syne font-black text-sm uppercase tracking-wider text-white">PULL OUT</h5>
                    <p className="text-xs text-gray-300 font-medium">Remove the old module you want to replace.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-[#D7FF2F] text-[#D7FF2F] font-syne font-black text-lg flex items-center justify-center shrink-0 bg-[#111111]">
                    3
                  </div>
                  <div>
                    <h5 className="font-syne font-black text-sm uppercase tracking-wider text-white">SWAP & CLOSE</h5>
                    <p className="text-xs text-gray-300 font-medium">Insert the new one. Close and breathe easy.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
