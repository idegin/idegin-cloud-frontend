"use client"

import { EmailSection, EmailElement } from "./email.types"

interface CampaignSectionRendererProps {
    sections: EmailSection[]
    elements: EmailElement[]
}

export default function CampaignSectionRenderer({ sections, elements }: CampaignSectionRendererProps) {
    const renderElement = (element: EmailElement) => {
        const styleString = Object.entries(element.styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ')

        switch (element.type) {
            case "text":
                return (
                    <tr key={element.id}>
                        <td style={{ padding: "5px 0" }}>
                            <p
                                style={element.styles as any}
                                dangerouslySetInnerHTML={{ __html: element.textContent || "" }}
                            />
                        </td>
                    </tr>
                )

            case "link":
                return (
                    <tr key={element.id}>
                        <td style={{ padding: "10px 0" }}>
                            <a
                                href={element.href || "#"}
                                style={element.styles as any}
                            >
                                {element.textContent}
                            </a>
                        </td>
                    </tr>
                )

            case "image":
                return (
                    <tr key={element.id}>
                        <td style={{ padding: "10px 0" }}>
                            <img
                                src={element.src || ""}
                                alt={element.altText || ""}
                                style={element.styles as any}
                            />
                        </td>
                    </tr>
                )

            case "divider":
                return (
                    <tr key={element.id}>
                        <td style={{ padding: "10px 0" }}>
                            <div style={element.styles as any} />
                        </td>
                    </tr>
                )

            case "spacer":
                return (
                    <tr key={element.id}>
                        <td>
                            <div style={element.styles as any} />
                        </td>
                    </tr>
                )

            case "frame":
                return (
                    <tr key={element.id}>
                        <td style={{ padding: "10px 0" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    ...(element.styles as any),
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td
                                            dangerouslySetInnerHTML={{ __html: element.textContent || "" }}
                                        />
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                )

            default:
                return null
        }
    }

    const getSectionElements = (sectionId: string) => {
        return elements
            .filter(elem => elem.sectionId === sectionId)
            .sort((a, b) => a.index - b.index)
    }

    return (
        <table
            style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                borderCollapse: "collapse",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <tbody>
                {sections
                    .sort((a, b) => a.index - b.index)
                    .map(section => {
                        const sectionElements = getSectionElements(section.id)
                        
                        return (
                            <tr key={section.id}>
                                <td style={section.styles as any}>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <tbody>
                                            {sectionElements.map(element => renderElement(element))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )
                    })}
            </tbody>
        </table>
    )
}
