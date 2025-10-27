
import React from 'react';
import type { AppDefinition } from '../types';

interface WindowProps {
  app: AppDefinition;
  onClose: () => void;
}

export const Window: React.FC<WindowProps> = ({ app, onClose }) => {
  const IconComponent = app.icon;

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl h-auto max-h-[80vh] bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl flex flex-col animate-scale-in">
        {/* Title Bar */}
        <div className="flex items-center justify-between p-2 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-gray-300" />
            <span className="font-bold text-white">{app.name}</span>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full bg-red-500 hover:bg-red-400 active:bg-red-600 flex items-center justify-center text-white font-bold transition-colors"
            aria-label="Close window"
          >
            &#x2715;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-200 overflow-y-auto">
          {app.content}
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};
