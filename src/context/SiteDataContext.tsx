'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    bgColor: string;
}

export interface ContactInfo {
    email: string;
    address: string;
    addressLine2: string;
    phone: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    website: string;
    message: string;
    submittedAt: string;
    read: boolean;
}

export interface Visibility {
    hero: boolean;
    brands: boolean;
    portfolio: boolean;
    services: boolean;
    testimonials: boolean;
    team: boolean;
    faq: boolean;
    blog: boolean;
    cta: boolean;
    contact: boolean;
}

interface SiteDataContextType {
    // Team
    teamMembers: TeamMember[];
    addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
    updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
    deleteTeamMember: (id: string) => void;

    // Contact Info
    contactInfo: ContactInfo;
    updateContactInfo: (info: Partial<ContactInfo>) => void;

    // Contact Submissions
    contactSubmissions: ContactSubmission[];
    addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'submittedAt' | 'read'>) => void;
    markSubmissionRead: (id: string) => void;
    deleteSubmission: (id: string) => void;

    // Visibility
    visibility: Visibility;

    isLoaded: boolean;
}

const defaultContactInfo: ContactInfo = {
    email: 'contact@cma-agency.com',
    address: '123 Business Center',
    addressLine2: 'Cairo, Egypt',
    phone: '+20 123 456 7890',
};

const defaultVisibility: Visibility = {
    hero: true,
    brands: true,
    portfolio: true,
    services: true,
    testimonials: true,
    team: true,
    faq: true,
    blog: true,
    cta: true,
    contact: true
};

const defaultTeamMembers: TeamMember[] = [
    { id: '1', name: 'John Smith', role: 'Company CEO', image: '', bgColor: '#FFE4C4' },
    { id: '2', name: 'David Johnson', role: 'Co-Founder', image: '', bgColor: '#FFB6C1' },
    { id: '3', name: 'Mary Johnson', role: 'Property Managers', image: '', bgColor: '#B0E0E6' },
    { id: '4', name: 'Patricia Davis', role: 'Estate Consultant', image: '', bgColor: '#FFDAB9' },
];

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

const TEAM_STORAGE_KEY = 'cma_team_members';
const CONTACT_INFO_STORAGE_KEY = 'cma_contact_info';
const CONTACT_SUBMISSIONS_STORAGE_KEY = 'cma_contact_submissions';

interface SiteDataProviderProps {
    children: ReactNode;
    initialVisibility?: Partial<Visibility>;
    initialContact?: Partial<ContactInfo>;
    initialTeam?: TeamMember[];
}

export function SiteDataProvider({
    children,
    initialVisibility,
    initialContact,
    initialTeam
}: SiteDataProviderProps) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam || defaultTeamMembers);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ ...defaultContactInfo, ...initialContact });
    const [visibility, setVisibility] = useState<Visibility>({ ...defaultVisibility, ...initialVisibility });
    const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
    const [isLoaded, setIsLoaded] = useState(!!initialTeam || !!initialContact);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            if (!initialTeam) {
                const storedTeam = localStorage.getItem(TEAM_STORAGE_KEY);
                if (storedTeam) setTeamMembers(JSON.parse(storedTeam));
            }

            if (!initialContact) {
                const storedContactInfo = localStorage.getItem(CONTACT_INFO_STORAGE_KEY);
                if (storedContactInfo) setContactInfo(prev => ({ ...prev, ...JSON.parse(storedContactInfo) }));
            }

            const storedSubmissions = localStorage.getItem(CONTACT_SUBMISSIONS_STORAGE_KEY);
            if (storedSubmissions) setContactSubmissions(JSON.parse(storedSubmissions));
        } catch (error) {
            console.error('Error loading site data:', error);
        }
        setIsLoaded(true);
    }, [initialTeam, initialContact]);

    // Save team members
    const saveTeamMembers = useCallback((members: TeamMember[]) => {
        setTeamMembers(members);
        try {
            localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
        } catch (error) {
            console.error('Error saving team members:', error);
        }
    }, []);

    // Save contact info
    const saveContactInfo = useCallback((info: ContactInfo) => {
        setContactInfo(info);
        try {
            localStorage.setItem(CONTACT_INFO_STORAGE_KEY, JSON.stringify(info));
        } catch (error) {
            console.error('Error saving contact info:', error);
        }
    }, []);

    // Save submissions
    const saveSubmissions = useCallback((submissions: ContactSubmission[]) => {
        setContactSubmissions(submissions);
        try {
            localStorage.setItem(CONTACT_SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
        } catch (error) {
            console.error('Error saving submissions:', error);
        }
    }, []);

    // Team CRUD
    const addTeamMember = useCallback((member: Omit<TeamMember, 'id'>) => {
        const newMember: TeamMember = { ...member, id: Date.now().toString() };
        saveTeamMembers([...teamMembers, newMember]);
    }, [teamMembers, saveTeamMembers]);

    const updateTeamMember = useCallback((id: string, member: Partial<TeamMember>) => {
        saveTeamMembers(teamMembers.map(m => m.id === id ? { ...m, ...member } : m));
    }, [teamMembers, saveTeamMembers]);

    const deleteTeamMember = useCallback((id: string) => {
        saveTeamMembers(teamMembers.filter(m => m.id !== id));
    }, [teamMembers, saveTeamMembers]);

    // Contact Info
    const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
        saveContactInfo({ ...contactInfo, ...info });
    }, [contactInfo, saveContactInfo]);

    // Submissions
    const addContactSubmission = useCallback((submission: Omit<ContactSubmission, 'id' | 'submittedAt' | 'read'>) => {
        const newSubmission: ContactSubmission = {
            ...submission,
            id: Date.now().toString(),
            submittedAt: new Date().toISOString(),
            read: false,
        };
        saveSubmissions([newSubmission, ...contactSubmissions]);
    }, [contactSubmissions, saveSubmissions]);

    const markSubmissionRead = useCallback((id: string) => {
        saveSubmissions(contactSubmissions.map(s => s.id === id ? { ...s, read: true } : s));
    }, [contactSubmissions, saveSubmissions]);

    const deleteSubmission = useCallback((id: string) => {
        saveSubmissions(contactSubmissions.filter(s => s.id !== id));
    }, [contactSubmissions, saveSubmissions]);

    return (
        <SiteDataContext.Provider
            value={{
                teamMembers,
                addTeamMember,
                updateTeamMember,
                deleteTeamMember,
                contactInfo,
                updateContactInfo,
                contactSubmissions,
                addContactSubmission,
                markSubmissionRead,
                deleteSubmission,
                visibility,
                isLoaded,
            }}
        >
            {children}
        </SiteDataContext.Provider>
    );
}

export function useSiteData() {
    const context = useContext(SiteDataContext);
    if (!context) {
        throw new Error('useSiteData must be used within a SiteDataProvider');
    }
    return context;
}
