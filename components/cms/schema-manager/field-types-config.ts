import {
    Type,
    Hash,
    ToggleLeft,
    Calendar,
    Clock,
    AlignLeft,
    FileText,
    ChevronDown,
    Paperclip,
    Braces,
    Globe,
    Link,
    LucideIcon,
} from "lucide-react"

export interface FieldTypeConfig {
    type: string
    label: string
    description: string
    icon: LucideIcon
    color: string
    displayColor: string
}

export const FIELD_TYPES_CONFIG: FieldTypeConfig[] = [
    {
        type: "short_text",
        label: "Short Text",
        description: "Single line text input",
        icon: Type,
        color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200",
        displayColor: "text-blue-600 bg-blue-50"
    },
    {
        type: "long_text",
        label: "Long Text",
        description: "Multi-line text area",
        icon: AlignLeft,
        color: "text-sky-600 bg-sky-50 hover:bg-sky-100 border-sky-200",
        displayColor: "text-sky-600 bg-sky-50"
    },
    {
        type: "rich_text",
        label: "Rich Text",
        description: "Formatted text with editor",
        icon: FileText,
        color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
        displayColor: "text-indigo-600 bg-indigo-50"
    },
    {
        type: "number",
        label: "Number",
        description: "Numeric input field",
        icon: Hash,
        color: "text-green-600 bg-green-50 hover:bg-green-100 border-green-200",
        displayColor: "text-green-600 bg-green-50"
    },
    {
        type: "boolean",
        label: "Boolean",
        description: "True/false toggle",
        icon: ToggleLeft,
        color: "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200",
        displayColor: "text-purple-600 bg-purple-50"
    },
    {
        type: "date",
        label: "Date",
        description: "Date picker",
        icon: Calendar,
        color: "text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200",
        displayColor: "text-orange-600 bg-orange-50"
    },
    {
        type: "time",
        label: "Time",
        description: "Time picker",
        icon: Clock,
        color: "text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200",
        displayColor: "text-amber-600 bg-amber-50"
    },
    {
        type: "dropdown",
        label: "Dropdown",
        description: "Select from options",
        icon: ChevronDown,
        color: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
        displayColor: "text-yellow-600 bg-yellow-50"
    },
    {
        type: "file",
        label: "File",
        description: "File upload",
        icon: Paperclip,
        color: "text-red-600 bg-red-50 hover:bg-red-100 border-red-200",
        displayColor: "text-red-600 bg-red-50"
    },
    {
        type: "slug",
        label: "Slug",
        description: "URL-friendly identifier",
        icon: Globe,
        color: "text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200",
        displayColor: "text-teal-600 bg-teal-50"
    },
    {
        type: "timestamp",
        label: "Timestamp",
        description: "Date and time picker",
        icon: Clock,
        color: "text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-200",
        displayColor: "text-violet-600 bg-violet-50"
    },
    {
        type: "relationship",
        label: "Relationship",
        description: "Link to another collection",
        icon: Link,
        color: "text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
        displayColor: "text-cyan-600 bg-cyan-50"
    },
    {
        type: "nested_schema",
        label: "Nested Schema",
        description: "Object with sub-fields (single or array)",
        icon: Braces,
        color: "text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-200",
        displayColor: "text-pink-600 bg-pink-50"
    }
]

export const getFieldTypeConfig = (type: string): FieldTypeConfig | undefined => {
    return FIELD_TYPES_CONFIG.find(ft => ft.type === type)
}
