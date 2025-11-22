"use client"

import React, { memo, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { BubbleMenu as BubbleMenuComponent } from "./BubbleMenu"
import Placeholder from "@tiptap/extension-placeholder"
import Youtube from "@tiptap/extension-youtube"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { RichTextToolbar } from "./RichTextToolbar"
import { cn } from "@/lib/utils"

const lowlight = createLowlight(common)

interface RichTextEditorProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
    error?: boolean
    className?: string
}

const RichTextEditorComponent = ({
    value,
    onChange,
    placeholder = "Start writing...",
    disabled = false,
    error = false,
    className,
}: RichTextEditorProps) => {
    const handleUpdate = useCallback(
        ({ editor }: any) => {
            const html = editor.getHTML()
            onChange?.(html)
        },
        [onChange]
    )

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto cursor-pointer transition-all hover:shadow-lg",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline underline-offset-4 hover:text-primary/80",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Youtube.configure({
                controls: true,
                nocookie: true,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: value || "",
        editable: !disabled,
        onUpdate: handleUpdate,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] px-4 py-3",
                    disabled && "opacity-50 cursor-not-allowed"
                ),
            },
        },
    })

    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "")
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    return (
        <div
            className={cn(
                "border rounded-lg overflow-hidden bg-background",
                error && "border-destructive",
                disabled && "opacity-50",
                className
            )}
        >
            {!disabled && <BubbleMenuComponent editor={editor} />}
            <RichTextToolbar editor={editor} disabled={disabled} />
            <div className="border-t">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export const RichTextEditor = memo(RichTextEditorComponent)
