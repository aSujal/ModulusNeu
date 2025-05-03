"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "../ui/rich-text-editor"
import { Delta } from "quill"
import { Group } from "@/types"
import { FileUploader } from "../ui/FIleUploader"

interface CreateTaskDialogProps {
    children: React.ReactNode
    groupId: Group["id"]
}

export function CreateTaskDialog({ children, groupId }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [estimatedTime, setEstimatedTime] = useState("")
    const [files, setFiles] = useState<File[]>([])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setOpen(false)
        setTitle("")
        setText("")
        setDueDate(undefined)
        setEstimatedTime("")
        setFiles([])
    }

    const handleEditorChange = (value: {
        body: string;
        html: string;
        delta: Delta;
    }) => {
        console.log('Editor content updated:', value);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>Attach files and describe the tasks.</DialogDescription>
                    </DialogHeader>
                    <div className="gap-4 grid py-4">
                        <div className="gap-2 grid">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task title"
                                required
                            />
                        </div>
                        <div className="gap-2 grid">
                            <Label htmlFor="description">Description</Label>
                            <RichTextEditor
                                onChange={handleEditorChange}
                                placeholder="Describe the task in detail..."
                            />
                        </div>
                        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">

                        </div>
                        <div className="gap-2 grid">
                            <Label>Attachments</Label>
                            <FileUploader files={files} setFiles={setFiles} maxFiles={5} maxSize={5} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title.trim() || !text.trim()}>
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
