import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
// import { Group } from "@/types";

export interface Group {
    name: string;
    groupMembers:[];
};

export default function Edit({ group }: { group: Group }) {
    return (
        <AuthenticatedLayout>
            <div>
                {group.name}
            </div>
        </AuthenticatedLayout>
    );
}
