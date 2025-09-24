import React from 'react';
import { View } from '../types';
import { HomeIcon, MessageIcon, UserIcon, InoviraLogo, SettingsIcon } from './icons/Icons';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 my-1 rounded-full transition-colors duration-200 ${
      isActive ? 'bg-primary text-on-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="ml-4 font-semibold hidden lg:block">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { t } = useSettings();
  return (
    <nav className="w-16 lg:w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 lg:p-4 flex flex-col">
      <div className="mb-8 p-2 hidden lg:block">
        <InoviraLogo className="h-8 w-auto text-primary" />
      </div>
      <div className="mb-8 p-3 block lg:hidden">
        <InoviraLogo className="h-6 w-auto text-primary" />
      </div>
      <NavItem
        icon={<HomeIcon />}
        label={t('feed')}
        isActive={currentView === View.FEED}
        onClick={() => onViewChange(View.FEED)}
      />
      <NavItem
        icon={<MessageIcon />}
        label={t('messages')}
        isActive={currentView === View.CHAT}
        onClick={() => onViewChange(View.CHAT)}
      />
      <NavItem
        icon={<UserIcon />}
        label={t('profile')}
        isActive={currentView === View.PROFILE}
        onClick={() => onViewChange(View.PROFILE)}
      />
       <NavItem
        icon={<SettingsIcon />}
        label={t('settings')}
        isActive={currentView === View.SETTINGS}
        onClick={() => onViewChange(View.SETTINGS)}
      />
      <div className="mt-auto hidden lg:block">
         <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-primary-hover transition-colors duration-200">
            {t('post')}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;