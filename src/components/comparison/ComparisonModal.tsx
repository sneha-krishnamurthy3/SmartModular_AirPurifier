import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const comparisonRows = [
    { feature: 'Modular & Repairable', pavitra: '100% Modular (Swap in 5 secs)', traditional: 'Sealed Unit (Throw away whole device)' },
    { feature: 'Housing Material', pavitra: '100% Plant-Based Bio-PLA', traditional: 'Toxic Petroleum Plastic' },
    { feature: 'Filter Replacement Cost', pavitra: '₹799 per H13 module', traditional: '₹3,500+ expensive single-block' },
    { feature: 'Electronics Upgradeable', pavitra: 'Yes (Power, Fan, AQI, Covers)', traditional: 'No (Obsolescence built-in)' },
    { feature: 'Landfill Waste Impact', pavitra: '0 Waste (100% Circular Credit)', traditional: '4.5 kg Non-recyclable Trash' },
    { feature: 'Power Input & Efficiency', pavitra: '5W USB-C (Powerbank compatible)', traditional: '45W Heavy AC wall outlet' },
    { feature: 'Warranty & Support', pavitra: '1 Year Module-for-Module Swap', traditional: 'Service center wait times' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-inter">
      <div className="bg-brand-surface border border-brand-border max-w-3xl w-full rounded-3xl p-6 sm:p-8 relative shadow-2xl text-brand-offwhite max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-brand-muted hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-black border border-brand-border text-neon-green text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HONEST COMPARISON</span>
          </div>
          <h3 className="font-syne font-black text-2xl sm:text-3xl text-white uppercase">
            PAVITRA VS TRADITIONAL PURIFIERS
          </h3>
          <p className="text-xs text-brand-muted">Why modular engineering is the future of sustainable home appliances.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted font-bold uppercase">
                <th className="py-3 px-4">Feature / Metric</th>
                <th className="py-3 px-4 text-neon-green font-syne font-black text-sm bg-neon-green/10 rounded-t-xl">
                  PAVITRA MODULE ONE
                </th>
                <th className="py-3 px-4 text-gray-400">TRADITIONAL PURIFIER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 font-medium">
              {comparisonRows.map((row, index) => (
                <tr key={index} className="hover:bg-brand-black/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{row.feature}</td>
                  <td className="py-3.5 px-4 text-neon-green font-bold bg-neon-green/5 flex items-center gap-2">
                    <Check className="w-4 h-4 text-neon-green shrink-0 stroke-[3]" />
                    <span>{row.pavitra}</span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted">
                    <span>{row.traditional}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-brand-border text-center">
          <button
            onClick={onClose}
            className="bg-neon-green text-brand-black hover:bg-neon-hover font-black text-xs py-3 px-6 rounded-xl uppercase tracking-wider"
          >
            GOT IT — CHOOSE PAVITRA
          </button>
        </div>

      </div>
    </div>
  );
};
