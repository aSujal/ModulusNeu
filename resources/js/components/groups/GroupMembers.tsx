import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Crown, MoreHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Group } from "@/types"
import { router, usePage } from "@inertiajs/react"
import { useConfirm } from "@/hooks/use-confirm"
import { toast } from "sonner"

interface GroupMembersProps {
    group: Group
}

export function GroupMembers({ group }: GroupMembersProps) {
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This will remove the user.");
    const user = usePage().props.auth.user;
    const updateRole = async (memberId: number, newRole: "admin" | "user") => {
        try {
            await router.post(`/groups/update-user-role`, {
                group_id: group.id,
                user_id: memberId,
                new_role: newRole,
            },{
                onSuccess: (data) => {
                    if (data.props.notification.type === "success") {
                        toast.success(data.props.notification.message ?? "Role updated successfully!");
                    } else {
                        toast.error(data.props.notification.message ?? "Failed to update role.");
                    }
                },
            });
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };
    const handleDeleteMember = async (memberId: number) => {
        const confirmed = await confirm();
        if (!confirmed) return;
        try {
            await router.delete(`/groups/${group.id}/members/${memberId}`, {
                onSuccess: (data) => {
                    if (data.props.notification.type === "success") {
                        toast.success(data.props.notification.message ?? "Member removed successfully!");
                    } else {
                        toast.error(data.props.notification.message ?? "Failed to remove member.");
                    }
                },
            });
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    };

    if (!group.groupMembers) {
        return null
    }

    const isOwner = group.groupMembers.find(member => member.role === "owner")?.id === user.id;

    return (
        <Card>
            <ConfirmDialog />
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
                                        <AvatarFallback>{member.user_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-sm">{member.user_name}</span>
                                            {member.role === "admin" && <Crown className={"w-3 h-3 text-amber-500"} />}
                                            {member.role === "owner" && <Crown className={"w-3 h-3 text-purple-500"} />}
                                        </div>
                                    </div>
                                </div>
                                {((isOwner && member.id !== user.id) || (member.role !== "admin" && member.role !== "owner")) && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {isOwner && member.role !== "owner" && (
                                                member.role === "admin" ? (
                                                    <DropdownMenuItem onClick={() => updateRole(member.id, "user")}>
                                                        Remove admin
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => updateRole(member.id, "admin")}>
                                                        Make admin
                                                    </DropdownMenuItem>
                                                )
                                            )}
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMember(member.id)}>Remove from group</DropdownMenuItem>
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
