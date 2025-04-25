import React from 'react'
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
// import ChannelHero from './channel-hero';
import { Loader } from 'lucide-react';
// import ConversationHero from './converstation-hero';
import { Group, Post } from '@/types';

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
    const [editingId, setEditingId] = React.useState<Post["id"] | null>(null);
    const groupedPosts = group?.posts?.reduce(
        (groups, post) => {
            const date = new Date(post.publish_at)
            const dataKey = format(date, "yyyy-MM-dd");
            if (!groups[dataKey]) {
                groups[dataKey] = []
            }
            groups[dataKey].unshift(post)
            return groups;
        }, {} as Record<string, typeof group.posts>
    );

    // const groupedMessages = data?.reduce(
    //     (groups, message) => {
    //         const date = new Date(message._creationTime);
    //         const dataKey = format(date, "yyyy-MM-dd");
    //         if (!groups[dataKey]) {
    //             groups[dataKey] = []
    //         }
    //         groups[dataKey].unshift(message)
    //         return groups;
    //     }, {} as Record<string, typeof data>
    // );

    return (
        <div className='flex flex-col-reverse flex-1 pb-4 overflow-y-auto messages-scrollbar'>
            {Object.entries(groupedPosts || {}).map(([dateKey, posts]) => (
                <div key={dateKey}>
                    <div className='relative my-2 text-center'>
                        <hr className='top-1/2 right-0 left-0 absolute border-muted/10 border-t' />
                        <span className='inline-block relative shadow-sm px-4 py-1 bg-border border border-muted/10 rounded-full text-xs'>
                            {formatDateLabel(dateKey)}
                        </span>
                    </div>
                    {posts?.map((post, index) => {
                        // const previousMessage = post[index - 1];

                        return (
                            // <Message
                            //     key={message._id}
                            //     id={message._id}
                            //     memberId={message.memberId}
                            //     authorImage={message.user?.image}
                            //     authorName={message.user.name}
                            //     isAuthor={message.member._id === currentMember?._id}
                            //     reactions={message.reactions}
                            //     body={message.body}
                            //     image={message.image}
                            //     updatedAt={message.updatedAt}
                            //     createdAt={message._creationTime}
                            //     isEditing={message._id === editingId}
                            //     setEditingId={setEditingId}
                            //     isCompact={isCompact}
                            //     hideThreadButton={variant === "thread"}
                            //     threadCount={message.threadCount}
                            //     threadImage={message.threadImage}
                            //     threadTimestamp={message.threadTimestamp}
                            //     threadName={message.threadName}
                            // />
                            <div>
                                {post.title}
                            </div>
                        )
                    })}
                </div>
            ))}
            {/* <div
                className='h-1'
                ref={(el) => {
                    if (el) {
                        const observer = new IntersectionObserver(
                            ([entry]) => {
                                if (entry.isIntersecting && canLoadMore) {
                                    loadMore();
                                }
                            },
                            { threshold: 1.0 }
                        )
                        observer.observe(el)
                        return () => observer.disconnect()
                    }
                }}
            />
            {isLoadingMore &&
                <div className='relative my-2 text-center'>
                    <hr className='top-1/2 right-0 left-0 absolute border-muted/10 border-t' />
                    <span className='inline-block relative shadow-sm px-4 py-1 bg-border border border-muted/10 rounded-full text-xs'>
                        <Loader className='size-4 animate-spin' />
                    </span>
                </div>
            } */}
        </div>
    )
}

export default PostsList