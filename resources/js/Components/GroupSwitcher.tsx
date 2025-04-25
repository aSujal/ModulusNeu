import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "./ui/dropdown-menu";
import { FolderOpen, Loader, Plus } from "lucide-react";
import { router } from "@inertiajs/react";
import { Group } from "@/types";
import CreateGroupModal from "./groups/CreateGroupModal";
import { Button } from "./ui/button";

interface GroupSwitcherProps {
    groups: Group[];
}
const GroupSwitcher = ({ groups }: GroupSwitcherProps) => {
    console.log(groups)
    const [currentGroup, setCurrentGroup] = useState<Group>(groups[0]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSwitch = (group: Group) => {
        setLoading(true);
        console.log(group   )
        router.visit(`/groups/${group.id}`, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => setCurrentGroup(group),
        });
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-muted hover:bg-muted p-0 size-9 text-foreground">
                        {loading ? (
                            <Loader className="size-5 animate-spin" />
                        ) : (
                            currentGroup?.name[0].toUpperCase() ?? <FolderOpen/>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="w-64"
                >
                    <DropdownMenuItem
                        onClick={() => handleSwitch(currentGroup)}
                        className="flex flex-col items-start cursor-pointer"
                    >
                        {currentGroup?.name ?? "No Group Selected"}
                        <span className="text-muted-foreground text-xs">
                            Active group
                        </span>
                    </DropdownMenuItem>
                    {groups
                        .map((group) => (
                            <DropdownMenuItem
                                key={group?.id}
                                onClick={() => handleSwitch(group)}
                                className="flex justify-start items-center truncate capitalize cursor-pointer"
                            >
                                <div className="relative flex justify-center items-center bg-[#616061] mr-2 rounded-md size-9 overflow-hidden font-semibold text-white text-lg shrink-0">
                                    {group.name[0].toUpperCase()}
                                </div>
                                <p className="truncate">{group?.name}</p>
                            </DropdownMenuItem>
                        ))}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setShowModal(true)}
                    >
                        <div className="relative flex justify-center items-center bg-[#F2F2F2] mr-2 rounded-md size-9 overflow-hidden font-semibold text-slate-800 text-lg">
                            <Plus className="size-5" />
                        </div>
                        Create a new group
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <CreateGroupModal open={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default GroupSwitcher;
