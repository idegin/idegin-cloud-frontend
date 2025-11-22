"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { 
    Plus, 
    Grip, 
    Pencil, 
    Trash2,
    Lock,
    Type,
    Braces,
    Hash,
    ToggleLeft,
    Calendar,
    Link,
    FileText,
    ChevronDown,
    Paperclip,
    Clock,
    Loader2,
    MoreVertical,
    Globe,
    Save,
    ArrowLeft,
    AlignLeft
} from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { FieldEditorDialog } from "./FieldEditorDialog"
import { getFieldTypeConfig } from "./field-types-config"
import { AlertCircle, type LucideIcon } from "lucide-react"

export interface SchemaField {
    id: string
    label: string
    key: string
    type: string
    icon?: string
    color?: string
    required?: boolean
    readonly?: boolean
    helpText?: string
    placeholder?: string
    hidden?: boolean
    validation?: {
        minLength?: number
        maxLength?: number
        minValue?: number
        maxValue?: number
        pattern?: string
        step?: number
    }
    dropdownOptions?: string[]
    defaultValue?: string
    fileConfig?: {
        allowedTypes?: string[]
        maxFileSize?: number
        allowMultiple?: boolean
    }
    dateConfig?: {
        minDate?: string
        maxDate?: string
        defaultToCurrent?: boolean
    }
    booleanConfig?: {
        trueLabel?: string
        falseLabel?: string
    }
    relationshipConfig?: {
        relatedCollectionId?: string
        isMultiple?: boolean
    }
    nestedSchemaConfig?: {
        fields: Array<{
            label: string
            key: string
            type: string
            required?: boolean
            placeholder?: string
        }>
        isMultiple?: boolean
    }
}

type FieldChangeStatus = "unchanged" | "added" | "updated" | "deleted"

interface TrackedField extends SchemaField {
    changeStatus: FieldChangeStatus
}

interface SchemaManagerProps {
    initialFields?: SchemaField[]
    className?: string
    onSave?: (fields: SchemaField[]) => void
    collectionName?: string
    onBack?: () => void
}

const getFieldIcon = (type: string): LucideIcon => {
    const config = getFieldTypeConfig(type)
    return config?.icon || AlertCircle
}

const getFieldColor = (type: string) => {
    const config = getFieldTypeConfig(type)
    return config?.displayColor || "text-gray-600 bg-gray-50"
}

