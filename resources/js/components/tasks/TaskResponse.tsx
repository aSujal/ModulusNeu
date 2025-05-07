import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Download, FileText, Trash2, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Input } from "../ui/input";
import { useConfirm } from "@/hooks/use-confirm";


interface TaskResponseProps {
    task: Task;
    groupId?: number;
    isAdmin: boolean | undefined;
}

export default function TaskResponse({
    task,
    groupId,
    isAdmin = false
}: TaskResponseProps) {
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This will permanently delete the response.");

    const [scores, setScores] = useState<{ [responseId: number]: number }>(() => {
        const initialScores: { [id: number]: number } = {};
        task.responses?.forEach((res) => {
            initialScores[res.id] = res.score ?? 0;
        });
        return initialScores;
    });

    const handleScoreUpdate = (responseId: number, score: number) => {
        const data = {
            taskAnswerId: responseId,
            score: score,
        };
        router.put(`/task-answers/update/${groupId}`, data, {
            onSuccess: (data) => {
                if (data.props.notification.type === "success") {
                    toast.success(data.props.notification.message);
                } else {
                    toast.error(data.props.notification.message ?? "Didn't work unlucky")
                }
            }
        });
    };

    const handleTaskDelete = async (responseId: number) => {
        const ok = await confirm();
        if (!ok) return;
        try {
            await router.delete(`/task-answers/delete/${responseId}`,
                {
                    onSuccess: (data) => {
                        if (data.props.notification.type === "success") {
                            toast.success(data.props.notification.message);
                        } else {
                            toast.error(data.props.notification.message ?? "Didn't work unlucky")
                        }
                    }
                }
            );
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    }

    return (
        <div className="space-y-6 mx-auto w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <div></div>
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                    <span className="font-semibold">Max Score:</span> {task.max_score}
                </Badge>
            </div>
            <ConfirmDialog />
            <ScrollArea className="pr-4 h-96">
                {task.responses && task.responses.length > 0 ? (
                    <div className="space-y-6">
                        {task.responses.map((response, index) => (
                            <div key={index} className="bg-card shadow-sm p-4 border rounded-lg">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback>{response?.user?.full_name?.charAt(0) ?? "?"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-sm">{response.user?.full_name ?? "no user found"}</div>
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                {formatDistanceToNow(new Date(response?.created_at), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Score display */}
                                        {response.score !== null ? (
                                            <div className="flex items-center">
                                                <Badge
                                                    className="mr-2"
                                                >
                                                    {response.score}/{task.max_score}
                                                </Badge>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="mr-2">Not Graded</Badge>
                                        )}

                                        {/* Admin scoring dialog */}
                                        {isAdmin && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        {response.score !== null ? "Edit Score" : "Grade"}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Grade Submission - {response.user?.full_name}
                                                        </DialogTitle>
                                                    </DialogHeader>

                                                    <div className="py-4">
                                                        <div className="mb-6">
                                                            <label className="block mb-2 font-medium text-sm">
                                                                Score (0-{task.max_score})
                                                            </label>
                                                            <div className="flex items-center gap-4">
                                                                <Slider
                                                                    defaultValue={[scores[response.id] || 0]}
                                                                    value={[scores[response.id] || 0]}
                                                                    max={task.max_score}
                                                                    step={1}
                                                                    className="flex-1"
                                                                    onValueChange={(value) => {
                                                                        setScores(prev => ({
                                                                            ...prev,
                                                                            [response.id]: value[0]
                                                                        }));
                                                                    }}
                                                                />
                                                                <Input
                                                                    value={scores[response.id] || 0}
                                                                    onChange={(e) => {
                                                                        const value = Math.max(0, Math.min(task.max_score, Number(e.target.value)));
                                                                        setScores((prev) => ({
                                                                            ...prev,
                                                                            [response.id]: value,
                                                                        }));
                                                                    }}
                                                                    className="p-1 border rounded-md w-16 font-mono text-center"
                                                                    min={0}
                                                                    max={task.max_score}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="p-4 border rounded-md max-h-64 overflow-y-auto">
                                                            <h4 className="mb-2 font-medium">Submission Preview</h4>
                                                            <div
                                                                className="max-w-none prose prose-sm"
                                                                dangerouslySetInnerHTML={{ __html: response.text }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild onClick={() => handleScoreUpdate(response.id, scores[response.id])}>
                                                            <Button>Save Grade</Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                        {/* Delete button */}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="w-8 h-8 text-red-500"
                                            onClick={() => handleTaskDelete(response.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    className="max-w-none prose prose-sm"
                                    dangerouslySetInnerHTML={{ __html: response.text }}
                                />

                                {response.file && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="flex items-center gap-2 mb-2 font-medium text-sm">
                                            <Paperclip className="w-4 h-4" />
                                            Attachments
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 p-2 border rounded-md">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <div className="flex-1 text-sm truncate">{response.file}</div>
                                                <Button asChild size="sm" variant="outline">
                                                    <a href={`${window.location.origin}/tasks/files/${response.file.split('/').pop()?.replace(/\.[^/.]+$/, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                    >

                                                        <Download className="mr-2 w-4 h-4" />
                                                        Download
                                                    </a>
                                                </Button>
                                            </div>
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
                            Responses will appear here once submitted.
                        </p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}