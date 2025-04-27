import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Button } from "./ui/button"

import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { User } from "@/types"

const userItemVariants = cva(
    'flex justify-start items-center gap-1.5 px-4 h-7 overflow-hidden font-normal text-sm',
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc] hover:bg-muted/20",
                active: "text-[#481349] bg-white/90 hover:bg-white/90",
            },
        },
        defaultVariants: {
            variant: "default",
        }
    }
)
interface UserItemProps {
    label?: string
    id: number
    variant?: VariantProps<typeof userItemVariants>['variant']
}

export const UserItem = ({ label = "Member", id, variant }: UserItemProps) => {
    const avatarFallback = label[0].toUpperCase()

    return (
        <Button variant={"ghost"} size={"sm"} className={cn(userItemVariants({ variant }),)} asChild>
            <a href={`#`} className='flex items-center gap-2'>
                <Avatar className="mr-1 rounded-md size-5">
                    {/* <AvatarImage className="rounded-md" src={user.} alt={label} /> */}
                    <AvatarFallback className="bg-gray-500 rounded-md text-white text-xs">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{label}</span>
            </a>
        </Button>
    )
}