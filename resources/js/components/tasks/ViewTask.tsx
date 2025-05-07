import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, formatDistanceToNow } from "date-fns"
import { AlertCircle, Calendar, CheckCircle2, Clock, DeleteIcon, Download, FileText, MoreHorizontal, Paperclip, Send, Trash2Icon, Users } from "lucide-react"

import { Group, Task } from "@/types"
import { Label } from "../ui/label"
import RichTextEditor from "../ui/rich-text-editor"
import { FileUploader } from "../ui/FIleUploader"
import { Delta } from "quill"
import { router, usePage } from "@inertiajs/react"
import { toast } from "sonner"
import TaskResponse from "./TaskResponse"

interface CreateViewDialogProps {
    children: React.ReactNode
    groupId: Group["id"]
    task: Task
    isAdmin?: boolean
}

export function ViewTaskDialog({ children, groupId, task, isAdmin }: CreateViewDialogProps) {
    const [open, setOpen] = useState(false)
    const [response, setResponse] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [activeTab, setActiveTab] = useState("details")

    const handleEditorChange = (value: {
        body: string;
        html: string;
        delta: Delta;
    }) => {
        setResponse(value.html);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        const data = {
            text: response,
            file: files[0] ?? null,
        }
        e.preventDefault()
        try {
            // /task/{taskId}/task-answers/create
            await router.post(`/task/${task.id}/task-answers/create`,
                data, {
                onSuccess: (data) => {
                    if (data.props.notification.type === "success") {
                        setActiveTab("responses")
                        setResponse("")
                        setFiles([])
                        toast.success(data.props.notification.message ?? "Response submitted successfully");
                    } else {
                        toast.error(data.props.notification.message ?? "Didn't work unlucky")
                    }
                }
            });
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    }

    const dueDate = new Date(task.due_date)
    const currentUserId = usePage().props.auth.user.id
    const hasSubmitted = task.responses?.some(
        (response) => response.user?.id === currentUserId
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex flex-col sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-xl">{task.title}</DialogTitle>
                        <DialogDescription>
                            {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                        </DialogDescription>
                        {/* <Badge className={getStatusColor(task.status)}>
                            {task.status === "completed" ? "Completed" : task.status === "in-progress" ? "In Progress" : "Open"}
                        </Badge> */}
                    </div>
                </DialogHeader>

                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <TabsList className={`grid grid-cols-2 w-full`}>
                        <TabsTrigger value="details">Task Details</TabsTrigger>
                        <TabsTrigger value="responses">Responses</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="flex flex-col flex-1 overflow-hidden">
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6">
                                <div className="max-w-none text-muted-foreground text-sm prose prose-sm" dangerouslySetInnerHTML={{ __html: task.text }} />
                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm">Due Date</h3>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>{format(dueDate, "PPP")}</span>
                                        <Badge variant={new Date() > dueDate ? "destructive" : "outline"} className="ml-2">
                                            {new Date() > dueDate ? "Overdue" : formatDistanceToNow(dueDate, { addSuffix: true })}
                                        </Badge>
                                    </div>
                                </div>
                                {task.file && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm">Attachments</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 p-2 border rounded-md">

                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <div className="flex-1 text-sm truncate">{task.file}</div>
                                                <Button asChild size="sm" variant="outline" className="flex items-center gap-2">
                                                    <a href={`${window.location.origin}/tasks/files/${task.file.split('/').pop()?.replace(/\.[^/.]+$/, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                    >
                                                        <Download />
                                                        Download
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {!hasSubmitted || isAdmin ? (
                            <div className="mt-6 pt-4 border-t">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="response">Your Response</Label>
                                        <RichTextEditor onChange={handleEditorChange} placeholder="Write your response here..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Paperclip className="w-4 h-4" />
                                            Attachments
                                        </Label>
                                        <FileUploader files={files} setFiles={setFiles} maxFiles={1} maxSize={5} />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={!response.trim()}>
                                            <Send className="mr-2 w-4 h-4" />
                                            Submit Response
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="mt-6 pt-4 border-t text-muted-foreground text-sm italic">
                                You’ve already submitted a response for this task.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="responses" className="flex flex-col flex-1 overflow-hidden">
                        <ScrollArea className="flex-1 pr-4">
                            <TaskResponse task={task} isAdmin={isAdmin} groupId={groupId} />
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}
