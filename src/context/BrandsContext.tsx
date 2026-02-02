'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface BrandItem {
    id: string;
    name: string;
    image: string; // Base64 or URL
}

interface BrandsContextType {
    brands: BrandItem[];
    addBrand: (brand: Omit<BrandItem, 'id'>) => void;
    deleteBrand: (id: string) => void;
    isLoaded: boolean;
}

const STORAGE_KEY = 'cma_brands_items';

// Default brands (using the previous hardcoded ones might be tricky with SVGs vs Images, 
// so we'll start empty or let the user populate. 
// Ideally, we'd have default images, but for now we'll start fresh or with placeholders if needed.
// Given the user wants to *manage* them, starting fresh or preserving what's in local storage is best.)
const defaultBrands: BrandItem[] = [];

const BrandsContext = createContext<BrandsContextType | undefined>(undefined);

function getStoredBrands(): BrandItem[] | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to read brands from localStorage:', e);
    }
    return null;
}

function setStoredBrands(brands: BrandItem[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    } catch (e) {
        console.error('Failed to save brands to localStorage:', e);
    }
}

interface BrandsProviderProps {
    children: ReactNode;
    initialBrands?: BrandItem[];
}

export function BrandsProvider({ children, initialBrands = [] }: BrandsProviderProps) {
    const [brands, setBrands] = useState<BrandItem[]>(initialBrands.length > 0 ? initialBrands : defaultBrands);
    const [isLoaded, setIsLoaded] = useState(initialBrands.length > 0);

    useEffect(() => {
        // Only load from localStorage if we don't have server-side data
        if (initialBrands.length === 0) {
            const stored = getStoredBrands();
            if (stored && stored.length > 0) {
                setBrands(stored);
            }
        }
        setIsLoaded(true);
    }, [initialBrands]);

    const addBrand = useCallback((brand: Omit<BrandItem, 'id'>) => {
        const newBrand: BrandItem = {
            ...brand,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        setBrands(prev => {
            const updated = [...prev, newBrand];
            setStoredBrands(updated);
            return updated;
        });
    }, []);

    const deleteBrand = useCallback((id: string) => {
        setBrands(prev => {
            const updated = prev.filter(item => item.id !== id);
            setStoredBrands(updated);
            return updated;
        });
    }, []);

    return (
        <BrandsContext.Provider value={{
            brands,
            addBrand,
            deleteBrand,
            isLoaded,
        }}>
            {children}
        </BrandsContext.Provider>
    );
}

export function useBrands() {
    const context = useContext(BrandsContext);
    if (context === undefined) {
        throw new Error('useBrands must be used within a BrandsProvider');
    }
    return context;
}
