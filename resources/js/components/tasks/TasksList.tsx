import React, { useEffect, useState } from 'react'
import { differenceInMinutes, format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
// import ChannelHero from './channel-hero';
import { Loader, MoreHorizontal } from 'lucide-react';
// import ConversationHero from './converstation-hero';
import { Group, Post, Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PostListProps {
    group: Group;
}

const TasksList = ({
    group
}: PostListProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/groups/${group.id}/tasks`)
            .then(res => res.json())
            .then((res) => {
                setTasks(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [group.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader className="animate-spin" />
            </div>
        );
    }

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

    return (
        <div className='space-y-4'>
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
                                        {/* {task.user.name}  */}• {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
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
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="max-w-none prose prose-sm" dangerouslySetInnerHTML={{ __html: task.text }} />
                        {task.file && task.file.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-2 font-medium text-sm">Attachments</h4>
                                <div className="space-y-2">
                                    {/* {task.file.map((attachment, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                            <div className="flex-1 text-sm truncate">{attachment.name}</div>
                                            <Button size="sm" variant="outline">
                                                <a href={`${window.location.origin}/tasks/files/${attachment.split('/').pop()?.replace(/\.[^/.]+$/, "")}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                >
                                                    Download
                                                </a>
                                            </Button>
                                        </div>
                                    ))} */}
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
                            <span><strong>Score: </strong> 0/{task.max_score}</span>
                            <Button>View</Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

}

export default TasksList