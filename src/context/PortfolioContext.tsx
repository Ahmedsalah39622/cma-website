'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface PortfolioItem {
    id: string;
    title: string;
    company: string;
    category: string;
    image: string;
    year: string;
    description?: string;
}

interface PortfolioContextType {
    items: PortfolioItem[];
    categories: string[];
    addItem: (item: Omit<PortfolioItem, 'id'>) => void;
    updateItem: (id: string, item: Partial<PortfolioItem>) => void;
    deleteItem: (id: string) => void;
    isLoaded: boolean;
}

const STORAGE_KEY = 'cma_portfolio_items';

// Default portfolio items - these will be used if no data exists in localStorage
const defaultItems: PortfolioItem[] = [
    {
        id: '1',
        title: 'Ai Wave - Ai Chatbot Mobile App',
        company: 'Ai Corporation',
        category: 'UI/UX Design',
        image: '/portfolio/ai-wave.jpg',
        year: '2023',
        description: 'Modern AI chatbot interface design'
    },
    {
        id: '2',
        title: 'App Lancer - Freelance Mobile App',
        company: 'Lancer Corporation',
        category: 'Digital Marketing',
        image: '/portfolio/app-lancer.jpg',
        year: '2023',
        description: 'Freelance platform marketing campaign'
    },
    {
        id: '3',
        title: 'Brand Nova - Brand Identity',
        company: 'Metro Labs',
        category: 'Branding',
        image: '/portfolio/brand-nova.jpg',
        year: '2022',
        description: 'Complete brand identity design'
    },
    {
        id: '4',
        title: 'ShopWave - E-commerce UX',
        company: 'Delta Studio',
        category: 'UI/UX Design',
        image: '/portfolio/shopwave.jpg',
        year: '2023',
        description: 'E-commerce user experience redesign'
    },
    {
        id: '5',
        title: 'Nimbus Ads - Campaign',
        company: 'Nimbus',
        category: 'Digital Marketing',
        image: '/portfolio/nimbus-ads.jpg',
        year: '2022',
        description: 'Digital advertising campaign'
    },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Fast synchronous read from localStorage
function getStoredItems(): PortfolioItem[] | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to read portfolio from localStorage:', e);
    }
    return null;
}

// Fast synchronous write to localStorage
function setStoredItems(items: PortfolioItem[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.error('Failed to save portfolio to localStorage:', e);
    }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
    // Initialize with default items, then hydrate from localStorage
    const [items, setItems] = useState<PortfolioItem[]>(defaultItems);
    const [isLoaded, setIsLoaded] = useState(false);

    // Hydrate from localStorage on mount - this is fast!
    useEffect(() => {
        const stored = getStoredItems();
        if (stored && stored.length > 0) {
            setItems(stored);
        } else {
            // First time: save defaults to localStorage
            setStoredItems(defaultItems);
        }
        setIsLoaded(true);
    }, []);

    // Extract unique categories from items
    const categories = React.useMemo(() => {
        const cats = new Set(items.map(item => item.category));
        return ['All Work', ...Array.from(cats)];
    }, [items]);

    // Add new portfolio item
    const addItem = useCallback((item: Omit<PortfolioItem, 'id'>) => {
        const newItem: PortfolioItem = {
            ...item,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        setItems(prev => {
            const updated = [...prev, newItem];
            setStoredItems(updated); // Instant save
            return updated;
        });
    }, []);

    // Update existing portfolio item
    const updateItem = useCallback((id: string, updates: Partial<PortfolioItem>) => {
        setItems(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            );
            setStoredItems(updated); // Instant save
            return updated;
        });
    }, []);

    // Delete portfolio item
    const deleteItem = useCallback((id: string) => {
        setItems(prev => {
            const updated = prev.filter(item => item.id !== id);
            setStoredItems(updated); // Instant save
            return updated;
        });
    }, []);

    return (
        <PortfolioContext.Provider value={{
            items,
            categories,
            addItem,
            updateItem,
            deleteItem,
            isLoaded,
        }}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
}
