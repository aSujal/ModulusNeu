import React from 'react'
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
// import ChannelHero from './channel-hero';
import { Loader } from 'lucide-react';
// import ConversationHero from './converstation-hero';
import { Group, Post } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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


const TasksList = ({
    group
}: PostListProps) => {
    const sortedPosts = [...(group?.posts || [])].sort((a, b) => {
        return new Date(b.publish_at).getTime() - new Date(a.publish_at).getTime();
    });

    return (
        <>
            {sortedPosts.map((post) => (
                <Card key={post.id} className="shadow-sm hover:shadow-md transition">
                    <CardHeader className='px-3 py-2'>
                        <CardTitle className="flex justify-between items-center w-full">
                            {post.title}
                            <span className="text-[#a1a1a1] text-xs">
                                {format(new Date(post.publish_at), "PPPp")}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 py-1 text-muted-foreground">
                        <p>{post.description}</p>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

export default TasksList