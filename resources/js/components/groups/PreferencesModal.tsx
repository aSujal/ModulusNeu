import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "../ui/dialog";
import { TrashIcon, Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { router, usePage } from '@inertiajs/react';
import { useConfirm } from './useConfirm';
import { Group } from '@/types';

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
    group: Group;
}

const PreferencesModal = ({ open, setOpen, initialValue, group }: PreferencesModalProps) => {
    const [groupName, setGroupName] = React.useState(initialValue);
    const [isEditing, setIsEditing] = React.useState(false);
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible");

    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupName(e.target.value);
    };

    const handleGroupNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await router.put(`/groups/${group.id}`, { name: groupName });
            toast.success("Group name updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating group name:", error);
            toast.error("Failed to update group name");
        }
    };

    const handleDeleteGroup = async () => {
        const confirmDelete = await confirm();
        if (!confirmDelete) return;

        try {
            await router.delete(`/groups/${group.id}`);
            toast.success("Group deleted successfully!");
            setOpen(false);
        } catch (error) {
            console.error("Error deleting group:", error);
            toast.error("Failed to delete group");
        }
    };
    const user = usePage().props.auth.user;
    const isOwner = group.groupMembers?.find(e => e.id === user.id && (e.role === "owner"))
    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Group Preferences</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 px-4 py-4">
                        {/* Group Name Section */}
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="hover:bg-black/10 px-5 py-4 border rounded-lg w-full text-left transition cursor-pointer"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm">Group name</p>
                                    <Pencil className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="mt-1 text-sm">{groupName}</p>
                            </button>
                        ) : (
                            <form onSubmit={handleGroupNameSubmit} className="space-y-4 p-4 border rounded-lg">
                                <Input
                                    value={groupName}
                                    onChange={handleGroupNameChange}
                                    required
                                    autoFocus
                                    minLength={3}
                                    maxLength={80}
                                    placeholder="Group name e.g. 'Work', 'Personal', 'Team A'"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="destructive" onClick={() => {
                                        setGroupName(initialValue);
                                        setIsEditing(false);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save</Button>
                                </div>
                            </form>
                        )}

                        {isOwner &&
                            < button
                                onClick={handleDeleteGroup}
                                type="button"
                                className="flex items-center gap-2 hover:bg-black/10 px-5 py-4 border rounded-lg text-rose-600 transition cursor-pointer"
                            >
                                <TrashIcon className="w-5 h-5" />
                                <p>Delete group</p>
                            </button>
                        }
                    </div>
                </DialogContent>
            </Dialog >
        </>
    );
};

export default PreferencesModal;
