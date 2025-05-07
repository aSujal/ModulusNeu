import { useForm } from "@inertiajs/react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface JoinGroupModalProps {
    open: boolean;
    onClose: () => void;
}

export default function JoinGroupModal({ open, onClose }: JoinGroupModalProps) {
    const { post, processing, reset } = useForm();

    const handleComplete = (code: string) => {
        post(`/groups/invitation/${code}/join`, {
            onSuccess: (data) => {
                if(data.props.notification.type === "success") {
                    toast.success(data.props.notification.message ?? "Joined group successfully!");
                    onClose();
                } else {
                    toast.error(data.props.notification.message ?? "Failed to join group.");
                }
            },
            onError: () => {
                toast.error("Invalid or expired code.");
                reset(); // optional
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join a Group</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center gap-6 p-8 focus:border-none h-full">
                    <h1 className="font-bold text-2xl">Join Group</h1>
                    <p className="text-muted-foreground">
                        Enter the code to join the group.
                    </p>
                    <VerificationInput
                        length={6}
                        autoFocus
                        onComplete={handleComplete}
                        classNames={{
                            container: cn(
                                "flex gap-2",
                                processing && "opacity-50 cursor-not-allowed "
                            ),
                            character: "uppercase rounded-md text-lg",
                            characterInactive: "bg-gray-200",
                            characterSelected: "bg-white text-black",
                            characterFilled: "bg-white text-black",
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
