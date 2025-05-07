import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import AppSidebar from './Sidebar';
import Toolbar from './Toolbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { toast } from 'sonner';

export default function Authenticated({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    // const notification = usePage().props.notification;
    // useEffect(() => {
    //     console.clear();
    //     console.log(notification);
    //     toast.success(notification.message);
    // },[notification]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);


    return (
        <SidebarProvider>
            <div className="flex bg-background w-full min-h-screen">
                <AppSidebar />
                <main className='flex-1'>{children}</main>
            </div>
        </SidebarProvider>
    );
}
