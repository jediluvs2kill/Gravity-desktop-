
import React from 'react';
import type { AppDefinition } from '../types';
import { AppIcon } from './AppIcon';

interface DockProps {
  apps: AppDefinition[];
  onOpenApp: (app: AppDefinition) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, onOpenApp }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <div className="flex items-center justify-center gap-2 p-2 bg-gray-900/40 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
        {apps.map(app => (
          <AppIcon key={app.id} app={app} onOpenApp={onOpenApp} isDocked />
        ))}
      </div>
    </div>
  );
};
