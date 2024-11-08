import React, { useState } from 'react';
import { Focus, Paperclip, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MainContentProps {
  isCollapsed: boolean;
}

export default function MainContent({ isCollapsed }: MainContentProps) {
  const [question, setQuestion] = useState('');
  const [isPro, setIsPro] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (question.trim()) {
      navigate(`/search?q=${encodeURIComponent(question.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#111111] to-black">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-6xl font-medium mb-24 mt-20 animate-fade-in">
          <span className="text-[#0095FF]">AI</span>
          <span className="text-white"> - Web Search</span>
        </h1>

        <div className="relative w-full">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-[#222222] text-white rounded-xl p-6 pr-32 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#0095FF] border border-gray-800 placeholder-gray-500"
            placeholder="Ask anything..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearch();
              }
            }}
          />

          <div className="absolute bottom-6 right-6 flex items-center gap-4">
            <button className="text-gray-400 hover:text-[#0095FF] transition-colors p-2">
              <Focus size={20} />
            </button>
            <button className="text-gray-400 hover:text-[#0095FF] transition-colors p-2">
              <Paperclip size={20} />
            </button>
            <button
              onClick={handleSearch}
              className="bg-[#0095FF] text-white p-3 rounded-lg hover:bg-[#0080FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!question.trim()}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <span>Focus</span>
            <kbd className="px-2 py-1 bg-[#222222] rounded text-xs border border-gray-800">
              ⌘
            </kbd>
            <kbd className="px-2 py-1 bg-[#222222] rounded text-xs border border-gray-800">
              F
            </kbd>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Attach</span>
            <kbd className="px-2 py-1 bg-[#222222] rounded text-xs border border-gray-800">
              ⌘
            </kbd>
            <kbd className="px-2 py-1 bg-[#222222] rounded text-xs border border-gray-800">
              U
            </kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsPro(!isPro)}
              className="w-12 h-6 bg-[#222222] rounded-full relative cursor-pointer transition-colors border border-gray-800"
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#0095FF] rounded-full transition-transform duration-200 ${
                  isPro ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-gray-400">Pro</span>
          </div>
        </div>
      </div>
    </main>
  );
}