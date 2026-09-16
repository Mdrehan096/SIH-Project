import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type DensityMode = 'comfortable' | 'compact';
export type FontSizeMode = 'small' | 'medium' | 'large';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  density: DensityMode;
  setDensity: (d: DensityMode) => void;
  fontSize: FontSizeMode;
  setFontSize: (f: FontSizeMode) => void;
  mapStyle: string;
  setMapStyle: (m: string) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  density: 'comfortable',
  setDensity: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  mapStyle: 'standard',
  setMapStyle: () => {},
  effectiveTheme: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('retrack_theme') as ThemeMode) || 'light';
  });

  const [density, setDensityState] = useState<DensityMode>(() => {
    return (localStorage.getItem('retrack_density') as DensityMode) || 'comfortable';
  });

  const [fontSize, setFontSizeState] = useState<FontSizeMode>(() => {
    return (localStorage.getItem('retrack_fontsize') as FontSizeMode) || 'medium';
  });

  const [mapStyle, setMapStyleState] = useState<string>(() => {
    return localStorage.getItem('retrack_mapstyle') || 'standard';
  });

  const effectiveTheme: 'light' | 'dark' =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    // Apply Density Classes
    root.classList.remove('density-comfortable', 'density-compact');
    root.classList.add(`density-${density}`);

    // Apply Font Size Classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);
  }, [effectiveTheme, density, fontSize]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('retrack_theme', t);
  };

  const setDensity = (d: DensityMode) => {
    setDensityState(d);
    localStorage.setItem('retrack_density', d);
  };

  const setFontSize = (f: FontSizeMode) => {
    setFontSizeState(f);
    localStorage.setItem('retrack_fontsize', f);
  };

  const setMapStyle = (m: string) => {
    setMapStyleState(m);
    localStorage.setItem('retrack_mapstyle', m);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        density,
        setDensity,
        fontSize,
        setFontSize,
        mapStyle,
        setMapStyle,
        effectiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
