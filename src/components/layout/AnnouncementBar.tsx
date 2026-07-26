import React from 'react';
import { useProductStore } from '../../store/useProductStore';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  const { cms } = useProductStore();

  if (!cms.announcementActive || !cms.announcementText) return null;

  return (
    <div className="bg-neon-green text-brand-black py-2 px-4 text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center relative z-50">
      <div className="flex items-center gap-2 max-w-7xl mx-auto text-center overflow-hidden">
        <Sparkles className="w-4 h-4 animate-spin-slow shrink-0" />
        <span className="truncate">{cms.announcementText}</span>
        {cms.announcementLink && (
          <Link 
            to={cms.announcementLink} 
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity ml-1 shrink-0 font-bold"
          >
            Shop Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
