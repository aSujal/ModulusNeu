import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Clock, Users } from "lucide-react"
import { router } from "@inertiajs/react"
import { useState } from "react"
import { Group } from "@/types"
import { formatDistanceToNow } from "date-fns"

interface GroupCardProps {
    group: Group
}

export function GroupCard({ group }: GroupCardProps) {
    const [loading, setLoading] = useState(false);

    const handleSwitch = (group: Group) => {
        setLoading(true);
        console.log(group)
        router.visit(`/groups/${group.id}`, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => "",
        });
    };
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <Avatar className="w-8 h-8">
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </CardHeader>
            <CardFooter className="flex justify-between items-center bg-muted/20 px-6 py-3 border-t">
                <div className="flex items-center text-muted-foreground text-sm">
                    <Users className="mr-1 w-4 h-4" />
                    <span>{group.groupMembers?.length} members</span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="mr-1 w-4 h-4" />
                    <span>
                        {group.posts && group.posts.length > 0
                            ? formatDistanceToNow(new Date(Math.max(...group.posts.map(post => new Date(post.created_at).getTime()))), { addSuffix: true })
                            : "No posts yet"}
                    </span>
                </div>
                <Button size="sm" onClick={() => handleSwitch(group)} disabled={loading}>
                    <span>View</span>
                </Button>
            </CardFooter>
        </Card>
    )
}
