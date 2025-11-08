
import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { UserAvatar } from './UserAvatar';
import { ClipboardIcon, CheckIcon } from './icons';
import { CodePreview } from './CodePreview';
import { ProductCard } from './ProductCard';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  userAvatar: string;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, userAvatar }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const formatTimestamp = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  const isUser = message.role === 'user';

  return (
    <div className={`group relative flex items-end gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 flex-shrink-0 bg-[#B9FBC0] dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-lg text-green-800 dark:text-green-200 shadow-[5px_5px_10px_#addec2,-5px_-5px_10px_#c5ffbe] dark:shadow-[5px_5px_10px_#1f4e24,-5px_-5px_10px_#2d6e35]">
          B
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`max-w-md md:max-w-lg lg:max-w-2xl p-4 rounded-3xl ${isUser 
          ? 'bg-[#A7B9F5] dark:bg-indigo-500 text-white rounded-br-lg shadow-[5px_5px_10px_#96a6dc,-5px_-5px_10px_#b8ccff] dark:shadow-[5px_5px_10px_#4f46e5,-5px_-5px_10px_#6f63ff]' 
          : 'bg-[#F0F0F0] dark:bg-[#2C2C44] text-slate-800 dark:text-slate-100 rounded-bl-lg shadow-[5px_5px_10px_#dcdcdc,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58]'
        }`}>
          {message.content && <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>}
          {message.code && <CodePreview code={message.code} />}
        </div>
        
        {message.products && message.products.length > 0 && (
          <div className="max-w-md md:max-w-lg lg:max-w-2xl mt-3 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {message.products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}

        <span className="text-xs text-slate-400 dark:text-slate-400 mt-1 px-2">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <UserAvatar avatar={userAvatar} className="w-10 h-10 flex-shrink-0"/>
      )}
      
      {message.content && (
        <button 
          onClick={handleCopy}
          className={`absolute top-1/2 -translate-y-1/2 mt-[-1rem] p-1.5 rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 ${isUser ? 'left-0 -translate-x-full mr-2' : 'right-0 translate-x-full ml-2'}`}
          aria-label="Copy message"
        >
          {isCopied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardIcon className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};