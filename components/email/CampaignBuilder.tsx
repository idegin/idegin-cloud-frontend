"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { mockEmailSections, mockEmailElements } from "./email.mock"
import { EmailSection, EmailElement } from "./email.types"
import EmailSectionComponent from "./EmailSection"

interface CampaignBuilderProps {
    value?: {
        sections: EmailSection[]
        elements: EmailElement[]
    }
    onChange?: (data: { sections: EmailSection[]; elements: EmailElement[] }) => void
}

export default function CampaignBuilder({ value, onChange }: CampaignBuilderProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [activeElement, setActiveElement] = useState<string | null>(null)

    const sections = value?.sections || mockEmailSections
    const elements = value?.elements || mockEmailElements

    const sortedSections = sections.sort((a, b) => a.index - b.index)

    return (
        <Card className="overflow-hidden p-8 bg-gray-50">
            <div className="max-w-[600px] mx-auto bg-white shadow-lg">
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
                    <tbody>
                        {sortedSections.map(section => (
                            <EmailSectionComponent
                                key={section.id}
                                section={section}
                                elements={elements}
                                isActive={activeSection === section.id}
                                activeElement={activeElement}
                                onClick={() => {
                                    setActiveSection(section.id)
                                    setActiveElement(null)
                                }}
                                onElementClick={(elementId) => {
                                    setActiveElement(elementId)
                                    setActiveSection(section.id)
                                }}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
