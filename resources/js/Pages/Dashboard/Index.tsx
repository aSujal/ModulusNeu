import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Group } from "@/types";

const Index = ({ groups }: { groups: Group[] }) => {
    console.log(groups);
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="px-3 py-3">
                <h1 className="font-bold text-2xl">Dashboard</h1>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-secondary/60 hover:bg-secondary/30 shadow-md p-4 rounded-lg transition-colors cursor-pointer" onClick={() => router.visit(`/groups/${group.id}`)}>
                            <h2 className="font-semibold text-xl">{group.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};
export default Index
