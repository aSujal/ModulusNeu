import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
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
            <div className="flex bg-background h-[calc(100vh-44px)]">
                <Sidebar />
                <main>{children}</main>
            </div>
        </div>
    );
}
