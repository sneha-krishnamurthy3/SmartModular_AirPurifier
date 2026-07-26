import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Leaf, TreePine } from 'lucide-react';

export const SustainabilitySection: React.FC = () => {
  const { cms } = useProductStore();
  const [roomSqFt, setRoomSqFt] = useState<number>(350);
  const [hoursPerDay, setHoursPerDay] = useState<number>(14);

  const yearlyCo2Saved = Math.round((roomSqFt * hoursPerDay * 0.42) / 10);
  const plasticAvoidedKg = Math.round((roomSqFt / 100) * 4.2);
  const treesEquivalent = Math.round(yearlyCo2Saved / 20);

  return (
    <section className="bg-[#09090B] text-white py-20 border-t border-gray-800 font-inter relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111] border border-gray-800 text-[#D7FF2F] text-xs font-black tracking-widest uppercase">
            <Leaf className="w-3.5 h-3.5 text-[#D7FF2F]" />
            <span>PLANET-FIRST ENGINEERING</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-syne tracking-tighter uppercase leading-none text-white">
            CIRCULAR. <span className="text-[#D7FF2F]">ZERO WASTE.</span>
          </h2>
          <p className="text-gray-300 text-sm font-semibold">
            Traditional purifiers add 4.5 million kg of non-recyclable plastic to landfills every year. We changed that.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl text-center space-y-2 shadow-sm">
            <span className="font-syne font-black text-3xl sm:text-4xl text-[#D7FF2F] font-mono">
              {cms.carbonSavedKg.toLocaleString()} KG
            </span>
            <p className="text-xs font-black text-gray-300 uppercase tracking-wider">CO₂ EMISSIONS PREVENTED</p>
          </div>

          <div className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl text-center space-y-2 shadow-sm">
            <span className="font-syne font-black text-3xl sm:text-4xl text-[#6C3EF4] font-mono">
              {cms.plasticReducedKg.toLocaleString()} KG
            </span>
            <p className="text-xs font-black text-gray-300 uppercase tracking-wider">PLASTIC SAVED FROM LANDFILLS</p>
          </div>

          <div className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl text-center space-y-2 shadow-sm">
            <span className="font-syne font-black text-3xl sm:text-4xl text-[#D7FF2F] font-mono">
              {cms.purifiersSold.toLocaleString()} +
            </span>
            <p className="text-xs font-black text-gray-300 uppercase tracking-wider">MODULAR HOMES ACTIVE</p>
          </div>

          <div className="bg-[#111111] border border-[#27272A] p-6 rounded-2xl text-center space-y-2 shadow-sm">
            <span className="font-syne font-black text-3xl sm:text-4xl text-[#6C3EF4] font-mono">
              {cms.recyclabilityRate}%
            </span>
            <p className="text-xs font-black text-gray-300 uppercase tracking-wider">CIRCULAR MATERIAL REUSE</p>
          </div>
        </div>

        {/* Interactive Impact Calculator Box */}
        <div className="bg-[#111111] border border-[#27272A] rounded-3xl p-8 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="font-syne font-black text-2xl text-white tracking-wide uppercase">
                CALCULATE YOUR <span className="text-[#D7FF2F]">ENVIRONMENTAL IMPACT</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                Adjust room dimensions and daily usage to see how much plastic and CO₂ you save compared to traditional disposable purifiers.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-gray-300">ROOM SIZE (SQ FT)</span>
                  <span className="text-[#D7FF2F] font-mono">{roomSqFt} SQ FT</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="50"
                  value={roomSqFt}
                  onChange={(e) => setRoomSqFt(Number(e.target.value))}
                  className="w-full accent-[#D7FF2F] cursor-pointer h-2 bg-gray-800 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-gray-300">DAILY USAGE (HOURS)</span>
                  <span className="text-[#D7FF2F] font-mono">{hoursPerDay} HRS / DAY</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="2"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full accent-[#D7FF2F] cursor-pointer h-2 bg-gray-800 rounded-lg"
                />
              </div>
            </div>

            {/* Live Stats Result */}
            <div className="lg:col-span-6 bg-[#09090B] border border-[#27272A] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-[#D7FF2F]">
                <TreePine className="w-5 h-5" />
                <span className="text-xs font-black tracking-widest uppercase">YOUR 1-YEAR IMPACT SAVINGS</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center pt-2">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black font-syne text-white font-mono">{yearlyCo2Saved} kg</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">CO₂ PREVENTED</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black font-syne text-[#D7FF2F] font-mono">{plasticAvoidedKg} kg</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">PLASTIC SAVED</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black font-syne text-[#6C3EF4] font-mono">{treesEquivalent}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">TREES EQUIVALENT</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
