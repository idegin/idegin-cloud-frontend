"use client"

import React, { useState } from "react"
import { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Youtube,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo,
    Redo,
    CheckSquare,
    FileCode,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextToolbarProps {
    editor: Editor
    disabled?: boolean
}

export function RichTextToolbar({ editor, disabled }: RichTextToolbarProps) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [youtubeUrl, setYoutubeUrl] = useState("")

    const ToolbarButton = ({
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
            disabled={disabled}
            className={cn(
                "h-8 w-8 p-0",
                isActive && "bg-muted"
            )}
            title={title}
        >
            {children}
        </Button>
    )

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

    const handleAddImage = () => {
        const url = imageUrl.trim()
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
        setImageUrl("")
        setImageDialogOpen(false)
    }

    const handleAddYoutube = () => {
        const url = youtubeUrl.trim()
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
        setYoutubeUrl("")
        setYoutubeDialogOpen(false)
    }

    return (
        <>
            <div className="flex items-center gap-1 flex-wrap p-2 bg-muted/30">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive("taskList")}
                    title="Task List"
                >
                    <CheckSquare className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    isActive={editor.isActive({ textAlign: "justify" })}
                    title="Justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    title="Code Block"
                >
                    <FileCode className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => setLinkDialogOpen(true)}
                    isActive={editor.isActive("link")}
                    title="Insert Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setImageDialogOpen(true)}
                    title="Insert Image"
                >
                    <ImageIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setYoutubeDialogOpen(true)}
                    title="Insert YouTube Video"
                >
                    <Youtube className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                                id="link-url"
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddLink()
                                    }
                                }}
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

            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input
                                id="image-url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddImage()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddImage}>Insert Image</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert YouTube Video</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="youtube-url">YouTube URL</Label>
                            <Input
                                id="youtube-url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddYoutube()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setYoutubeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddYoutube}>Insert Video</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
