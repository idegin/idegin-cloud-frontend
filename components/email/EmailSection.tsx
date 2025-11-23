"use client"

import { EmailSection as EmailSectionType, EmailElement } from "./email.types"
import EmailElementComponent from "./EmailElement"
import { cn } from "@/lib/utils"

interface EmailSectionProps {
    section: EmailSectionType
    elements: EmailElement[]
    isActive: boolean
    activeElement: string | null
    onClick: () => void
    onElementClick: (elementId: string) => void
}

export default function EmailSection({
    section,
    elements,
    isActive,
    activeElement,
    onClick,
    onElementClick,
}: EmailSectionProps) {
    const sectionElements = elements
        .filter(elem => elem.sectionId === section.id)
        .sort((a, b) => a.index - b.index)

    return (
        <tr
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            style={{
                cursor: "pointer",
                position: "relative",
            }}
        >
            <td style={{ ...(section.styles as any), position: "relative" }}>
                {isActive && (
                    <div
                        style={{
                            position: "absolute",
                            top: "-1px",
                            left: "-1px",
                            right: "-1px",
                            bottom: "-1px",
                            border: "2px solid #3b82f6",
                            pointerEvents: "none",
                            zIndex: 50,
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "-24px",
                                left: "0",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                padding: "2px 8px",
                                fontSize: "11px",
                                fontWeight: "600",
                                borderRadius: "4px 4px 0 0",
                                pointerEvents: "auto",
                            boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)",

                            }}
                        >
                            <span style={{ cursor: "grab", padding: "0 2px" }}>⋮⋮</span>
                            <span>SECTION</span>
                            <div style={{ marginLeft: "4px", display: "flex", gap: "4px" }}>
                                <button
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "white",
                                        cursor: "pointer",
                                        padding: "2px 4px",
                                        fontSize: "12px",
                                    }}
                                    title="Toggle visibility"
                                >
                                    👁
                                </button>
                                <button
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "white",
                                        cursor: "pointer",
                                        padding: "2px 4px",
                                        fontSize: "12px",
                                    }}
                                    title="Delete section"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                        {sectionElements.map(element => (
                            <EmailElementComponent
                                key={element.id}
                                element={element}
                                isActive={activeElement === element.id}
                                onClick={() => onElementClick(element.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </td>
        </tr>
    )
}