import React, { useEffect, useState } from 'react'
import { differenceInMinutes, format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
// import ChannelHero from './channel-hero';
import { Loader, MoreHorizontal } from 'lucide-react';
// import ConversationHero from './converstation-hero';
import { Group, Post, Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ViewTaskDialog } from './ViewTask';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { EditTaskDialog } from './EditTaskDialog';
import { useConfirm } from '@/hooks/use-confirm';
import { Badge } from '../ui/badge';

interface PostListProps {
    group: Group;
}

const TasksList = ({
    group
}: PostListProps) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This will permanently delete the task.");

    const user = usePage().props.auth.user;
    const tasks = group.tasks;

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center p-8 border border-dashed rounded-lg text-center">
                <h3 className="mt-2 font-semibold text-lg">No tasks yet</h3>
                <p className="mt-1 mb-4 text-muted-foreground text-sm">Create your first task to assign to group members.</p>
            </div>
        );
    }

    const sortedTasks = [...tasks]?.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const isAdmin = group.groupMembers?.some(e => e.id === user.id && (e.role === "owner" || e.role === "admin"))
    // const member = group.groupMembers?.find(e => e.id === user.id);
    const handleDeleteTask = async (taskId: number) => {
        const confirmed = await confirm();
        if (!confirmed) return;
        try {
            await router.delete(`/task/${taskId}/delete`,
                {
                    onSuccess: (data) => {
                        if (data.props.notification.type === "success") {
                            toast.success(data.props.notification.message ?? "Task deleted successfully!");
                        } else {
                            toast.error(data.props.notification.message ?? "Failed to delete task.");
                        }
                    }
                }
            );
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsEditDialogOpen(true);
    };

    return (
        <div className='space-y-4'>
            <ConfirmDialog />
            {sortedTasks?.map((task) => (
                <Card key={task.id} className="shadow-lg hover:shadow-xl mb-6 rounded-lg transition">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between">
                            <div className="flex items-start gap-3">
                                {/* <Avatar className="w-8 h-8">
                                    <AvatarImage src={task.user.avatar || "/placeholder.svg"} alt={task.user.name} />
                                    <AvatarFallback>{task.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar> */}
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-base">{task.title}</CardTitle>
                                    <CardDescription>
                                        • {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                                    </CardDescription>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <MoreHorizontal className="w-4 h-4" />
                                        <span className="sr-only">Task options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="max-w-none max-h-12 truncate prose prose-sm">
                            {task.text.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 100)}{task.text.length > 100 && "..."}
                        </div>
                        {task.file && task.file.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-2 font-medium text-sm">Attachments</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-2 border rounded-md">
                                        <div className="flex-1 text-sm truncate">{task.file}</div>
                                        <Button size="sm" variant="outline">
                                            <a href={`${window.location.origin}/tasks/files/${task.file.split('/').pop()?.replace(/\.[^/.]+$/, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                Download
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-4 border-t">
                        <div className='flex justify-between items-center w-full'>
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const userResponse = task.responses.find((response) => response.user.id === user.id);

                                    if (!userResponse) {
                                        return (
                                            <Badge variant="destructive" className="px-2 py-1">
                                                Not submitted
                                            </Badge>
                                        );
                                    } else if (userResponse.score !== undefined && userResponse.score !== null) {
                                        return (
                                            <Badge variant="outline" className="px-2 py-1 font-medium">
                                                Score: {userResponse.score}/{task.max_score}
                                            </Badge>
                                        );
                                    } else {
                                        return (
                                            <Badge variant="secondary" className="px-2 py-1">
                                                Not graded yet
                                            </Badge>
                                        );
                                    }
                                })()}
                            </div>
                            <ViewTaskDialog groupId={group.id} task={task} isAdmin={isAdmin}>
                                <Button>View</Button>
                            </ViewTaskDialog>
                        </div>
                    </CardFooter>
                </Card>

            ))}
            {selectedTask && (
                <EditTaskDialog
                    task={selectedTask}
                    open={isEditDialogOpen}
                    groupId={group.id}
                    onClose={() => setIsEditDialogOpen(false)}
                />
            )}
        </div>
    );

}

export default TasksList