"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { mockEmailSections, mockEmailElements, mockBrandGuide } from "./email.mock"
import { useEmailCampaign } from "@/lib/contexts/EmailCampaignContext"
import EmailSectionComponent from "./EmailSection"
import CampaignPropertiesPanel from "./CampaignPropertiesPanel"
import { cn } from "@/lib/utils"

export default function CampaignBuilder() {
    const { state, setSections, setElements, setBrandGuide, setActiveSectionId, setActiveElementId, updateSectionStyles, updateElementStyles, updateElementContent } = useEmailCampaign();
    const panelOpen = state.activeSection || state.activeElement;

    const handleElementClick = (elementId: string, sectionId: string) => {
        setActiveSectionId(sectionId)
        setActiveElementId(elementId)
    }

    useEffect(() => {
        if (state.sections.length === 0) {
            setSections(mockEmailSections)
        }
        if (state.elements.length === 0) {
            setElements(mockEmailElements)
        }
        if (!state.brandGuide) {
            setBrandGuide(mockBrandGuide)
        }
    }, [])

    const sortedSections = [...state.sections].sort((a, b) => a.index - b.index)

    return (
        <div className="flex items-start gap-6">
            <div className="flex-1">
                <Card className="overflow-hidden p-8 bg-gray-50">
                    <div className="max-w-[600px] mx-auto bg-white shadow-lg">
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
                            <tbody>
                                {sortedSections.map(section => (
                                    <EmailSectionComponent
                                        key={section.id}
                                        section={section}
                                        elements={state.elements}
                                        isActive={state.activeSection === section.id}
                                        activeElement={state.activeElement}
                                        onClick={() => {
                                            setActiveSectionId(section.id)
                                        }}
                                        onElementClick={(elementId) => {
                                            handleElementClick(elementId, section.id)
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <div className={cn("duration-300 ease-in-out sticky top-[1rem]",{
                "w-[30rem] grid grid-cols-1": panelOpen,
                "w-[0rem]": !panelOpen,
            })}>
                {(state.activeSection || state.activeElement) && (
                    <CampaignPropertiesPanel
                        activeSection={state.sections.find(s => s.id === state.activeSection) || null}
                        activeElement={state.elements.find(e => e.id === state.activeElement) || null}
                        brandGuide={state.brandGuide}
                        onUpdateSectionStyles={updateSectionStyles}
                        onUpdateElementStyles={updateElementStyles}
                        onUpdateElementContent={updateElementContent}
                        onClose={() => {
                            setActiveSectionId(null)
                            setActiveElementId(null)
                        }}
                    />
                )}
            </div>
        </div>
    )
}
