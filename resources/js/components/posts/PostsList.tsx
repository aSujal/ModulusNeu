import React from 'react'
import { formatDistanceToNow, } from "date-fns";
import { MoreHorizontal } from 'lucide-react';
import { Group } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { router } from '@inertiajs/react';

interface PostListProps {
    group: Group;
}

const PostsList = ({
    group
}: PostListProps) => {
    const sortedPosts = [...(group?.posts || [])].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if (sortedPosts.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center p-8 border border-dashed rounded-lg text-center">
                <h3 className="mt-2 font-semibold text-lg">No posts yet</h3>
                <p className="mt-1 mb-4 text-muted-foreground text-sm">Create your first post to share with the group.</p>
            </div>
        )
    }

    const handleDeletePost = async (postId: number) => {
        try {
            await router.delete(`/post/${postId}/delete`);
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    return (
        <div className='space-y-4'>
            {sortedPosts.map((post) => (
                <Card key={post.id}>
                    <CardHeader className='pb-2'>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <div className='flex items-center gap-3'>
                                    {/* <Avatar className="w-8 h-8">
                                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar> */}
                                    <CardTitle className='text-base'>{post.title}</CardTitle>
                                    <CardDescription>
                                        {/* {post.author.name} */} • {formatDistanceToNow(new Date(post?.created_at), { addSuffix: true })}
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
                                    <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="max-w-none prose prose-sm" dangerouslySetInnerHTML={{ __html: post.description }} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default PostsList