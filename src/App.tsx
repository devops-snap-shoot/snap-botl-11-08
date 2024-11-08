import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SearchResults from './components/SearchResults';

export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-black text-white">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Routes>
            <Route path="/" element={<MainContent isCollapsed={isCollapsed} />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}