function SortableFieldRow({ 
    field, 
    index,
    onEdit, 
    onDelete, 
    onRestore 
}: { 
    field: TrackedField
    index: number
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onRestore: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const getStatusColor = (status: FieldChangeStatus) => {
        switch (status) {
            case "added": return "bg-green-500"
            case "updated": return "bg-blue-500"
            case "deleted": return "bg-red-500"
            default: return "bg-gray-300"
        }
    }

    const getStatusLabel = (status: FieldChangeStatus) => {
        switch (status) {
            case "added": return "New field - will be created"
            case "updated": return "Modified field - changes will be saved"
            case "deleted": return "Marked for deletion - will be removed"
            default: return "No changes"
        }
    }

    const IconComponent = getFieldIcon(field.type)
    const isDeleted = field.changeStatus === "deleted"

    return (
        <TableRow 
            ref={setNodeRef}
            style={style}
            className={cn(
                "group",
                isDeleted && "bg-red-50/50 hover:bg-red-50"
            )}
        >
            <TableCell className="py-3">
                <button
                    className={cn(
                        "cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-opacity",
                        isDeleted ? "opacity-30" : "opacity-0 group-hover:opacity-100"
                    )}
                    disabled={isDeleted}
                    {...attributes}
                    {...listeners}
                >
                    <Grip className="h-4 w-4" />
                </button>
            </TableCell>

            <TableCell className="py-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className={cn(
                                    "flex items-center justify-center w-full",
                                    isDeleted && "cursor-pointer hover:opacity-80"
                                )}
                                onClick={() => isDeleted && onRestore(field.id)}
                                disabled={!isDeleted}
                            >
                                <div className={cn(
                                    "h-3 w-3 rounded-full",
                                    getStatusColor(field.changeStatus)
                                )} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{getStatusLabel(field.changeStatus)}</p>
                            {isDeleted && <p className="text-xs mt-1 opacity-75">Click to restore</p>}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>

            <TableCell className="py-3">
                <div className={cn(
                    "h-8 w-8 rounded-md flex items-center justify-center",
                    getFieldColor(field.type),
                    isDeleted && "opacity-50"
                )}>
                    <IconComponent className="h-4 w-4" />
                </div>
            </TableCell>

            <TableCell className={cn("py-3 font-medium", isDeleted && "line-through opacity-50")}>
                {field.label}
            </TableCell>

            <TableCell className="py-3">
                <code className={cn(
                    "text-xs text-muted-foreground bg-muted px-2 py-1 rounded",
                    isDeleted && "line-through opacity-50"
                )}>
                    {field.key}
                </code>
            </TableCell>

            <TableCell className="py-3">
                <span className={cn(
                    "text-sm text-muted-foreground capitalize",
                    isDeleted && "opacity-50"
                )}>
                    {field.type.replace(/_/g, " ")}
                </span>
            </TableCell>

            <TableCell className="py-3 text-center">
                {field.required ? (
                    <div className={cn(
                        "inline-flex items-center justify-center w-5 h-5 rounded bg-blue-100 text-blue-600",
                        isDeleted && "opacity-50"
                    )}>
                        <span className="text-xs font-semibold">✓</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/30">—</span>
                )}
            </TableCell>

            <TableCell className="py-3 text-center">
                {field.readonly ? (
                    <Lock className={cn(
                        "h-4 w-4 text-muted-foreground mx-auto",
                        isDeleted && "opacity-50"
                    )} />
                ) : (
                    <span className="text-muted-foreground/30">—</span>
                )}
            </TableCell>

            <TableCell className="py-3">
                {!field.readonly ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isDeleted ? (
                                <DropdownMenuItem onClick={() => onRestore(field.id)}>
                                    <span className="mr-2">↶</span>
                                    Restore Field
                                </DropdownMenuItem>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => onEdit(field.id)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(field.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Mark for Deletion
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <span className="text-muted-foreground/30 text-center block">—</span>
                )}
            </TableCell>
        </TableRow>
    )
}

