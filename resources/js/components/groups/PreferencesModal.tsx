import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "../ui/dialog"
import { TrashIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { router } from '@inertiajs/react'
import { useConfirm } from './useConfirm'

// import { useRouter } from 'next/router'  // Korrektur hier
// import { useConfirm } from '@/hooks/useConfirm'  // Korrektur hier


interface PreferencesModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    initialValue: string,
    groupId: number // ID der Gruppe
}

const PreferencesModal = ({ open, setOpen, initialValue, groupId }: PreferencesModalProps) => {
    const [groupName, setGroupName] = React.useState(initialValue);
    const [editOpen, setEditOpen] = React.useState(false);
    // const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible");

    // Handle Group Name Change
    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupName(e.target.value);
    };

    // Handle Group Name Save (Submit)
    const handleGroupNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send the PUT request for the group name change
        try {
            await router.put(`/groups/${groupId}`, { name: groupName });
            toast.success("Group name updated successfully!");
        } catch (error) {
            console.error("Error updating group name:", error);
            toast.error("Failed to update group name");
        }
    };

    // Handle Group Deletion
    const handleDeleteGroup = async () => {
        const confirmDelete = confirm();
        if (!confirmDelete) return;

        try {
            await router.delete(`/groups/${groupId}`);
            toast.success("Group deleted successfully!");
            setOpen(false); // Close modal after deletion
        } catch (error) {
            console.error("Error deleting group:", error);
            toast.error("Failed to delete group");
        }
    };

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='p-0 bg-background overflow-hidden'>
                    <DialogHeader className='p-4 border-b'>
                        <DialogTitle>{groupName}</DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-2 bg-black/5">
                        <DialogTrigger asChild>
                            <div className="px-5 py-4 rounded-lg border cursor-pointer hover:bg-black/10 transition">
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm font-semibold'>
                                        Group name
                                    </p>
                                    <p className='text-sm text-[#1264a3] hover:underline font-semibold'>
                                        Edit
                                    </p>
                                </div>
                                <p className='text-sm'>
                                    {groupName}
                                </p>
                            </div>
                        </DialogTrigger>

                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this group</DialogTitle>
                                </DialogHeader>
                                <form className='space-y-4' onSubmit={handleGroupNameSubmit}>
                                    <Input value={groupName} onChange={handleGroupNameChange} required autoFocus minLength={3} maxLength={80} placeholder="Group name e.g. 'Work', 'Personal', 'Team A'" />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant={"destructive"}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type='submit'>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <button onClick={handleDeleteGroup} type='button' className='flex items-center gap-2 px-5 py-4 rounded-lg border cursor-pointer hover:bg-black/10 text-rose-600 transition'>
                            <TrashIcon className='size-5' />
                            <p>Delete group</p>
                        </button>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <DialogClose />
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default PreferencesModal;