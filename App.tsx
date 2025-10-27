
import React, { useState, useCallback } from 'react';
import { Desktop } from './components/Desktop';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { APPS, DOCK_APPS } from './constants';
import type { AppDefinition } from './types';

const App: React.FC = () => {
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);

  const handleOpenApp = useCallback((app: AppDefinition) => {
    setActiveApp(app);
  }, []);

  const handleCloseApp = useCallback(() => {
    setActiveApp(null);
  }, []);

  return (
    <main className="h-screen w-screen bg-cover bg-center" style={{ backgroundImage: `url('https://picsum.photos/1920/1080?blur=5')` }}>
      <Desktop apps={APPS} onOpenApp={handleOpenApp} />
      <Dock apps={DOCK_APPS} onOpenApp={handleOpenApp} />
      {activeApp && <Window app={activeApp} onClose={handleCloseApp} />}
    </main>
  );
};

export default App;
