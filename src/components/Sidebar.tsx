import React from 'react';
import { Home, Globe2, Library, LogIn, ChevronLeft, ChevronRight, Brain } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-[#111111] border-r border-gray-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full p-3">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-[#111111] border border-gray-800 rounded-full p-1.5 hover:bg-[#222222] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-[#0095FF]" />
          ) : (
            <ChevronLeft size={16} className="text-[#0095FF]" />
          )}
        </button>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-2 mt-6">
          <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
            <Brain className="h-6 w-6 text-[#0095FF]" />
            {!isCollapsed && <span className="text-white font-semibold">Snap</span>}
          </div>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-[#0095FF] p-3 rounded-lg hover:bg-[#222222] transition-colors">
            <Home size={20} />
            {!isCollapsed && <span>Home</span>}
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-[#0095FF] p-3 rounded-lg hover:bg-[#222222] transition-colors">
            <Globe2 size={20} />
            {!isCollapsed && <span>Discover</span>}
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-[#0095FF] p-3 rounded-lg hover:bg-[#222222] transition-colors">
            <Library size={20} />
            {!isCollapsed && <span>Library</span>}
          </a>
        </nav>

        {/* Auth Section */}
        <div className={`mt-auto flex flex-col gap-3 ${isCollapsed ? 'items-center' : ''}`}>
          {!isCollapsed && (
            <button className="w-full bg-[#0095FF] text-white font-medium rounded-full py-3 hover:bg-[#0080FF] transition-colors">
              Sign Up
            </button>
          )}
          <button className={`flex items-center justify-center gap-3 text-gray-300 hover:text-[#0095FF] p-3 rounded-lg hover:bg-[#222222] transition-colors ${
            isCollapsed ? 'w-10 h-10' : 'w-full'
          }`}>
            <LogIn size={20} />
            {!isCollapsed && <span>Sign in</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}