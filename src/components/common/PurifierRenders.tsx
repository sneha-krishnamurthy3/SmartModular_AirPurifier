import React from 'react';
import { purifierImg, explodedImg } from '../../assets/productAssets';

interface PurifierRenderProps {
  className?: string;
  aqiValue?: number;
}

export const AssembledPurifierSVG: React.FC<PurifierRenderProps> = ({ className = 'w-full h-auto' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={purifierImg}
        alt="Pavitra Air Module One Smart Purifier"
        className="w-full h-auto max-w-sm object-contain drop-shadow-2xl mx-auto"
      />
    </div>
  );
};

interface ExplodedPurifierSVGProps {
  className?: string;
  explodedOffset?: number;
  activeModule?: string;
  onSelectModule?: (moduleId: string) => void;
}

export const ExplodedPurifierSVG: React.FC<ExplodedPurifierSVGProps> = ({
  className = 'w-full h-auto',
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={explodedImg}
        alt="Pavitra Air Purifier Exploded 3D View"
        className="w-full h-auto max-w-xl object-contain drop-shadow-2xl mx-auto"
      />
    </div>
  );
};
