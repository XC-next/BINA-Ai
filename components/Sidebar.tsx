
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { 
    TrashIcon, 
    QuestionMarkCircleIcon,
    ArrowLeftIcon,
    ShieldCheckIcon,
    ComputerDesktopIcon,
    XMarkIcon,
    DocumentArrowDownIcon,
    DocumentArrowUpIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    ChevronRightIcon
} from './icons';
import { UserAvatar } from './UserAvatar';

type SettingsView = 'main' | 'system' | 'privacy' | 'help';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  username: string;
  userAvatar: string;
  onSaveHistory: () => void;
  onLoadHistory: () => void;
  onExportHistory: () => void;
  onNewChat: () => void;
  onSearch: () => void;
  onOpenProfile: () => void;
  systemInstruction: string;
  onSystemInstructionChange: (instruction: string) => void;
  defaultSystemInstruction: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, 
    onClose, 
    onClearHistory, 
    username, 
    userAvatar, 
    onSaveHistory, 
    onLoadHistory,
    onExportHistory, 
    onNewChat, 
    onSearch,
    onOpenProfile,
    systemInstruction,
    onSystemInstructionChange,
    defaultSystemInstruction
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsView>('main');
  const [localPrompt, setLocalPrompt] = useState(systemInstruction);
  const [promptSaved, setPromptSaved] = useState(false);
  
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
  
  useEffect(() => {
    setLocalPrompt(systemInstruction);
  }, [systemInstruction]);

  const handlePromptSave = () => {
    onSystemInstructionChange(localPrompt);
    setPromptSaved(true);
    setTimeout(() => setPromptSaved(false), 2000);
  }
  
  const handlePromptReset = () => {
    onSystemInstructionChange(defaultSystemInstruction);
    setLocalPrompt(defaultSystemInstruction);
  }

  const handleClearClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setIsModalOpen(false);
    onClose(); 
  };
  
  const renderSettingsContent = () => {
    switch(settingsView) {
      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#4A4A6A] dark:text-[#E0E0FF]">Custom System Prompt</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">Define custom instructions for the AI to follow.</p>
              <textarea
                value={localPrompt}
                onChange={(e) => setLocalPrompt(e.target.value)}
                rows={5}
                className="w-full bg-[#E6E0F0] dark:bg-[#2C2C44] rounded-2xl p-3 text-sm text-[#4A4A6A] dark:text-[#E0E0FF] placeholder-slate-500/80 dark:placeholder-slate-400/80 focus:outline-none focus:ring-2 focus:ring-[#A7B9F5] dark:focus:ring-indigo-500 shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58]"
                placeholder="e.g., You are a helpful pirate assistant."
              />
              <div className="flex space-x-2 mt-3">
                <button
                    onClick={handlePromptSave}
                    className={`flex-1 px-4 py-2 font-semibold text-white rounded-2xl transition-all duration-150 ${promptSaved ? 'bg-green-500 shadow-[5px_5px_10px_#1f9e49,-5px_-5px_10px_#25c159]' : 'bg-[#A7B9F5] dark:bg-indigo-500 shadow-[5px_5px_10px_#96a6dc,-5px_-5px_10px_#b8ccff] dark:shadow-[5px_5px_10px_#4f46e5,-5px_-5px_10px_#6f63ff]'}`}
                >
                    {promptSaved ? 'Saved!' : 'Save Prompt'}
                </button>
                <button
                    onClick={handlePromptReset}
                    className="flex-1 px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-[#E6E0F0] dark:bg-[#2C2C44] rounded-2xl shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58]"
                >
                    Reset to Default
                </button>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#4A4A6A] dark:text-[#E0E0FF]">Privacy & Security</h3>
            <p className="text-slate-500 dark:text-slate-400">Privacy settings placeholder. Manage your data, connected accounts, and security preferences here.</p>
          </div>
        );
      case 'help':
        return (
            <div>
                <h3 className="text-xl font-semibold mb-4 text-[#4A4A6A] dark:text-[#E0E0FF]">Help & FAQ</h3>
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                    <div>
                        <h4 className="font-semibold text-[#4A4A6A] dark:text-[#E0E0FF]">How do I start a conversation?</h4>
                        <p>Simply type your message in the input box at the bottom of the screen and press Enter or click the send button.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4A4A6A] dark:text-[#E0E0FF]">How do I clear my chat history?</h4>
                        <p>Open the sidebar menu, go to the "Chat History" section, and click "Clear History". You will be asked to confirm this action.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4A4A6A] dark:text-[#E0E0FF]">Where can I change settings?</h4>
                        <p>All application settings can be found in the sidebar menu under the "Settings" section, including System and Privacy options.</p>
                    </div>
                </div>
            </div>
        );
      default: // 'main'
        return (
          <>
            <SidebarButton icon={<ComputerDesktopIcon />} label="System" onClick={() => setSettingsView('system')} showChevron />
            <SidebarButton icon={<ShieldCheckIcon />} label="Privacy & Security" onClick={() => setSettingsView('privacy')} showChevron />
            <SidebarButton icon={<QuestionMarkCircleIcon />} label="Help & FAQ" onClick={() => setSettingsView('help')} showChevron />
          </>
        );
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 dark:bg-black/50 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-80 bg-[#EDE9F4] dark:bg-[#161625] text-[#4A4A6A] dark:text-[#E0E0FF] z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center border-b border-slate-300/70 dark:border-slate-700">
              <h2 id="sidebar-title" className="text-2xl font-bold">BIna AI Menu</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-300/50 dark:hover:bg-slate-700" aria-label="Close menu">
                  <XMarkIcon className="w-6 h-6"/>
              </button>
          </div>

          <div className="flex-grow p-4 space-y-6 overflow-y-auto">
            {/* Profile Section */}
            <div className="space-y-2">
              <h3 className="px-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Profile</h3>
              <button 
                onClick={onOpenProfile}
                className="w-full flex items-center p-3 space-x-3 text-left rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44] shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58] transition-all duration-150 group"
                aria-label="Edit profile"
              >
                 <UserAvatar avatar={userAvatar} className="w-8 h-8"/>
                 <span className="flex-grow font-semibold text-slate-700 dark:text-slate-200">{username}</span>
                 <PencilIcon className="w-5 h-5 text-slate-400 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>

            {/* Chat History Section */}
            <div className="space-y-2">
              <h3 className="px-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Chat History</h3>
              <SidebarButton icon={<PlusIcon />} label="New Chat" onClick={onNewChat} />
              <SidebarButton icon={<MagnifyingGlassIcon />} label="Search History" onClick={onSearch} />
              <SidebarButton icon={<DocumentArrowDownIcon />} label="Save to Browser" onClick={onSaveHistory} />
              <SidebarButton icon={<DocumentArrowUpIcon />} label="Load from Browser" onClick={onLoadHistory} />
              <SidebarButton icon={<DocumentArrowDownIcon />} label="Export History" onClick={onExportHistory} />
              <SidebarButton icon={<TrashIcon />} label="Clear History" onClick={handleClearClick} />
            </div>

            {/* Settings Section */}
            <div className="space-y-2">
              <h3 className="px-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Settings</h3>
              { settingsView !== 'main' && (
                <SidebarButton icon={<ArrowLeftIcon />} label="Back to Settings" onClick={() => setSettingsView('main')} />
              )}
              <div className="mt-2 space-y-1">
                {renderSettingsContent()}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear Chat History"
      >
        <p>Are you sure you want to permanently delete your entire chat history? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

interface SidebarButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    showChevron?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, onClick, showChevron = false }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center p-3 space-x-3 text-left rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44] shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#1e1e30,inset_-5px_-5px_10px_#3a3a58] transition-all duration-150"
    >
        <span className="text-slate-500 dark:text-slate-400">{icon}</span>
        <span className="flex-grow font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        {showChevron && <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-400" />}
    </button>
);

export default Sidebar;