import { useForm } from "@inertiajs/react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";
import { Button } from "../../Components/ui/button";
import { cn } from "@/lib/utils";


export default function JoinGroupPage() {
    const { post, processing, reset } = useForm();

    const handleComplete = (code: string) => {
        post(`/groups/invitation/${code}/join`, {
            onSuccess: () => {
                toast.success("Joined group successfully!");
            },
            onError: () => {
                toast.error("Invalid or expired code.");
                reset(); // optional
            },
        });
    };

    return (
        <div className="flex flex-col justify-center items-center gap-6 p-8 h-full">
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
                        processing && "opacity-50 cursor-not-allowed"
                    ),
                    character: "uppercase rounded-md text-lg",
                    characterInactive: "bg-gray-200",
                    characterSelected: "bg-white text-black",
                    characterFilled: "bg-white text-black",
                }}
            />
            <Button variant="outline" asChild>
                <a href="/">Back to home</a>
            </Button>
        </div>
    );
}
