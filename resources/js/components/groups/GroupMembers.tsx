import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Crown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Group } from "@/types"

interface GroupMembersProps {
    group: Group
}

export function GroupMembers({ group }: GroupMembersProps) {

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Members</CardTitle>
                <CardDescription>
                    {group.groupMembers.length} {group.groupMembers.length === 1 ? "person" : "people"} in this group
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="px-4 pb-4">
                        {group.groupMembers.map((member) => (
                            <div key={member.id} className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>{member.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-sm">{member.user}</span>
                                            {member.role === "admin" && <Crown className="w-3 h-3 text-amber-500" />}
                                        </div>
                                    </div>
                                </div>
                                {member.role !== "admin" && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Make admin</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Remove from group</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
