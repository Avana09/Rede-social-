import React from 'react';
import { Post, PostLayout } from '../types';
import { LikeIcon, CommentIcon, ShareIcon } from './icons/Icons';
import { useSettings } from '../contexts/SettingsContext';

interface PostProps {
  post: Post;
}

const PostComponent: React.FC<PostProps> = ({ post }) => {
    const { postLayout } = useSettings();

    const PostActions: React.FC = () => (
         <div className={`flex justify-around text-gray-500 dark:text-gray-400 ${postLayout === PostLayout.COMFORTABLE ? 'border-t border-gray-200 dark:border-gray-700 pt-2' : 'mt-2'}`}>
            <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <LikeIcon />
                <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                <CommentIcon />
                <span className="text-sm">{post.comments}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                <ShareIcon />
                <span className="text-sm">{post.shares}</span>
            </button>
        </div>
    );

    const ComfortableLayout: React.FC = () => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={post.user.avatarUrl}
                    alt={post.user.name}
                />
                <div className="ml-4">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{post.user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{post.user.handle} · {post.timestamp}</p>
                </div>
            </div>
            <p className="mb-4 text-gray-800 dark:text-gray-200">{post.content}</p>
            {post.imageUrl && (
                <img
                    className="rounded-lg w-full object-cover mb-4 max-h-96"
                    src={post.imageUrl}
                    alt="Post content"
                />
            )}
           <PostActions />
        </div>
    );

    const CompactLayout: React.FC = () => (
         <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-2 border border-gray-200 dark:border-gray-700 flex space-x-3">
            <img
                className="w-10 h-10 rounded-full object-cover mt-1"
                src={post.user.avatarUrl}
                alt={post.user.name}
            />
            <div className="flex-1">
                 <div className="flex items-baseline space-x-2">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{post.user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{post.user.handle} · {post.timestamp}</p>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                {post.imageUrl && (
                    <img
                        className="rounded-lg w-full object-cover mt-2 max-h-72"
                        src={post.imageUrl}
                        alt="Post content"
                    />
                )}
                <PostActions />
            </div>
        </div>
    );


  return postLayout === PostLayout.COMPACT ? <CompactLayout /> : <ComfortableLayout />;
};

export default PostComponent;