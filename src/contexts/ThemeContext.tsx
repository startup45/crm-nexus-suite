
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

interface ThemeContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // This was causing the error - useStore was being called at the top level
  // instead of inside the function component
  const { theme: storeTheme, toggleTheme: storeToggleTheme } = useStore();
  
  // Create local state to initialize from the store
  const [theme, setTheme] = useState<'light' | 'dark'>(storeTheme);

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Wrap the store's toggleTheme to update our local state
  const toggleTheme = () => {
    storeToggleTheme();
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
