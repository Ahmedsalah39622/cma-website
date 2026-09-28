'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UIContextType = {
  isSidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('services');

  // Handle responsiveness (auto-collapse sidebar on smaller viewports)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(true);
      }
    };
    
    // Initial call
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

  return (
    <UIContext.Provider
      value={{
        isSidebarExpanded,
        setSidebarExpanded,
        toggleSidebar,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
