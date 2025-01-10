import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#4CAF50',
    secondary: '#2196F3',
    danger: '#F44336',
    edit: '#2196F3',
    calendar: '#9C27B0',
    border: '#ddd',
    tabBackground: '#ffffff',
    activeTab: '#2196F3',
    inputBackground: '#ffffff',
    social: {
      instagram: '#E1306C',
      linkedin: '#0077B5',
      github: '#333333',
      portfolio: '#4CAF50'
    }
  },
  dark: {
    name: 'dark',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    primary: '#81c784',
    secondary: '#64b5f6',
    danger: '#e57373',
    edit: '#64b5f6',
    calendar: '#ce93d8',
    border: '#333333',
    tabBackground: '#1e1e1e',
    activeTab: '#64b5f6',
    inputBackground: '#2c2c2c',
    social: {
      instagram: '#E1306C',
      linkedin: '#0077B5',
      github: '#ffffff',
      portfolio: '#81c784'
    }
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(themes.dark);

  const toggleTheme = () => {
    setTheme(theme === themes.light ? themes.dark : themes.light);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 