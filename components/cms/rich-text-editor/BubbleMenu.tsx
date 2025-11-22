"use client"

import React, { useState, useEffect, useRef } from "react"
import { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Link as LinkIcon,
    Unlink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BubbleMenuProps {
    editor: Editor
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState("")

    const handleAddLink = () => {
        const url = linkUrl.trim()
        if (url) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run()
        }
        setLinkUrl("")
        setLinkDialogOpen(false)
    }

    const BubbleButton = ({
        onClick,
        isActive = false,
        children,
        title,
    }: {
        onClick: () => void
        isActive?: boolean
        children: React.ReactNode
        title: string
    }) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                "h-7 w-7 p-0 hover:bg-accent",
                isActive && "bg-accent text-accent-foreground"
            )}
            title={title}
        >
            {children}
        </Button>
    )

    const menuRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, left: 0, show: false })

    useEffect(() => {
        const updatePosition = () => {
            const { state, view } = editor
            const { selection } = state
            const { from, to, empty } = selection

            if (empty) {
                setPosition(prev => ({ ...prev, show: false }))
                return
            }

            const start = view.coordsAtPos(from)
            const end = view.coordsAtPos(to)
            
            const left = ((start.left + end.left) / 2)
            const top = start.top - 10

            setPosition({ top, left, show: true })
        }

        const handleUpdate = () => {
            requestAnimationFrame(updatePosition)
        }

        editor.on("selectionUpdate", handleUpdate)
        editor.on("transaction", handleUpdate)

        return () => {
            editor.off("selectionUpdate", handleUpdate)
            editor.off("transaction", handleUpdate)
        }
    }, [editor])

    if (!position.show) return null

    return (
        <>
            <div
                ref={menuRef}
                style={{
                    position: "fixed",
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    transform: "translate(-50%, -100%)",
                    zIndex: 50,
                }}
                className="flex items-center gap-0.5 rounded-lg border bg-popover/95 backdrop-blur-sm p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-75"
            >
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-3.5 w-3.5" />
                </BubbleButton>
                
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-3.5 w-3.5" />
                </BubbleButton>
                
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon className="h-3.5 w-3.5" />
                </BubbleButton>
                
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-3.5 w-3.5" />
                </BubbleButton>
                
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="Code"
                >
                    <Code className="h-3.5 w-3.5" />
                </BubbleButton>

                <Separator orientation="vertical" className="mx-1 h-4" />

                {editor.isActive("link") ? (
                    <BubbleButton
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        title="Remove Link"
                    >
                        <Unlink className="h-3.5 w-3.5" />
                    </BubbleButton>
                ) : (
                    <BubbleButton
                        onClick={() => {
                            const previousUrl = editor.getAttributes("link").href
                            setLinkUrl(previousUrl || "")
                            setLinkDialogOpen(true)
                        }}
                        isActive={editor.isActive("link")}
                        title="Add Link"
                    >
                        <LinkIcon className="h-3.5 w-3.5" />
                    </BubbleButton>
                )}
            </div>

            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="bubble-link-url">URL</Label>
                            <Input
                                id="bubble-link-url"
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddLink()
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddLink}>Insert Link</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
