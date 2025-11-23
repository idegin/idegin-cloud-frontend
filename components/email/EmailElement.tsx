"use client"

import { EmailElement as EmailElementType } from "./email.types"
import { cn } from "@/lib/utils"

interface EmailElementProps {
    element: EmailElementType
    isActive: boolean
    onClick: () => void
}

export default function EmailElement({ element, isActive, onClick }: EmailElementProps) {
    const getElementTypeLabel = () => {
        switch (element.type) {
            case "text": return "TEXT"
            case "link": return "LINK"
            case "image": return "IMAGE"
            case "divider": return "DIVIDER"
            case "spacer": return "SPACER"
            case "frame": return "FRAME"
            default: return "ELEMENT"
        }
    }

    const renderContent = () => {
        switch (element.type) {
            case "text":
                return (
                    <p
                        style={element.styles as any}
                        dangerouslySetInnerHTML={{ __html: element.textContent || "" }}
                    />
                )

            case "link":
                return (
                    <a href={element.href || "#"} style={element.styles as any}>
                        {element.textContent}
                    </a>
                )

            case "image":
                return (
                    <img
                        src={element.src || ""}
                        alt={element.altText || ""}
                        style={element.styles as any}
                    />
                )

            case "divider":
                return <div style={element.styles as any} />

            case "spacer":
                return <div style={element.styles as any} />

            case "frame":
                return (
                    <table style={{ width: "100%", borderCollapse: "collapse", ...(element.styles as any) }}>
                        <tbody>
                            <tr>
                                <td dangerouslySetInnerHTML={{ __html: element.textContent || "" }} />
                            </tr>
                        </tbody>
                    </table>
                )

            default:
                return null
        }
    }

    const padding = element.type === "spacer" ? "0" : element.type === "divider" ? "10px 0" : "5px 0"

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
            <td style={{ padding, position: "relative" }}>
                {renderContent()}
                {isActive && (
                    <div
                        style={{
                            position: "absolute",
                            top: "-1px",
                            left: "-1px",
                            right: "-1px",
                            bottom: "-1px",
                            border: "2px dashed #8b5cf6",
                            pointerEvents: "none",
                            zIndex: 20,
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "-22px",
                                left: "0",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#8b5cf6",
                                color: "white",
                                padding: "2px 6px",
                                fontSize: "10px",
                                fontWeight: "600",
                                borderRadius: "3px 3px 0 0",
                                pointerEvents: "auto",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <span style={{ cursor: "grab", padding: "0 2px", fontSize: "10px" }}>⋮⋮</span>
                            <span>{getElementTypeLabel()}</span>
                            <div style={{ marginLeft: "2px", display: "flex", gap: "2px" }}>
                                <button
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "white",
                                        cursor: "pointer",
                                        padding: "1px 3px",
                                        fontSize: "11px",
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
                                        padding: "1px 3px",
                                        fontSize: "11px",
                                    }}
                                    title="Delete element"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    )
}