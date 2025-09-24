import React from 'react';
import { PhotoIcon } from './icons/Icons';
import { useSettings } from '../contexts/SettingsContext';

const Profile: React.FC = () => {
  const { t } = useSettings();
  const user = {
    name: 'Ben Carter',
    handle: 'bencarter',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    bannerUrl: 'https://picsum.photos/id/1018/1500/500',
    bio: 'Frontend Developer | UI/UX Enthusiast | Building cool things on the web. 🚀',
    following: 245,
    followers: 1870,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <img src={user.bannerUrl} alt="Banner" className="w-full h-48 lg:h-64 object-cover" />
        <img
          src={user.avatarUrl}
          alt="Avatar"
          className="absolute -bottom-16 left-8 w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-gray-100 dark:border-black object-cover"
        />
      </div>
      <div className="pt-20 px-8 pb-8 bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-end">
          <button className="px-4 py-2 border border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors">
            {t('editProfile')}
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">@{user.handle}</p>
        </div>
        <p className="mt-4">{user.bio}</p>
        <div className="flex space-x-6 mt-4 text-gray-500 dark:text-gray-400">
          <p><span className="font-bold text-gray-900 dark:text-gray-100">{user.following}</span> {t('following')}</p>
          <p><span className="font-bold text-gray-900 dark:text-gray-100">{user.followers.toLocaleString()}</span> {t('followers')}</p>
        </div>
      </div>
      <div className="mt-4 p-4 text-center">
        <h2 className="text-xl font-bold mb-4">{t('yourPosts')}</h2>
        <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <PhotoIcon className="w-12 h-12 text-gray-500 dark:text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">{t('noPostsYet')}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;