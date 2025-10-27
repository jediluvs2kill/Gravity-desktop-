import React from 'react';
import type { AppDefinition } from '../types';

interface AppIconProps {
  app: AppDefinition;
  onOpenApp?: (app: AppDefinition) => void;
  isDocked?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, onOpenApp, isDocked = false }) => {
  const IconComponent = app.icon;

  const handleClick = onOpenApp ? () => onOpenApp(app) : undefined;
  
  const iconSizeClass = isDocked ? 'h-12 w-12' : 'h-16 w-16';

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-1 group cursor-pointer ${isDocked ? 'p-2' : 'w-full h-full'}`}
      title={app.name}
    >
      <div className={`
        ${iconSizeClass}
        bg-black/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10
        flex items-center justify-center
        transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20 group-active:scale-95
      `}>
        <IconComponent className="text-white h-2/3 w-2/3" />
      </div>
      {!isDocked && <span className="text-white text-xs font-medium truncate drop-shadow-md bg-black/30 px-2 py-0.5 rounded-full">{app.name}</span>}
    </div>
  );
};