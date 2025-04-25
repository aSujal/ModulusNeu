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
import { useState } from "react";
// import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code"

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
}

function generateAlphanumericCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

const InviteModal = ({ open, setOpen, name }: InviteModalProps) => {
    const [code, setCode] = useState(generateAlphanumericCode());

    const handleNewCode = async () => {
        setCode(generateAlphanumericCode());
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
                <div className="flex flex-col gap-4 items-center justify-center py-10">
      
                    <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
                        Copy link
                        <CopyIcon className="size-4 ml-2" />
                    </Button>
                </div>
                <div className="flex items-center justify-between w-full">
                    <Button
                        variant={"outline"}
                        onClick={handleNewCode}
                    >
                        New code
                        <RefreshCcw className="size-4 ml-2" />
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
