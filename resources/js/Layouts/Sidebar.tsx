import { Box, MoreHorizontal, Plus, Search, Users } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { Group } from "@/types";
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user/UserNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import JoinGroupModal from "@/components/groups/JoinGroupModal";

export default function AppSidebar({ active = false, className = "", ...props }) {
    const groups = usePage().props.groups as Group[] || [];
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
    const { url } = usePage();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            {/* Sidebar Trigger for Mobile */}
            <SidebarTrigger
                className="md:hidden top-1/2 left-1 z-50 fixed"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}

            >
                
            </SidebarTrigger>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 transform bg-white shadow-lg transition-transform duration-300 md:static md:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } ${className}`}
                {...props}
            >
                <Sidebar>
                    <SidebarHeader className="px-3 py-2 border-b">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8">
                                <div className="absolute inset-0 flex justify-center items-center bg-primary rounded-md font-bold text-primary-foreground text-lg">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                </div>
                            </div>
                            <span className="font-bold text-xl">Modulus</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="relative flex-1">
                                <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search groups..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="px-2 py-2">
                        <ScrollArea className="h-[calc(100vh-13rem)]">
                            <SidebarMenuButton isActive={url === "/"} className="hover:bg-primary/10">
                                <a className="flex items-center gap-2 w-full" href="/dashboard">
                                    <Users className="w-4 h-4" />
                                    <span>All Groups</span>
                                </a>
                            </SidebarMenuButton>
                            {filteredGroups.map((group) => (
                                <SidebarMenuButton
                                    key={group.id}
                                    asChild
                                    isActive={url === `/groups/${group.id}`}
                                    className="hover:bg-primary/10"
                                >
                                    <a href={`/groups/${group.id}`} className="flex items-center gap-2 w-full truncate">
                                        <div className="flex justify-center items-center bg-primary/10 rounded-sm w-4 h-4 font-medium text-primary text-xs">
                                            {group.name.charAt(0)}
                                        </div>
                                        <span>{group.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            ))}
                        </ScrollArea>
                    </SidebarContent>
                    <SidebarFooter className="p-2 border-t">
                        <div className="gap-2 grid">
                            <CreateGroupModal open={showModal} onClose={() => setShowModal(false)} />
                            <Button variant="outline" className="justify-start w-full" onClick={() => setShowModal(true)}>
                                <Plus className="mr-2 w-4 h-4" />
                                Create New Group
                            </Button>
                            <JoinGroupModal open={showJoinModal} onClose={() => setShowJoinModal(false)} />
                            <Button
                                variant={"outline"}
                                className="justify-start w-full"
                                onClick={() => setShowJoinModal(true)}
                            >
                                <Box className="mr-2 w-4 h-4" />
                                Join Group
                            </Button>
                            <UserNav />
                        </div>
                    </SidebarFooter>
                </Sidebar>
            </div>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden z-30 fixed inset-0 bg-black bg-opacity-50"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </>
    );
}
