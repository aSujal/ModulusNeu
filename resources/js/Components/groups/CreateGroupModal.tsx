import { FormEventHandler } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
// import { Ziggy } from '@/ziggy';
import { useForm } from "@inertiajs/react";
import { Button } from "../ui/button";
interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
}
const CreateGroupModal = ({ open, onClose }: CreateGroupModalProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // submit("POST", "groups/create");
        post(route("create.group"), {
            onSuccess: () => {
                reset(); // reset form data
                onClose(); // close modal
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a group</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={submit}>
                    <Input
                        value={data.name}
                        disabled={processing}
                        required
                        autoFocus
                        onChange={(e) => setData("name", e.target.value)}
                        // onChange={(e) => setName(e.target.value)}
                        minLength={3}
                        placeholder="Group name e.g. 'DTSM', 'AWL'"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupModal;
