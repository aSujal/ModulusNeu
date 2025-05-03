import React from 'react'
import { differenceInMinutes, format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
// import ChannelHero from './channel-hero';
import { Loader } from 'lucide-react';
// import ConversationHero from './converstation-hero';
import { Group, Post } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';

const TIME_THRESHOLD = 5;

interface PostListProps {
    group: Group;
}

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
}


const PostsList = ({
    group
}: PostListProps) => {
    const sortedPosts = [...(group?.posts || [])].sort((a, b) => {
        return new Date(b.publish_at).getTime() - new Date(a.publish_at).getTime();
    });

    if (sortedPosts.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center p-8 border border-dashed rounded-lg text-center">
                <h3 className="mt-2 font-semibold text-lg">No posts yet</h3>
                <p className="mt-1 mb-4 text-muted-foreground text-sm">Create your first post to share with the group.</p>
            </div>
        )
    }

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
                                        {/* {post.author.name} */} • {formatDistanceToNow(post.created_at, { addSuffix: true })}
                                    </CardDescription>
                                </div>
                            </div>
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