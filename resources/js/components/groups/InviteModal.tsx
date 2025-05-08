import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
// import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code"

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    groupId: number;
}


const InviteModal = ({ open, setOpen, name, groupId }: InviteModalProps) => {
    const [code, setCode] = useState("");
    const { post } = useForm();

    const handleNewCode = async () => {
        // Send request to backend to generate new invitation code
        post(route('create.group.invitation-code', groupId), {
            onSuccess: (data) => {
                if (data.props.notification.data.code && data.props.notification.message) {
                    setCode(data.props.notification.data.code);
                    toast.success(data.props.notification.message);
                }
            }
        });
    };


    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            toast.success("Code copied to clipboard");
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite people to {name}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Use the code below to invite people to join {name}
                    </DialogDescription>
                </DialogHeader>
                {code !== "" && (
                    <div className="flex flex-col justify-center items-center gap-4 py-10">
                        <pre className="font-bold text-muted-foreground text-4xl uppercase tracking-widest">
                            {code}
                        </pre>
                        <QRCode value={window.location.origin+`/groups/invitation/${code}/join`} className="rounded-md" />
                        <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
                            Copy code
                            <CopyIcon className="ml-2 size-4" />
                        </Button>
                    </div>
                )}
                <div className="flex justify-between items-center w-full">
                    <Button
                        variant={"outline"}
                        onClick={handleNewCode}
                    >
                        Generate code
                        <RefreshCcw className="ml-2 size-4" />
                    </Button>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