export function SchemaManager({
    initialFields = [],
    className,
    onSave,
    collectionName,
    onBack,
}: SchemaManagerProps) {
    const [originalFields, setOriginalFields] = useState<SchemaField[]>(initialFields)
    const [fields, setFields] = useState<TrackedField[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingField, setEditingField] = useState<TrackedField | undefined>(undefined)
    const [isSaving, setIsSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        const trackedFields: TrackedField[] = initialFields.map(field => ({
            ...field,
            changeStatus: "unchanged" as FieldChangeStatus
        }))
        setFields(trackedFields)
        setOriginalFields(initialFields)
    }, [initialFields])

    const hasChanges = useMemo(() => {
        return fields.some(field => field.changeStatus !== "unchanged")
    }, [fields])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)
                
                return newItems.map((item, index) => {
                    const originalIndex = originalFields.findIndex(f => f.id === item.id)
                    if (originalIndex !== -1 && originalIndex !== index && item.changeStatus === "unchanged") {
                        return { ...item, changeStatus: "updated" as FieldChangeStatus }
                    }
                    return item
                })
            })
        }
    }

    const handleAddField = () => {
        setEditingField(undefined)
        setIsDialogOpen(true)
    }

    const handleEditField = (fieldId: string) => {
        const field = fields.find(f => f.id === fieldId)
        if (field && field.changeStatus !== "deleted") {
            setEditingField(field)
            setIsDialogOpen(true)
        }
    }

    const handleDeleteField = (fieldId: string) => {
        setFields(fields.map(f => {
            if (f.id === fieldId) {
                if (f.changeStatus === "added") {
                    return null
                }
                return { ...f, changeStatus: "deleted" as FieldChangeStatus }
            }
            return f
        }).filter(Boolean) as TrackedField[])
    }

    const handleRestoreField = (fieldId: string) => {
        setFields(fields.map(f => {
            if (f.id === fieldId && f.changeStatus === "deleted") {
                const originalField = originalFields.find(of => of.id === fieldId)
                if (originalField) {
                    return { ...originalField, changeStatus: "unchanged" as FieldChangeStatus }
                }
            }
            return f
        }))
    }

    const handleSaveField = (fieldData: Omit<SchemaField, "id">) => {
        if (editingField) {
            setFields(fields.map(f => {
                if (f.id === editingField.id) {
                    const originalField = originalFields.find(of => of.id === editingField.id)
                    const isModified = originalField && JSON.stringify({ ...fieldData, id: f.id }) !== JSON.stringify(originalField)
                    
                    return {
                        ...fieldData,
                        id: f.id,
                        changeStatus: (f.changeStatus === "added" ? "added" : (isModified ? "updated" : "unchanged")) as FieldChangeStatus
                    }
                }
                return f
            }))
        } else {
            const newField: TrackedField = {
                ...fieldData,
                id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                changeStatus: "added"
            }
            setFields([...fields, newField])
        }
        setIsDialogOpen(false)
    }

    const handleSave = async () => {
        if (onSave) {
            const fieldsToSave = fields
                .filter(f => f.changeStatus !== "deleted")
                .map(({ changeStatus, ...field }) => field)
            
            setIsSaving(true)
            try {
                await onSave(fieldsToSave)
                
                const updatedFields = fields
                    .filter(f => f.changeStatus !== "deleted")
                    .map(f => ({ ...f, changeStatus: "unchanged" as FieldChangeStatus }))
                
                setFields(updatedFields)
                setOriginalFields(updatedFields.map(({ changeStatus, ...field }) => field))
            } catch (error) {
                console.error('Failed to save schema:', error)
                throw error
            } finally {
                setIsSaving(false)
            }
        }
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between">
                <div>
                    {onBack && (
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="-ml-2 mb-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    )}
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {collectionName || "Collection"} Fields
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage the field schema for this collection
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className="gap-2"
                        variant="default"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleAddField}
                        className="gap-2"
                        variant="outline"
                    >
                        <Plus className="h-4 w-4" />
                        Add Field
                    </Button>
                </div>
            </div>

            <Separator />

            {fields.length === 0 ? (
                <div className="border border-dashed rounded-lg p-12">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No fields yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Get started by adding your first field to this collection.
                                Fields define the structure of your content.
                            </p>
                        </div>
                        <Button
                            onClick={handleAddField}
                            variant="outline"
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add First Field
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-9"></TableHead>
                                    <TableHead className="w-10"></TableHead>
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead>Field Name</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-center w-24">Required</TableHead>
                                    <TableHead className="text-center w-24">Locked</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <SortableContext
                                    items={fields.map(f => f.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {fields.map((field, index) => (
                                        <SortableFieldRow
                                            key={field.id}
                                            field={field}
                                            index={index}
                                            onEdit={handleEditField}
                                            onDelete={handleDeleteField}
                                            onRestore={handleRestoreField}
                                        />
                                    ))}
                                </SortableContext>
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
            )}

            {fields.length > 0 && (
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6">
                        <p className="text-sm text-muted-foreground">
                            {fields.filter(f => f.changeStatus !== "deleted").length} {fields.filter(f => f.changeStatus !== "deleted").length === 1 ? "field" : "fields"} in collection
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                                <span className="text-muted-foreground">Unchanged</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                <span className="text-muted-foreground">New</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                <span className="text-muted-foreground">Modified</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                <span className="text-muted-foreground">Deleted</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleAddField}
                        variant="outline"
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Field
                    </Button>
                </div>
            )}

            <FieldEditorDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSaveField}
                initialData={editingField}
                collectionName={collectionName}
                existingFields={fields.filter(f => f.changeStatus !== "deleted")}
            />
        </div>
    )
}
