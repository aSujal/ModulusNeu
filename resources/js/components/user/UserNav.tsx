import { router, usePage } from "@inertiajs/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"

export function UserNav() {
    const user = usePage().props.auth.user;
    console.log(user)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="justify-start w-full hover-parent"
                >
                    <Avatar className="[.hover-parent:hover_&]:bg-background/20 w-8 h-8 transition-colors">
                        <AvatarFallback className="[.hover-parent:hover_&]:bg-background/20 transition-colors">
                            {user.full_name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="lg:inline-flex ml-2">
                        {user.full_name}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="font-medium text-sm leading-none">{user.full_name}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.visit(route("profile.edit"))}>
                        <Settings className="mr-2 w-4 h-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.post(route("logout"))}>
                    <LogOut className="mr-2 w-4 h-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
