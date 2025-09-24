import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PhotoIcon, EmojiIcon, SparklesIcon } from './icons/Icons';
import { useSettings } from '../contexts/SettingsContext';

const CreatePost: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useSettings();

  const handleGeneratePost = useCallback(async () => {
    if (!postContent.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `You are a creative social media assistant for an app called Inovira. Based on the following idea, write an engaging and friendly social media post. Use relevant emojis and hashtags. Keep it concise and positive in tone.
      
      Idea: "${postContent}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        setPostContent(text);
      } else {
        console.error("AI did not return any text.");
      }

    } catch (error) {
      console.error("Error generating post with Gemini AI:", error);
      // We could add a user-facing error message here in a real app
    } finally {
      setIsGenerating(false);
    }
  }, [postContent, isGenerating]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mt-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src="https://picsum.photos/id/1005/200/200"
          alt="User Avatar"
        />
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="flex-1 bg-transparent focus:outline-none resize-none text-lg placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
          rows={4}
          placeholder={t('whatsOnYourMind')}
          disabled={isGenerating}
          aria-label="Create a new post"
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4 text-primary">
          <button className="hover:text-primary-hover transition-colors disabled:opacity-50" disabled={isGenerating} aria-label="Add photo">
            <PhotoIcon className="h-5 w-5" />
          </button>
          <button className="hover:text-primary-hover transition-colors disabled:opacity-50" disabled={isGenerating} aria-label="Add emoji">
            <EmojiIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={handleGeneratePost}
            className="hover:text-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 group" 
            disabled={isGenerating || !postContent.trim()}
            aria-label="Enhance post with AI"
          >
            <SparklesIcon className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="text-sm font-semibold hidden sm:inline group-hover:underline">
              {isGenerating ? t('generating') : t('enhance')}
            </span>
          </button>
        </div>
        <button 
          className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-hover transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={isGenerating || !postContent.trim()}
        >
          {t('post')}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;