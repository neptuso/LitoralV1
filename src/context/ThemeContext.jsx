import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    CITRUS: 'citrus',
    OCEAN: 'ocean',
    FOREST: 'forest',
    SUNSET: 'sunset',
};

const THEME_LABELS = {
    [THEMES.LIGHT]: 'Claro',
    [THEMES.DARK]: 'Oscuro',
    [THEMES.CITRUS]: 'Citrus 🍊',
    [THEMES.OCEAN]: 'Océano',
    [THEMES.FOREST]: 'Bosque',
    [THEMES.SUNSET]: 'Atardecer',
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Load theme from localStorage or default to citrus
        const savedTheme = localStorage.getItem('litoralcitrus-theme');
        return savedTheme || THEMES.CITRUS;
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        // Save to localStorage
        localStorage.setItem('litoralcitrus-theme', theme);
    }, [theme]);

    const changeTheme = (newTheme) => {
        if (Object.values(THEMES).includes(newTheme)) {
            setTheme(newTheme);
        }
    };

    const value = {
        theme,
        setTheme: changeTheme,
        themes: THEMES,
        themeLabels: THEME_LABELS,
        availableThemes: Object.entries(THEME_LABELS).map(([value, label]) => ({
            value,
            label,
        })),
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { THEMES, THEME_LABELS };
