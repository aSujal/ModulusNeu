import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "../ui/rich-text-editor";
import Quill, { Delta } from "quill";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { CalendarIcon } from "lucide-react";
import { format, max } from "date-fns";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import { FileUploader } from "../ui/FIleUploader";
import { Task } from "@/types";

interface EditTaskDialogProps {
    task: Task;
    open: boolean;
    groupId: number;
    onClose: () => void;
}

export function EditTaskDialog({ task, open, groupId, onClose }: EditTaskDialogProps) {
    const [title, setTitle] = useState(task.title);
    const [content, setContent] = useState(task.text);
    const [maxScore, setMaxScore] = useState(100)
    const [files, setFiles] = useState<File[]>([])
    const [dueDate, setDueDate] = useState<Date | undefined>(task.due_date ? new Date(task.due_date) : undefined);
    const [dueTime, setDueTime] = useState<string>("12:00")

    const editorRef = React.useRef<Quill | null>(null);


    function toMySQLDateTimeLocal(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }

    function combineDateAndTime(date: Date, time: string): Date {
        const [hours, minutes] = time.split(":").map(Number)
        const combined = new Date(date)
        combined.setHours(hours, minutes, 0, 0)
        return combined
    }

    useEffect(() => {
        setTitle(task.title);
        setContent(task.text);
    }, [task]);

    useEffect(() => {
        if (editorRef.current) {
            const quill = new Quill(document.createElement("div"));
            const convertedDelta = quill.clipboard.convert({ html: task.text });
            editorRef.current.setContents(convertedDelta);
        }
    }, [editorRef.current]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                id: task.id,
                title: title,
                text: content,
                file: files[0] ?? null,
                max_score: maxScore,
                due_date: dueDate ? toMySQLDateTimeLocal(combineDateAndTime(dueDate, dueTime)) : null,
                group_id: groupId
            };

            await router.put(`/task/${groupId}/update`, data, {
                onSuccess: (data) => {
                    if (data.props.notification.type === "success") {
                        toast.success(data.props.notification.message ?? "Post updated successfully!");
                        onClose?.();
                    } else {
                        toast.error(data.props.notification.message ?? "Failed to update post.");
                    }
                },
                onError: () => {
                    toast.error("Failed to update post.");
                },
            });
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    const handleEditorChange = (value: {
        body: string;
        html: string;
        delta: Delta;
    }) => {
        console.log("Editor value changed:", value);
        setContent(value.html); // Update the content state with the editor's HTML
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Update your task details below.</DialogDescription>
                    </DialogHeader>
                    <div className="gap-4 grid py-4">
                        {/* Add a scrollable container */}
                        <div className="gap-4 grid py-4 max-h-[70vh] overflow-y-auto">
                            <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
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
                                                initialFocus

                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="gap-2 grid">
                                    <Label htmlFor="due_time">Time</Label>
                                    <Input
                                        id="due_time"
                                        type="time"
                                        value={dueTime}
                                        onChange={(e) => setDueTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="gap-2 grid">
                                <Label htmlFor="description">Description</Label>
                                <RichTextEditor
                                    innerRef={editorRef}
                                    variant="update"
                                    onChange={handleEditorChange}
                                    placeholder="Update your post content here..."
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
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title.trim() || !content.trim()}>
                            Update Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}