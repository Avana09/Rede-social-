
import React from 'react';
import Stories from './Stories';
import CreatePost from './CreatePost';
import PostComponent from './Post';
import { Post } from '../types';

const mockPosts: Post[] = [
  {
    id: 1,
    user: { name: 'Elena Rodriguez', handle: 'elena_r', avatarUrl: 'https://picsum.photos/id/1027/200/200' },
    timestamp: '2h ago',
    content: 'Just finished a beautiful hike in the mountains. The views were absolutely breathtaking! 🏔️ #nature #hiking #adventure',
    imageUrl: 'https://picsum.photos/id/1015/600/400',
    likes: 128,
    comments: 15,
    shares: 8,
  },
  {
    id: 2,
    user: { name: 'Ben Carter', handle: 'bencarter', avatarUrl: 'https://picsum.photos/id/1005/200/200' },
    timestamp: '5h ago',
    content: 'My new workspace setup is finally complete! Feeling super productive. What do you think? 💻✨',
    imageUrl: 'https://picsum.photos/id/1/600/400',
    likes: 256,
    comments: 42,
    shares: 12,
  },
  {
    id: 3,
    user: { name: 'Aisha Khan', handle: 'aishak', avatarUrl: 'https://picsum.photos/id/1011/200/200' },
    timestamp: '1d ago',
    content: 'Exploring the vibrant streets of Tokyo! The food, the culture, the people... everything is amazing. 🇯🇵🍣',
    likes: 512,
    comments: 89,
    shares: 34,
  },
];

const Feed: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-4">
      <Stories />
      <CreatePost />
      <div className="mt-4">
        {mockPosts.map((post) => (
          <PostComponent key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
   