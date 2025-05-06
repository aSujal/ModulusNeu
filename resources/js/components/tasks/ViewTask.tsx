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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, formatDistanceToNow } from "date-fns"
import { AlertCircle, Calendar, CheckCircle2, Clock, Download, FileText, Paperclip, Send, Users } from "lucide-react"

import { Group, Task } from "@/types"
import { Label } from "../ui/label"
import RichTextEditor from "../ui/rich-text-editor"
import { FileUploader } from "../ui/FIleUploader"
import { Delta } from "quill"

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()


        setResponse("")
        setFiles([])
        setActiveTab("responses")
    }

    const dueDate = new Date(task.due_date)
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
                    <TabsList className={`grid ${isAdmin ? "grid-cols-2" : "grid-cols-1"} w-full`}>
                        <TabsTrigger value="details">Task Details</TabsTrigger>
                        {isAdmin && (
                            <TabsTrigger value="responses">
                                Responses
                            </TabsTrigger>
                        )}
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
                    </TabsContent>

                    <TabsContent value="responses" className="flex flex-col flex-1 overflow-hidden">
                        <ScrollArea className="flex-1 pr-4">
                            {task.responses && task.responses.length > 0 ? (
                                <div className="space-y-6">
                                    {task.responses.map((response: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback>{response.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium text-sm">{response.user.name}</div>
                                                        {response.user.role === "admin" && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Admin
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        {formatDistanceToNow(response.submittedAt, { addSuffix: true })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="max-w-none prose prose-sm"
                                                dangerouslySetInnerHTML={{ __html: response.content }}
                                            />

                                            {response.attachments && response.attachments.length > 0 && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <h4 className="flex items-center gap-2 mb-2 font-medium text-sm">
                                                        <Paperclip className="w-4 h-4" />
                                                        Attachments ({response.attachments.length})
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {response.attachments.map((attachment: any, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-2 p-2 border rounded-md">
                                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                                <div className="flex-1 text-sm truncate">{attachment.name}</div>
                                                                <Button size="sm" variant="outline">
                                                                    <Download className="mr-2 w-4 h-4" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center items-center py-12 text-center">
                                    <div className="bg-muted p-3 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-lg">No responses yet</h3>
                                    <p className="mt-2 text-muted-foreground text-sm">
                                        Be the first to respond to this task by submitting your answer.
                                    </p>
                                </div>
                            )}
                        </ScrollArea>

                        {isAdmin && task.responses && task.responses.length > 0 && (
                            <div className="mt-6 pt-4 border-t">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-sm">Admin Actions</h3>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            <span>Admin View</span>
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm">
                                            <CheckCircle2 className="mr-2 w-4 h-4" />
                                            Mark as Completed
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Export All Responses
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}
