
import React, { useState, useMemo, useEffect } from 'react';
import { ChatMessage } from '../types';
import { UserAvatar } from './UserAvatar';
import { XMarkIcon, MagnifyingGlassIcon } from './icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, history }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    return history.filter(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, history]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(''); // Reset search term when modal closes
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  const formatTimestamp = (date: Date) => {
    if (!date || isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('default', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(date);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm dark:bg-black/50 pt-16 md:pt-24"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl p-4 bg-[#EDE9F4] dark:bg-[#161625] rounded-3xl text-[#4A4A6A] dark:text-[#E0E0FF] shadow-[8px_8px_16px_#c9c5d0,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0e0e18,-8px_-8px_16px_#1e1e32] transition-transform duration-300 ease-in-out flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between pb-3 border-b border-slate-300/70 dark:border-slate-700">
          <h2 className="text-xl font-bold">Search History</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-300/50 dark:hover:bg-slate-700" aria-label="Close search">
            <XMarkIcon className="w-6 h-6"/>
          </button>
        </div>

        <div className="flex-shrink-0 my-4 flex items-center space-x-2 bg-[#E6E0F0] dark:bg-[#2C2C44] rounded-2xl p-2 shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58]">
          <MagnifyingGlassIcon className="w-5 h-5 ml-2 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for messages..."
            className="flex-1 w-full bg-transparent px-2 py-1.5 text-[#4A4A6A] dark:text-[#E0E0FF] placeholder-slate-500/80 dark:placeholder-slate-400/80 focus:outline-none"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {searchTerm.trim() && filteredHistory.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">No results found.</p>
          )}
          {filteredHistory.map((msg, index) => (
             <div key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44]">
              {msg.role === 'user' ? (
                <UserAvatar avatar={'default'} className="w-8 h-8 flex-shrink-0"/>
              ) : (
                <div className="w-8 h-8 flex-shrink-0 bg-[#B9FBC0] dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-sm text-green-800 dark:text-green-200">B</div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{msg.role === 'user' ? 'You' : 'BIna AI'}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-400">{formatTimestamp(msg.timestamp)}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{msg.content}</p>
              </div>
            </div>
          ))}
          {!searchTerm.trim() && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">Start typing to search your chat history.</p>
          )}
        </div>
      </div>
    </div>
  );
};