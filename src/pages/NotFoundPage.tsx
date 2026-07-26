import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-inter space-y-6">
      <div className="font-syne font-black text-8xl text-neon-green neon-glow">404</div>
      <h1 className="font-syne font-black text-2xl sm:text-3xl text-white uppercase">PAGE NOT FOUND</h1>
      <p className="text-xs text-brand-muted max-w-sm">The modular route you requested does not exist or has been relocated.</p>
      <Link to="/" className="bg-neon-green text-brand-black font-black text-xs px-6 py-3 rounded-xl uppercase shadow-lg">
        RETURN TO HOMEPAGE
      </Link>
    </div>
  );
};
