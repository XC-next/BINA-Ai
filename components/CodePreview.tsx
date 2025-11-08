
import React, { useState } from 'react';
import { CodePayload } from '../types';
import { EyeIcon, CodeBracketIcon, ClipboardIcon, CheckIcon } from './icons';

interface CodePreviewProps {
  code: CodePayload;
}

type Tab = 'preview' | 'html' | 'css' | 'js';

const TabButton: React.FC<{ label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
            isActive
                ? 'bg-[#E6E0F0] dark:bg-[#2C2C44] text-indigo-500 dark:text-indigo-400'
                : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
        aria-pressed={isActive}
    >
        {icon}
        {label}
    </button>
);

const CodeBlock: React.FC<{ language: string, content: string, onCopy: () => void, isCopied: boolean }> = ({ language, content, onCopy, isCopied }) => (
    <div className="relative w-full h-full">
        <button 
            onClick={onCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-300/70 dark:hover:bg-slate-600/70 transition-colors"
            aria-label="Copy code"
        >
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardIcon className="w-4 h-4" />}
        </button>
        <pre className="w-full h-full overflow-auto p-3 text-sm"><code className={`language-${language}`}>{content}</code></pre>
    </div>
);

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
    const [activeTab, setActiveTab] = useState<Tab>('preview');
    const [copiedCode, setCopiedCode] = useState<Tab | null>(null);

    const handleCopy = (content: string, type: Tab) => {
        navigator.clipboard.writeText(content);
        setCopiedCode(type);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const srcDoc = `
        <html>
            <head>
                <style>${code.css}</style>
            </head>
            <body>
                ${code.html}
                <script>${code.js}</script>
            </body>
        </html>
    `;

    const renderContent = () => {
        switch (activeTab) {
            case 'preview':
                return (
                    <iframe
                        srcDoc={srcDoc}
                        title="Live Preview"
                        sandbox="allow-scripts"
                        className="w-full h-full border-0"
                    />
                );
            case 'html':
                return <CodeBlock language="html" content={code.html} onCopy={() => handleCopy(code.html, 'html')} isCopied={copiedCode === 'html'} />;
            case 'css':
                return <CodeBlock language="css" content={code.css} onCopy={() => handleCopy(code.css, 'css')} isCopied={copiedCode === 'css'} />;
            case 'js':
                return <CodeBlock language="javascript" content={code.js} onCopy={() => handleCopy(code.js, 'js')} isCopied={copiedCode === 'js'} />;
        }
    };
    
    return (
        <div className="mt-4 border border-slate-300/70 dark:border-slate-700/70 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/20">
            <div className="flex border-b border-slate-300/70 dark:border-slate-700/70 px-2 pt-1 bg-slate-100/50 dark:bg-slate-800/20">
                <TabButton label="Preview" icon={<EyeIcon className="w-4 h-4" />} isActive={activeTab === 'preview'} onClick={() => setActiveTab('preview')} />
                <TabButton label="HTML" icon={<CodeBracketIcon className="w-4 h-4" />} isActive={activeTab === 'html'} onClick={() => setActiveTab('html')} />
                <TabButton label="CSS" icon={<CodeBracketIcon className="w-4 h-4" />} isActive={activeTab === 'css'} onClick={() => setActiveTab('css')} />
                {/* FIX: Corrected typo 'TabB' to 'TabButton', removed extraneous XML tags, and added the JS tab button. */}
                <TabButton label="JS" icon={<CodeBracketIcon className="w-4 h-4" />} isActive={activeTab === 'js'} onClick={() => setActiveTab('js')} />
            </div>
            {/* FIX: Added the content area to render the selected tab's view. */}
            <div className="h-64 w-full bg-[#E6E0F0] dark:bg-[#2C2C44]">
                {renderContent()}
            </div>
        </div>
    );
};
