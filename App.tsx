
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { ChatMessage, Product } from './types';
import { generateChatResponse, generateCode } from './services/geminiService';
import { PaperAirplaneIcon, MicrophoneIcon, CodeBracketIcon } from './components/icons';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { SearchModal } from './components/SearchModal';
import { ProfilePage } from './components/ProfilePage';
import { HomePage } from './components/HomePage';
import { Header } from './components/Header';

// Fix for SpeechRecognition API not being in standard TypeScript lib
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

type Theme = 'light' | 'dark';

const DEFAULT_SYSTEM_INSTRUCTION = "You are BIna AI, a helpful and friendly shopping assistant. Your goal is to help users find products, give recommendations, and make their shopping experience enjoyable. Use the `findProducts` tool to provide product suggestions when the user asks for them. Be concise and friendly.";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm BIna AI, your personal shopping assistant. How can I help you today?\n\nTo ask me to generate code, start your message with `/code`. For example: `/code create a blue button that says 'Click Me'`", timestamp: new Date() }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('John Doe');
  const [userAvatar, setUserAvatar] = useState<string>('default');
  const [isRecording, setIsRecording] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [systemInstruction, setSystemInstruction] = useState(DEFAULT_SYSTEM_INSTRUCTION);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProfilePageOpen, setIsProfilePageOpen] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const savedUsername = localStorage.getItem('shoppyUsername');
    if (savedUsername) {
        setUsername(savedUsername);
    }
    const savedAvatar = localStorage.getItem('shoppyUserAvatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
    const savedTheme = localStorage.getItem('shoppyTheme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    }
    const savedInstruction = localStorage.getItem('shoppySystemInstruction');
    if (savedInstruction) {
        setSystemInstruction(savedInstruction);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('shoppyTheme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('shoppySystemInstruction', systemInstruction);
  }, [systemInstruction]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        setUserInput(finalTranscript + interimTranscript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (trimmedInput === '' || isLoading) return;
    if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
    }

    const newUserMessage: ChatMessage = { role: 'user', content: trimmedInput, timestamp: new Date() };
    const updatedHistory = [...chatHistory, newUserMessage];
    
    setChatHistory(updatedHistory);
    setUserInput('');
    textareaRef.current?.style.setProperty('height', 'auto');
    setIsLoading(true);

    if (trimmedInput.toLowerCase().startsWith('/code ')) {
        const prompt = trimmedInput.substring(6);
        const codeJsonResponse = await generateCode(prompt);
        try {
            const codePayload = JSON.parse(codeJsonResponse);
            const modelMessage: ChatMessage = {
                role: 'model',
                content: "Here is the code you requested. You can see the live preview and the code in the tabs below.",
                code: codePayload,
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Failed to parse code JSON:", error);
            const errorMessage: ChatMessage = {
                role: 'model',
                content: `I tried to generate the code, but something went wrong. Here's the raw data I received:\n\n\`\`\`\n${codeJsonResponse}\n\`\`\``,
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, errorMessage]);
        }
    } else {
        const response = await generateChatResponse(updatedHistory, systemInstruction);
        const modelResponseText = response.text;
        const functionCalls = response.functionCalls;
        let products: Product[] | undefined = undefined;

        if (functionCalls) {
            for (const fc of functionCalls) {
                if (fc.name === 'findProducts') {
                    products = fc.args.products;
                }
            }
        }

        const modelMessage: ChatMessage = { 
            role: 'model', 
            content: modelResponseText, 
            timestamp: new Date(),
            products: products
        };
        setChatHistory(prevHistory => [...prevHistory, modelMessage]);
    }
    
    setIsLoading(false);
  };
  
  const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setChatHistory([{ role: 'model', content: "Hello! I'm BIna AI. How can I assist you with your shopping?", timestamp: new Date() }]);
  };

  const handleNewChat = () => {
    setChatHistory([
        { role: 'model', content: "Hello! I'm BIna AI, your personal shopping assistant. How can I help you today?", timestamp: new Date() }
    ]);
    setIsSidebarOpen(false);
  };
  
  const handleSaveHistory = () => {
    if (chatHistory.length > 1) {
      localStorage.setItem('shoppyChatHistory', JSON.stringify(chatHistory));
      alert('Chat history saved to browser!');
    } else {
      alert('Nothing to save.');
    }
  };

  const handleLoadHistory = () => {
    const savedHistory = localStorage.getItem('shoppyChatHistory');
    if (savedHistory) {
      try {
        const parsedHistory: ChatMessage[] = JSON.parse(savedHistory);
        const historyWithDates = parsedHistory.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setChatHistory(historyWithDates);
        alert('Chat history loaded from browser!');
      } catch (e) {
        alert('Could not load chat history. The data may be corrupted.');
        localStorage.removeItem('shoppyChatHistory');
      }
    } else {
      alert('No saved history found in browser.');
    }
  };

  const handleExportHistory = () => {
    if (chatHistory.length <= 1 && chatHistory[0]?.content.startsWith("Hello!")) {
      alert('No conversation to export.');
      return;
    }

    const formattedHistory = chatHistory.map(msg => {
      const sender = msg.role === 'user' ? username : 'BIna AI';
      const timestamp = msg.timestamp.toLocaleString();
      return `[${timestamp}] ${sender}:\n${msg.content}`;
    }).join('\n\n----------------------------------------\n\n');

    const blob = new Blob([formattedHistory], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `BIna-AI-Chat-History-${date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleProfileSave = (newUsername: string, newAvatar: string) => {
    setUsername(newUsername);
    setUserAvatar(newAvatar);
    localStorage.setItem('shoppyUsername', newUsername);
    localStorage.setItem('shoppyUserAvatar', newAvatar);
    setIsProfilePageOpen(false);
  };

  const handleGenerateExample = (prompt: string) => {
    setShowHomePage(false);
    setUserInput(prompt);
  };

  return (
    <div className="h-screen w-screen bg-[#F5F3F7] dark:bg-[#1A1A2E] text-[#4A4A6A] dark:text-[#E0E0FF] flex flex-col overflow-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onClearHistory={handleClearHistory}
        username={username}
        userAvatar={userAvatar}
        onSaveHistory={handleSaveHistory}
        onLoadHistory={handleLoadHistory}
        onExportHistory={handleExportHistory}
        onNewChat={handleNewChat}
        onSearch={() => setIsSearchModalOpen(true)}
        onOpenProfile={() => { setIsProfilePageOpen(true); setIsSidebarOpen(false); }}
        systemInstruction={systemInstruction}
        onSystemInstructionChange={setSystemInstruction}
        defaultSystemInstruction={DEFAULT_SYSTEM_INSTRUCTION}
      />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} history={chatHistory} />
      <ProfilePage isOpen={isProfilePageOpen} onClose={() => setIsProfilePageOpen(false)} onSave={handleProfileSave} initialUsername={username} initialAvatar={userAvatar} />
      
      <Header 
        onGoHome={() => setShowHomePage(true)}
        onOpenProfile={() => setIsProfilePageOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        theme={theme}
      />

      {showHomePage ? (
        <HomePage onStartChat={() => setShowHomePage(false)} onGenerateExample={handleGenerateExample} />
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" role="log" aria-live="polite">
            {chatHistory.map((msg, index) => ( <ChatMessageBubble key={index} message={msg} userAvatar={userAvatar} /> ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex-shrink-0 bg-[#B9FBC0] dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-lg text-green-800 dark:text-green-200 shadow-[5px_5px_10px_#addec2,-5px_-5px_10px_#c5ffbe] dark:shadow-[5px_5px_10px_#1f4e24,-5px_-5px_10px_#2d6e35]">B</div>
                <div className="max-w-lg p-4 rounded-3xl bg-[#F0F0F0] dark:bg-[#2C2C44] rounded-bl-lg shadow-[5px_5px_10px_#dcdcdc,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58]">
                  <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                      <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                      <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 p-4 bg-[#EDE9F4]/80 dark:bg-[#161625]/80 border-t border-slate-300/70 dark:border-slate-700 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <form 
                className="flex items-end gap-2 p-2 pr-3 bg-white dark:bg-[#2C2C44] rounded-2xl border border-slate-300 dark:border-slate-600 focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:border-indigo-500 transition-all"
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              >
                <div className="relative group flex items-center justify-center self-center pl-1">
                  <CodeBracketIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Start with <strong>/code</strong> to generate UI.
                    <svg className="absolute text-slate-800 dark:text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={userInput}
                  onChange={handleUserInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for products, or use /code to generate UI..."
                  className="flex-1 w-full bg-transparent px-2 py-2 text-base text-[#4A4A6A] dark:text-[#E0E0FF] placeholder-slate-500/80 dark:placeholder-slate-400/80 focus:outline-none resize-none max-h-48"
                  disabled={isLoading}
                  aria-label="Chat input"
                />
                <button
                    type="button"
                    onClick={handleToggleRecording}
                    className={`p-2 rounded-full transition-colors duration-200 ${ isRecording ? 'bg-red-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700' }`}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    aria-pressed={isRecording}
                > <MicrophoneIcon className="w-6 h-6"/> </button>
                <button
                  type="submit"
                  disabled={isLoading || userInput.trim() === ''}
                  className="p-2 bg-indigo-500 rounded-full disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white transition-colors"
                  aria-label="Send message"
                > <PaperAirplaneIcon className="w-6 h-6"/> </button>
              </form>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default App;