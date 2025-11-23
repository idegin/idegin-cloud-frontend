"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { EMAIL_FONTS, FONT_SIZES, TEXT_ALIGNMENTS, BORDER_RADIUS, SPACING_OPTIONS } from "./email-constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmailSection, EmailElement, ProjectBrandGuide } from "./email.types"
import { useCallback, useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"

interface CampaignPropertiesPanelProps {
    activeSection: EmailSection | null
    activeElement: EmailElement | null
    brandGuide: ProjectBrandGuide | null
    onUpdateSectionStyles: (sectionId: string, styles: Record<string, string>) => void
    onUpdateElementStyles: (elementId: string, styles: Record<string, string>) => void
    onUpdateElementContent: (elementId: string, content: Partial<EmailElement>) => void
    onClose: () => void
}

export default function CampaignPropertiesPanel({
    activeSection,
    activeElement,
    brandGuide,
    onUpdateSectionStyles,
    onUpdateElementStyles,
    onUpdateElementContent,
    onClose,
}: CampaignPropertiesPanelProps) {
    const [localElementContent, setLocalElementContent] = useState<Record<string, any>>({})
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)
    
    const currentElementStyles = activeElement?.styles || {}
    const currentSectionStyles = activeSection?.styles || {}

    const brandColors = brandGuide ? [
        { label: "Transparent", value: "transparent" },
        { label: "Primary", value: brandGuide.primary },
        { label: "Primary Foreground", value: brandGuide.primaryForeground },
        { label: "Secondary", value: brandGuide.secondary },
        { label: "Secondary Foreground", value: brandGuide.secondaryForeground },
        { label: "Accent", value: brandGuide.accent },
        { label: "Accent Foreground", value: brandGuide.accentForeground },
        { label: "Muted", value: brandGuide.muted },
        { label: "Muted Foreground", value: brandGuide.mutedForeground },
        { label: "Danger", value: brandGuide.danger },
        { label: "Danger Foreground", value: brandGuide.dangerForeground },
        { label: "Warning", value: brandGuide.warning },
        { label: "Warning Foreground", value: brandGuide.warningForeground },
        { label: "Success", value: brandGuide.success },
        { label: "Success Foreground", value: brandGuide.successForeground },
        { label: "Info", value: brandGuide.info },
        { label: "Info Foreground", value: brandGuide.infoForeground },
        { label: "Background", value: brandGuide.background },
        { label: "Foreground", value: brandGuide.foreground },
    ] : [{ label: "Transparent", value: "transparent" }]

    useEffect(() => {
        if (activeElement) {
            setLocalElementContent({
                textContent: activeElement.textContent || "",
                href: activeElement.href || "",
                src: activeElement.src || "",
                altText: activeElement.altText || "",
            })
        }
    }, [activeElement?.id])

    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }
        }
    }, [debounceTimeout])

    const debouncedUpdateContent = useCallback((elementId: string, content: Partial<EmailElement>) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout)
        }

        const timeout = setTimeout(() => {
            onUpdateElementContent(elementId, content)
        }, 300)

        setDebounceTimeout(timeout)
    }, [debounceTimeout, onUpdateElementContent])

    const handleContentChange = (key: string, value: string) => {
        if (!activeElement) return
        
        setLocalElementContent(prev => ({ ...prev, [key]: value }))
        debouncedUpdateContent(activeElement.id, { [key]: value })
    }

    const handleElementStyleChange = (key: string, value: string) => {
        if (activeElement) {
            onUpdateElementStyles(activeElement.id, { [key]: value })
        }
    }

    const handleSectionStyleChange = (key: string, value: string) => {
        if (activeSection) {
            onUpdateSectionStyles(activeSection.id, { [key]: value })
        }
    }

    return (
        <Card className="h-[97vh] w-full flex flex-col overflow-hidden sticky -top-[10rem]">
            <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle>Properties</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 w-full">
                <ScrollArea className="h-full w-full">
                    <div className="space-y-6 px-4 pb-6 w-full max-w-full">
                        {activeElement && (
                            <>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Element Content</h3>
                                    
                                    {(activeElement.type === "text" || activeElement.type === "link") && (
                                        <div className="space-y-2">
                                            <Label>Content</Label>
                                            <Input
                                                className="w-full"
                                                value={localElementContent.textContent || ""}
                                                onChange={(e) => handleContentChange("textContent", e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {activeElement.type === "link" && (
                                        <div className="space-y-2">
                                            <Label>Link URL</Label>
                                            <Input
                                                className="w-full"
                                                value={localElementContent.href || ""}
                                                onChange={(e) => handleContentChange("href", e.target.value)}
                                                placeholder="https://"
                                            />
                                        </div>
                                    )}

                                    {activeElement.type === "image" && (
                                        <>
                                            <div className="space-y-2">
                                                <Label>Image URL</Label>
                                                <Input
                                                    className="w-full"
                                                    value={localElementContent.src || ""}
                                                    onChange={(e) => handleContentChange("src", e.target.value)}
                                                    placeholder="https://"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Alt Text</Label>
                                                <Input
                                                    className="w-full"
                                                    value={localElementContent.altText || ""}
                                                    onChange={(e) => handleContentChange("altText", e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Element Styling</h3>

                                    {(activeElement.type === "text" || activeElement.type === "link") && (
                                        <>
                                            <div className="space-y-2">
                                                <Label>Font Family</Label>
                                                <Select
                                                    value={currentElementStyles["font-family"] || EMAIL_FONTS[0].value}
                                                    onValueChange={(value) => handleElementStyleChange("font-family", value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {EMAIL_FONTS.map(font => (
                                                            <SelectItem key={font.value} value={font.value}>
                                                                {font.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Font Size</Label>
                                                <Select
                                                    value={currentElementStyles["font-size"] || "16px"}
                                                    onValueChange={(value) => handleElementStyleChange("font-size", value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FONT_SIZES.map(size => (
                                                            <SelectItem key={size.value} value={size.value}>
                                                                {size.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Text Color</Label>
                                                <Select
                                                    value={currentElementStyles["color"] || brandGuide?.foreground || "#000000"}
                                                    onValueChange={(value) => handleElementStyleChange("color", value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select color">
                                                            {(() => {
                                                                const selectedColor = brandColors.find(c => c.value === (currentElementStyles["color"] || brandGuide?.foreground || "#000000"))
                                                                return selectedColor ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-4 h-4 rounded border"
                                                                            style={{ backgroundColor: selectedColor.value }}
                                                                        />
                                                                        {selectedColor.label}
                                                                    </div>
                                                                ) : "Select color"
                                                            })()}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {brandColors.map(color => (
                                                            <SelectItem key={color.value} value={color.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="w-4 h-4 rounded border"
                                                                        style={{ backgroundColor: color.value }}
                                                                    />
                                                                    {color.label}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Text Alignment</Label>
                                                <Select
                                                    value={currentElementStyles["text-align"] || "left"}
                                                    onValueChange={(value) => handleElementStyleChange("text-align", value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TEXT_ALIGNMENTS.map(align => (
                                                            <SelectItem key={align.value} value={align.value}>
                                                                {align.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Background Color</Label>
                                        <Select
                                            value={currentElementStyles["background-color"] || "transparent"}
                                            onValueChange={(value) => handleElementStyleChange("background-color", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select color">
                                                    {(() => {
                                                        const selectedColor = brandColors.find(c => c.value === (currentElementStyles["background-color"] || "transparent"))
                                                        return selectedColor ? (
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-4 h-4 rounded border"
                                                                    style={{ backgroundColor: selectedColor.value }}
                                                                />
                                                                {selectedColor.label}
                                                            </div>
                                                        ) : "Select color"
                                                    })()}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brandColors.map(color => (
                                                    <SelectItem key={color.value} value={color.value}>
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded border"
                                                                style={{ backgroundColor: color.value }}
                                                            />
                                                            {color.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Border Radius</Label>
                                        <Select
                                            value={currentElementStyles["border-radius"] || "0"}
                                            onValueChange={(value) => handleElementStyleChange("border-radius", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BORDER_RADIUS.map(radius => (
                                                    <SelectItem key={radius.value} value={radius.value}>
                                                        {radius.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Top</Label>
                                        <Select
                                            value={currentElementStyles["padding-top"] || "0"}
                                            onValueChange={(value) => handleElementStyleChange("padding-top", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Bottom</Label>
                                        <Select
                                            value={currentElementStyles["padding-bottom"] || "0"}
                                            onValueChange={(value) => handleElementStyleChange("padding-bottom", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Left</Label>
                                        <Select
                                            value={currentElementStyles["padding-left"] || "0"}
                                            onValueChange={(value) => handleElementStyleChange("padding-left", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Right</Label>
                                        <Select
                                            value={currentElementStyles["padding-right"] || "0"}
                                            onValueChange={(value) => handleElementStyleChange("padding-right", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Margin Top</Label>
                                        <Select
                                            value={currentElementStyles["margin-top"] || "0"}
                                            onValueChange={(value) => handleElementStyleChange("margin-top", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Margin Bottom</Label>
                                        <Select
                                            value={currentElementStyles["margin-bottom"] || "0"}
                                            onValueChange={(value) => handleElementStyleChange("margin-bottom", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeSection && (
                            <>
                                <Separator />
                                
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Section Styling</h3>

                                    <div className="space-y-2">
                                        <Label>Background Color</Label>
                                        <Select
                                            value={currentSectionStyles["background-color"] || "transparent"}
                                            onValueChange={(value) => handleSectionStyleChange("background-color", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select color">
                                                    {(() => {
                                                        const selectedColor = brandColors.find(c => c.value === (currentSectionStyles["background-color"] || "transparent"))
                                                        return selectedColor ? (
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-4 h-4 rounded border"
                                                                    style={{ backgroundColor: selectedColor.value }}
                                                                />
                                                                {selectedColor.label}
                                                            </div>
                                                        ) : "Select color"
                                                    })()}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brandColors.map(color => (
                                                    <SelectItem key={color.value} value={color.value}>
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded border"
                                                                style={{ backgroundColor: color.value }}
                                                            />
                                                            {color.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Border Radius</Label>
                                        <Select
                                            value={currentSectionStyles["border-radius"] || "0"}
                                            onValueChange={(value) => handleSectionStyleChange("border-radius", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BORDER_RADIUS.map(radius => (
                                                    <SelectItem key={radius.value} value={radius.value}>
                                                        {radius.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Top</Label>
                                        <Select
                                            value={currentSectionStyles["padding-top"] || "0"}
                                            onValueChange={(value) => handleSectionStyleChange("padding-top", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Bottom</Label>
                                        <Select
                                            value={currentSectionStyles["padding-bottom"] || "0"}
                                            onValueChange={(value) => handleSectionStyleChange("padding-bottom", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Left</Label>
                                        <Select
                                            value={currentSectionStyles["padding-left"] || "0"}
                                            onValueChange={(value) => handleSectionStyleChange("padding-left", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Padding Right</Label>
                                        <Select
                                            value={currentSectionStyles["padding-right"] || "0"}
                                            onValueChange={(value) => handleSectionStyleChange("padding-right", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Margin Top</Label>
                                        <Select
                                            value={currentSectionStyles["margin-top"] || "0"}
                                            onValueChange={(value) => handleSectionStyleChange("margin-top", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Margin Bottom</Label>
                                        <Select
                                            value={currentSectionStyles["margin-bottom"] || "0"}
                                            onValueChange={(value) => handleSectionStyleChange("margin-bottom", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPACING_OPTIONS.map(space => (
                                                    <SelectItem key={space.value} value={space.value}>
                                                        {space.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
