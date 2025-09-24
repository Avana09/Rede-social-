import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { View } from './types';
import { SettingsProvider } from './contexts/SettingsContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.FEED);

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case View.FEED:
        return <Feed />;
      case View.CHAT:
        return <Chat />;
      case View.PROFILE:
        return <Profile />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;