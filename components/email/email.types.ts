

export type ProjectBrandGuide = {
    headingFontFamily: string;
    paragraphFontFamily: string;

    primary: string;
    primaryForeground: string;

    secondary: string;
    secondaryForeground: string;

    accent: string;
    accentForeground: string;

    muted: string;
    mutedForeground: string;

    danger: string;
    dangerForeground: string;

    warning: string;
    warningForeground: string;

    success: string;
    successForeground: string;

    info: string;
    infoForeground: string;

    background: string;
    foreground: string;
}

export type EmailSection = {
    id: string;
    index: number;
    styles: Record<string, string>;
}

export type EmailElement = {
    id: string;
    index: number;
    type: "text" | "image" | "link" | "spacer" | "divider" | "frame";
    textContent: string | null;
    src: string | null;
    href: string | null;
    altText: string | null;
    styles: Record<string, string>;
    sectionId: string;
}
