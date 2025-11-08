import React, { useState, useEffect } from 'react';
import { UserAvatar } from './UserAvatar';
import { XMarkIcon, UserCircleIcon } from './icons';

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUsername: string, newAvatar: string) => void;
  initialUsername: string;
  initialAvatar: string;
}

const PredefinedAvatarButton: React.FC<{color: string, isSelected: boolean, onClick: () => void}> = ({ color, isSelected, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-14 h-14 rounded-full transition-transform duration-200 hover:scale-110 ${isSelected ? 'ring-4 ring-[#A7B9F5] dark:ring-indigo-500 scale-105' : 'ring-2 ring-transparent'}`}
      aria-label={`Select ${color} avatar`}
      aria-pressed={isSelected}
    >
      <UserAvatar avatar={color} className="w-full h-full" />
    </button>
);

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
    isOpen, 
    onClose, 
    onSave,
    initialUsername,
    initialAvatar 
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [avatar, setAvatar] = useState(initialAvatar);
  
  // Reset local state when the initial props change (e.g., when modal is reopened)
  useEffect(() => {
      setUsername(initialUsername);
      setAvatar(initialAvatar);
  }, [isOpen, initialUsername, initialAvatar]);


  useEffect(() => {
    if (!isOpen) return;

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
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(username, avatar);
  }

  const handleResetAvatar = () => {
      setAvatar('default');
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm dark:bg-black/50 pt-16 md:pt-24"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-page-title"
    >
      <div
        className="relative w-full max-w-lg p-6 bg-[#EDE9F4] dark:bg-[#161625] rounded-3xl text-[#4A4A6A] dark:text-[#E0E0FF] shadow-[8px_8px_16px_#c9c5d0,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0e0e18,-8px_-8px_16px_#1e1e32] transition-transform duration-300 ease-in-out flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-slate-300/70 dark:border-slate-700">
          <h2 id="profile-page-title" className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-300/50 dark:hover:bg-slate-700" aria-label="Close profile editor">
            <XMarkIcon className="w-6 h-6"/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pt-6">
            <div className="flex justify-center">
                <UserAvatar avatar={avatar} className="w-28 h-28"/>
            </div>

            <div className="space-y-2">
                <label htmlFor="username-input" className="font-semibold text-slate-600 dark:text-slate-300 px-1">Display Name</label>
                <div className="flex items-center space-x-2 bg-[#E6E0F0] dark:bg-[#2C2C44] rounded-2xl p-2 shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58]">
                    <input
                        id="username-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your name"
                        className="flex-1 w-full bg-transparent px-3 py-2 text-[#4A4A6A] dark:text-[#E0E0FF] placeholder-slate-500/80 dark:placeholder-slate-400/80 focus:outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-semibold text-slate-600 dark:text-slate-300 px-1">Customize Avatar</h4>
                <div className="grid grid-cols-4 gap-4 p-2 justify-items-center">
                    <PredefinedAvatarButton color="red" isSelected={avatar === 'red'} onClick={() => setAvatar('red')}/>
                    <PredefinedAvatarButton color="blue" isSelected={avatar === 'blue'} onClick={() => setAvatar('blue')}/>
                    <PredefinedAvatarButton color="green" isSelected={avatar === 'green'} onClick={() => setAvatar('green')}/>
                    <PredefinedAvatarButton color="yellow" isSelected={avatar === 'yellow'} onClick={() => setAvatar('yellow')}/>
                </div>
            </div>

            <div className="space-y-2">
                <label className="w-full text-center">
                    <div className="w-full flex items-center justify-center p-3 text-center rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44] text-slate-700 dark:text-slate-200 font-semibold shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58] transition-all duration-150 cursor-pointer">
                        Upload Image
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <button
                    onClick={handleResetAvatar}
                    className="w-full flex items-center justify-center p-3 space-x-2 text-center rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44] text-slate-700 dark:text-slate-200 font-semibold shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58] transition-all duration-150"
                >
                    <UserCircleIcon className="w-6 h-6"/>
                    <span>Reset to Default</span>
                </button>
            </div>
        </div>

        <div className="flex-shrink-0 flex justify-end space-x-4 pt-4 border-t border-slate-300/70 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-slate-700 dark:text-slate-200 bg-[#E6E0F0] dark:bg-[#2C2C44] rounded-2xl shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58] transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 font-semibold text-white bg-[#A7B9F5] dark:bg-indigo-500 rounded-2xl shadow-[5px_5px_10px_#96a6dc,-5px_-5px_10px_#b8ccff] dark:shadow-[5px_5px_10px_#4f46e5,-5px_-5px_10px_#6f63ff] active:shadow-[inset_5px_5px_10px_#96a6dc,inset_-5px_-5px_10px_#b8ccff] dark:active:shadow-[inset_5px_5px_10px_#4f46e5,inset_-5px_-5px_10px_#6f63ff] transition-all duration-150"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};