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
import { router } from '@inertiajs/react';
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"

interface CreateTaskDialogProps {
    children: React.ReactNode
    groupId: Group["id"]
    onCreated?: () => void
}

export function CreateTaskDialog({ children, groupId, onCreated }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [maxScore, setMaxScore] = useState(100)
    const [files, setFiles] = useState<File[]>([])
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

    function toMySQLDateTimeLocal(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await router.post(`/groups/${groupId}/task/create`, {
                title: title,
                file: files[0] ?? null,
                text: text,
                max_score: maxScore,
                due_date: dueDate ? toMySQLDateTimeLocal(dueDate) : null,
                group_id: groupId
            }, {
                onSuccess: () => {
                    toast.success("Task created!")
                    setOpen(false)
                    setTitle("")
                    setText("")
                    setMaxScore(100)
                    setDueDate(undefined)
                    setFiles([])
                    onCreated?.();
                },
                onError: (error) => {
                    toast.error("Didn't work unlucky")
                }
            });
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    }

    const handleEditorChange = (value: {
        body: string;
        html: string;
        delta: Delta;
    }) => {
        console.log('Editor content updated:', value);
        setText(value.html)
    };

    const isDisabled = !title.trim() || !text.trim() || !dueDate || dueDate === null || !maxScore

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>Attach files and describe the tasks.</DialogDescription>
                    </DialogHeader>
                    {/* Add a scrollable container */}
                    <div className="gap-4 grid py-4 max-h-[70vh] overflow-y-auto">
                        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
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
                                <Label htmlFor="due_date">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !dueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 w-4 h-4" />
                                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="gap-2 grid">
                            <Label htmlFor="description">Description</Label>
                            <RichTextEditor
                                onChange={handleEditorChange}
                                placeholder="Describe the task in detail..."
                            />
                        </div>
                        <div className="gap-2 grid">
                            <Label htmlFor="score">Max Score</Label>
                            <Slider onValueChange={(value) => setMaxScore(value[0])} defaultValue={[maxScore]} max={100} step={1} />
                            <span>{maxScore}</span>
                        </div>

                        <div className="gap-2 grid">
                            <Label>Attachments</Label>
                            <FileUploader files={files} setFiles={setFiles} maxFiles={1} maxSize={5} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isDisabled}>
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
