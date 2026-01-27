'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Service {
    id: string;
    title: string;
    count: string;
    iconType: 'grid' | 'code' | 'support' | 'users' | 'design' | 'marketing' | 'business' | 'chart' | 'globe' | 'star';
}

interface ServicesContextType {
    services: Service[];
    addService: (service: Omit<Service, 'id'>) => void;
    updateService: (id: string, service: Partial<Service>) => void;
    deleteService: (id: string) => void;
    reorderServices: (services: Service[]) => void;
    moreCount: number;
    setMoreCount: (count: number) => void;
    moreOptionsText: string;
    setMoreOptionsText: (text: string) => void;
    isLoaded: boolean;
}

const defaultServices: Service[] = [
    { id: '1', title: 'Project Management', count: '30 options available', iconType: 'grid' },
    { id: '2', title: 'Web & Mobile Development', count: '40 options available', iconType: 'code' },
    { id: '3', title: 'Customer Support', count: '17 options available', iconType: 'support' },
    { id: '4', title: 'Human Resources', count: '21 options available', iconType: 'users' },
    { id: '5', title: 'Design & Creatives', count: '13 options available', iconType: 'design' },
    { id: '6', title: 'Marketing & Communication', count: '27 options available', iconType: 'marketing' },
    { id: '7', title: 'Business Development', count: '22 options available', iconType: 'business' },
];

const SERVICES_STORAGE_KEY = 'cma_services';
const MORE_COUNT_KEY = 'cma_services_more_count';
const MORE_OPTIONS_KEY = 'cma_services_more_options';

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [moreCount, setMoreCountState] = useState(4);
    const [moreOptionsText, setMoreOptionsTextState] = useState('170+ options available');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(SERVICES_STORAGE_KEY);
        const storedMoreCount = localStorage.getItem(MORE_COUNT_KEY);
        const storedMoreOptions = localStorage.getItem(MORE_OPTIONS_KEY);

        if (stored) {
            setServices(JSON.parse(stored));
        } else {
            setServices(defaultServices);
        }

        if (storedMoreCount) setMoreCountState(parseInt(storedMoreCount));
        if (storedMoreOptions) setMoreOptionsTextState(storedMoreOptions);

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
        }
    }, [services, isLoaded]);

    const addService = useCallback((service: Omit<Service, 'id'>) => {
        const newService = { ...service, id: Date.now().toString() };
        setServices(prev => [...prev, newService]);
    }, []);

    const updateService = useCallback((id: string, updates: Partial<Service>) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    const deleteService = useCallback((id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
    }, []);

    const reorderServices = useCallback((newOrder: Service[]) => {
        setServices(newOrder);
    }, []);

    const setMoreCount = useCallback((count: number) => {
        setMoreCountState(count);
        localStorage.setItem(MORE_COUNT_KEY, count.toString());
    }, []);

    const setMoreOptionsText = useCallback((text: string) => {
        setMoreOptionsTextState(text);
        localStorage.setItem(MORE_OPTIONS_KEY, text);
    }, []);

    return (
        <ServicesContext.Provider value={{
            services,
            addService,
            updateService,
            deleteService,
            reorderServices,
            moreCount,
            setMoreCount,
            moreOptionsText,
            setMoreOptionsText,
            isLoaded,
        }}>
            {children}
        </ServicesContext.Provider>
    );
};

export const useServices = (): ServicesContextType => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};

// Icon components for use in services
export const ServiceIcons: Record<Service['iconType'], React.ReactNode> = {
    grid: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    code: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    support: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    users: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    design: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    ),
    marketing: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    business: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    chart: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    globe: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    star: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    ),
};
