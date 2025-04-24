import { GraduationCap, GraduationCapIcon, Home, LogOut } from "lucide-react";
import { usePage } from "@inertiajs/react";
import GroupSwitcher from "@/Components/GroupSwitcher";
import SidebarButton from "@/Components/layout/SidebarItem";
import { Group } from "@/types";
import { router } from "@inertiajs/react";

export default function Sidebar({ active = false, className = "", ...props }) {
    const user = usePage().props.auth.user;
    const groups = usePage().props.groups as Group[] || [];
    console.log(groups)
    return (
        <aside
            id="logo-sidebar"
            className="flex flex-col items-center gap-4 bg-[#0e0e12] pt-[9px] pb-4 w-[70px] h-full"
            aria-label="Sidebar"
        >
            <div>
                <a
                    href={route("dashboard")}
                    className="flex items-center mb-5 ps-2.5"
                >
                    <GraduationCapIcon className="mr-2 text-primary text-2xl"/>
                </a>
            </div>
            <GroupSwitcher groups={groups} />
            <SidebarButton
                icon={Home}
                label="Home"
                onClick={() => router.visit(route("dashboard"))}
                isActive={route().current("dashboard")}
            />
            <div className="flex flex-col gap-3 mt-auto w-full">
                <SidebarButton
                    className="bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
                    onClick={() => router.visit(route("profile.edit"))}
                    isActive={route().current("profile.edit")}
                >
                    {user?.full_name?.charAt(0)}
                </SidebarButton>

                <SidebarButton
                    icon={LogOut}
                    onClick={() => router.post(route("logout"))}
                    isActive={false}
                />
            </div>
        </aside>
    );
}
