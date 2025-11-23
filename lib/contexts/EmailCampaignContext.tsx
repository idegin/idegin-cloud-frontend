"use client"

import React, { createContext, useContext, useState } from "react"
import { EmailSection, EmailElement, ProjectBrandGuide } from "@/components/email/email.types"

interface EmailCampaignState {
    sections: EmailSection[]
    elements: EmailElement[]
    activeSection: string | null
    activeElement: string | null
    brandGuide: ProjectBrandGuide | null
}

interface EmailCampaignContextValue {
    state: EmailCampaignState
    setActiveSectionId: (id: string | null) => void
    setActiveElementId: (id: string | null) => void
    updateSectionStyles: (sectionId: string, styles: Record<string, string>) => void
    updateElementStyles: (elementId: string, styles: Record<string, string>) => void
    updateElementContent: (elementId: string, content: Partial<EmailElement>) => void
    setSections: (sections: EmailSection[]) => void
    setElements: (elements: EmailElement[]) => void
    setBrandGuide: (brandGuide: ProjectBrandGuide) => void
}

const EmailCampaignContext = createContext<EmailCampaignContextValue | undefined>(undefined)

export function EmailCampaignProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<EmailCampaignState>({
        sections: [],
        elements: [],
        activeSection: null,
        activeElement: null,
        brandGuide: null,
    })

    const setActiveSectionId = (id: string | null) => {
        setState(prev => ({ ...prev, activeSection: id, activeElement: null }))
    }

    const setActiveElementId = (id: string | null) => {
        setState(prev => ({ ...prev, activeElement: id }))
    }

    const updateSectionStyles = (sectionId: string, styles: Record<string, string>) => {
        setState(prev => ({
            ...prev,
            sections: prev.sections.map(section =>
                section.id === sectionId
                    ? { ...section, styles: { ...section.styles, ...styles } }
                    : section
            ),
        }))
    }

    const updateElementStyles = (elementId: string, styles: Record<string, string>) => {
        setState(prev => ({
            ...prev,
            elements: prev.elements.map(element =>
                element.id === elementId
                    ? { ...element, styles: { ...element.styles, ...styles } }
                    : element
            ),
        }))
    }

    const updateElementContent = (elementId: string, content: Partial<EmailElement>) => {
        setState(prev => ({
            ...prev,
            elements: prev.elements.map(element =>
                element.id === elementId
                    ? { ...element, ...content }
                    : element
            ),
        }))
    }

    const setSections = (sections: EmailSection[]) => {
        setState(prev => ({ ...prev, sections }))
    }

    const setElements = (elements: EmailElement[]) => {
        setState(prev => ({ ...prev, elements }))
    }

    const setBrandGuide = (brandGuide: ProjectBrandGuide) => {
        setState(prev => ({ ...prev, brandGuide }))
    }

    return (
        <EmailCampaignContext.Provider
            value={{
                state,
                setActiveSectionId,
                setActiveElementId,
                updateSectionStyles,
                updateElementStyles,
                updateElementContent,
                setSections,
                setElements,
                setBrandGuide,
            }}
        >
            {children}
        </EmailCampaignContext.Provider>
    )
}

export function useEmailCampaign() {
    const context = useContext(EmailCampaignContext)
    if (!context) {
        throw new Error("useEmailCampaign must be used within EmailCampaignProvider")
    }
    return context
}
