import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

export default function Authenticated({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className='h-full'>
            <Toolbar />
            <div className="flex bg-background h-[calc(100vh-64px)]">
                <Sidebar />
                <main className='w-full'>{children}</main>
            </div>
        </div>
    );
}
