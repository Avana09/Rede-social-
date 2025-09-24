import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Theme, PostLayout } from '../types';
import { availableLanguages, Language } from '../i18n/translations';

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-4">
        <span className="text-gray-800 dark:text-gray-200">{label}</span>
        <button
            onClick={onToggle}
            aria-pressed={enabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-primary ${
                enabled ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

const Settings: React.FC = () => {
    const { theme, setTheme, postLayout, setPostLayout, language, setLanguage, t } = useSettings();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('settingsTitle')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('settingsSubtitle')}</p>
            </header>

            <div className="space-y-10">
                <section aria-labelledby="appearance-heading">
                    <h2 id="appearance-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">{t('appearance')}</h2>
                    <Toggle 
                        label={t('darkMode')}
                        enabled={theme === Theme.DARK}
                        onToggle={() => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
                    />
                    <div className="py-4">
                        <label htmlFor="post-layout" className="block text-gray-800 dark:text-gray-200">{t('postDisplay')}</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('postDisplayDescription')}</p>
                        <div className="flex space-x-4 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                           <button onClick={() => setPostLayout(PostLayout.COMFORTABLE)} className={`w-full py-2 rounded-md font-semibold transition-colors ${postLayout === PostLayout.COMFORTABLE ? 'bg-white dark:bg-gray-800 shadow' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{t('comfortable')}</button>
                           <button onClick={() => setPostLayout(PostLayout.COMPACT)} className={`w-full py-2 rounded-md font-semibold transition-colors ${postLayout === PostLayout.COMPACT ? 'bg-white dark:bg-gray-800 shadow' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{t('compact')}</button>
                        </div>
                    </div>
                     <div className="py-4">
                        <label htmlFor="language-select" className="block text-gray-800 dark:text-gray-200">{t('language')}</label>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('languageDescription')}</p>
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary"
                        >
                            {availableLanguages.map(lang => (
                                <option key={lang.key} value={lang.key}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                </section>

                <section aria-labelledby="notifications-heading">
                    <h2 id="notifications-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">{t('notifications')}</h2>
                    <Toggle 
                        label={t('enablePushNotifications')}
                        enabled={notificationsEnabled}
                        onToggle={() => setNotificationsEnabled(prev => !prev)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {t('notificationsNote')}
                    </p>
                </section>

                <section aria-labelledby="account-heading">
                    <h2 id="account-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">{t('account')}</h2>
                    <div className="space-y-4">
                        <button className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t('changeEmail')}</button>
                        <button className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t('changePassword')}</button>
                        <button className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">{t('deleteAccount')}</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;