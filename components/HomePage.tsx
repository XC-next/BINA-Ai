
import React from 'react';

interface HomePageProps {
  onStartChat: () => void;
  onGenerateExample: (prompt: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartChat, onGenerateExample }) => {
  const examplePrompt = "/code create a product card with an image, title, price, and an 'Add to Cart' button";
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animated-gradient bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-[#1D2B64] dark:via-[#3d2c5a] dark:to-[#4a274f]">
      <div className="text-center float-animation">
        <h1 className="group text-6xl md:text-8xl font-bold tracking-wider text-[#4A4A6A] dark:text-[#E0E0FF] flex cursor-default mb-4">
          {'BIna AI'.split('').map((letter, index) => (
            <span
              key={index}
              className="transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300 mb-8">
          Your personal AI shopping assistant. Get product recommendations, compare items, and find the best deals. You can even ask me to generate code for your storefront!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartChat}
            className="px-8 py-4 font-semibold text-lg text-white bg-[#A7B9F5] dark:bg-indigo-500 rounded-2xl shadow-[5px_5px_10px_#96a6dc,-5px_-5px_10px_#b8ccff] dark:shadow-[5px_5px_10px_#4f46e5,-5px_-5px_10px_#6f63ff] active:shadow-[inset_5px_5px_10px_#96a6dc,inset_-5px_-5px_10px_#b8ccff] dark:active:shadow-[inset_5px_5px_10px_#4f46e5,inset_-5px_-5px_10px_#6f63ff] transition-all duration-150 transform hover:scale-105"
          >
            Start Chatting
          </button>
          <button
            onClick={() => onGenerateExample(examplePrompt)}
            className="px-8 py-4 font-semibold text-lg text-slate-700 dark:text-slate-200 bg-[#E6E0F0] dark:bg-[#2C2C44] rounded-2xl shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58] transition-all duration-150 transform hover:scale-105"
          >
            Generate UI Example
          </button>
        </div>
      </div>
    </div>
  );
};