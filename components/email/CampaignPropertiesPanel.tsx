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
    const currentStyles = activeElement?.styles || activeSection?.styles || {}

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

    const handleStyleChange = (key: string, value: string) => {
        if (activeElement) {
            onUpdateElementStyles(activeElement.id, { [key]: value })
        } else if (activeSection) {
            onUpdateSectionStyles(activeSection.id, { [key]: value })
        }
    }

    return (
        <Card className="h-[80vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle>
                        {activeElement ? `Element: ${activeElement.type.toUpperCase()}` : "Section Properties"}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 grid grid-cols-1">
                <ScrollArea className="h-full px-6 pb-6  grid grid-cols-1">
                    <div className="space-y-6">
                        {activeElement && (
                            <>
                                {(activeElement.type === "text" || activeElement.type === "link") && (
                                    <div className="space-y-2">
                                        <Label>Content</Label>
                                        <Input
                                            value={activeElement.textContent || ""}
                                            onChange={(e) => onUpdateElementContent(activeElement.id, { textContent: e.target.value })}
                                        />
                                    </div>
                                )}

                                {activeElement.type === "link" && (
                                    <div className="space-y-2">
                                        <Label>Link URL</Label>
                                        <Input
                                            value={activeElement.href || ""}
                                            onChange={(e) => onUpdateElementContent(activeElement.id, { href: e.target.value })}
                                            placeholder="https://"
                                        />
                                    </div>
                                )}

                                {activeElement.type === "image" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Image URL</Label>
                                            <Input
                                                value={activeElement.src || ""}
                                                onChange={(e) => onUpdateElementContent(activeElement.id, { src: e.target.value })}
                                                placeholder="https://"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Alt Text</Label>
                                            <Input
                                                value={activeElement.altText || ""}
                                                onChange={(e) => onUpdateElementContent(activeElement.id, { altText: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {(activeElement?.type === "text" || activeElement?.type === "link" || !activeElement) && (
                            <>
                                <div className="space-y-2">
                                    <Label>Font Family</Label>
                                    <Select
                                        value={currentStyles["font-family"] || EMAIL_FONTS[0].value}
                                        onValueChange={(value) => handleStyleChange("font-family", value)}
                                    >
                                        <SelectTrigger>
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
                                        value={currentStyles["font-size"] || "16px"}
                                        onValueChange={(value) => handleStyleChange("font-size", value)}
                                    >
                                        <SelectTrigger>
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
                                        value={currentStyles["color"] || brandGuide?.foreground || "#000000"}
                                        onValueChange={(value) => handleStyleChange("color", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
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
                                        value={currentStyles["text-align"] || "left"}
                                        onValueChange={(value) => handleStyleChange("text-align", value)}
                                    >
                                        <SelectTrigger>
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
                                value={currentStyles["background-color"] || "transparent"}
                                onValueChange={(value) => handleStyleChange("background-color", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
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
                                value={currentStyles["border-radius"] || "0"}
                                onValueChange={(value) => handleStyleChange("border-radius", value)}
                            >
                                <SelectTrigger>
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
                                value={currentStyles["padding-top"] || "0"}
                                onValueChange={(value) => handleStyleChange("padding-top", value)}
                            >
                                <SelectTrigger>
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
                                value={currentStyles["padding-bottom"] || "0"}
                                onValueChange={(value) => handleStyleChange("padding-bottom", value)}
                            >
                                <SelectTrigger>
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
                                value={currentStyles["padding-left"] || "0"}
                                onValueChange={(value) => handleStyleChange("padding-left", value)}
                            >
                                <SelectTrigger>
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
                                value={currentStyles["padding-right"] || "0"}
                                onValueChange={(value) => handleStyleChange("padding-right", value)}
                            >
                                <SelectTrigger>
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
                                value={currentStyles["margin-top"] || "0"}
                                onValueChange={(value) => handleStyleChange("margin-top", value)}
                            >
                                <SelectTrigger>
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
                                value={currentStyles["margin-bottom"] || "0"}
                                onValueChange={(value) => handleStyleChange("margin-bottom", value)}
                            >
                                <SelectTrigger>
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
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
