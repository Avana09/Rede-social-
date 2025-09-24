import React from 'react';
import { Story } from '../types';

const mockStories: Story[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  user: {
    name: `User ${i + 1}`,
    handle: `user${i+1}`,
    avatarUrl: `https://picsum.photos/id/${10 + i}/200/200`,
  },
  imageUrl: `https://picsum.photos/id/${20 + i}/400/600`,
}));

const StoryCircle: React.FC<{ story: Story }> = ({ story }) => (
  <div className="flex flex-col items-center space-y-1 flex-shrink-0">
    <div className="bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-1 rounded-full">
      <div className="bg-white dark:bg-gray-800 p-1 rounded-full">
        <img
          className="w-16 h-16 rounded-full object-cover"
          src={story.user.avatarUrl}
          alt={story.user.name}
        />
      </div>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-16 text-center">{story.user.name}</p>
  </div>
);

const Stories: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
        {mockStories.map((story) => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default Stories;