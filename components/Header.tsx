
import React from 'react';
import { UserCircleIcon, Cog6ToothIcon, MoonIcon, SunIcon } from './icons';

interface HeaderProps {
    onOpenSidebar: () => void;
    onOpenProfile: () => void;
    onGoHome: () => void;
    onToggleTheme: () => void;
    theme: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({
    onOpenSidebar,
    onOpenProfile,
    onGoHome,
    onToggleTheme,
    theme
}) => {
    return (
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-[#EDE9F4] dark:bg-[#161625] border-b border-slate-300/70 dark:border-slate-700 z-20">
            <h1
                onClick={onGoHome}
                className="group text-xl font-bold tracking-wider text-[#4A4A6A] dark:text-[#E0E0FF] flex cursor-pointer"
            >
                {'BIna AI'.split('').map((letter, index) => (
                    <span
                        key={index}
                        className="transition-transform duration-300 ease-in-out group-hover:-translate-y-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        {letter}
                    </span>
                ))}
            </h1>
            <div className="flex items-center gap-2">
                 <button
                    onClick={onOpenProfile}
                    className="p-3 rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44] shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#11111a,-5px_-5px_10px_#1b1b2f] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#11111a,inset_-5px_-5px_10px_#1b1b2f] transition-all duration-150"
                    aria-label="Open profile"
                >
                    <UserCircleIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={onOpenSidebar}
                    className="p-3 rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44] shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#11111a,-5px_-5px_10px_#1b1b2f] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#11111a,inset_-5px_-5px_10px_#1b1b2f] transition-all duration-150"
                    aria-label="Open settings"
                >
                    <Cog6ToothIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={onToggleTheme}
                    className="p-3 rounded-2xl bg-[#E6E0F0] dark:bg-[#2C2C44] shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#11111a,-5px_-5px_10px_#1b1b2f] active:shadow-[inset_5px_5px_10px_#d8d4e1,inset_-5px_-5px_10px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#11111a,inset_-5px_-5px_10px_#1b1b2f] transition-all duration-150"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
            </div>
        </header>
    );
};