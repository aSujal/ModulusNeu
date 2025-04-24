import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Group } from "@/types";

// Mock group data
const mockGroups: Group[] = [
    {
        id: 1,
        name: "Design Team",
        image: "https://source.unsplash.com/400x300/?design,team",
    },
    {
        id: 2,
        name: "Marketing Crew",
        image: "https://source.unsplash.com/400x300/?marketing,office",
    },
    {
        id: 3,
        name: "Developers",
        image: "https://source.unsplash.com/400x300/?coding,developers",
    },
    {
        id: 5,
        name: "Product Managers",
        image: "https://source.unsplash.com/400x300/?productivity,teamwork",
    },
    {
        id: 6,
        name: "Product Managers",
        image: "https://source.unsplash.com/400x300/?productivity,teamwork",
    },
    {
        id: 7,
        name: "Product Managers",
        image: "https://source.unsplash.com/400x300/?productivity,teamwork",
    },
    {
        id: 8,
        name: "Product Managers",
        image: "https://source.unsplash.com/400x300/?productivity,teamwork",
    },
];

const Index = ({ groups }: { groups: Group[] }) => {
    console.log(groups);
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            {/* <GroupSwitcher groups={groups} /> */}
            <div className="py-8">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <h2 className="mb-6 font-semibold text-foreground text-2xl">
                        Your Groups
                    </h2>

                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {groups?.map((group) => (
                            <div
                                key={group.id}
                                className="bg-card shadow-sm hover:shadow-md rounded-2xl overflow-hidden transition"
                            >
                                <div className="flex justify-center items-center bg-muted h-40">
                                    <img
                                        src={
                                            group.image ??
                                            "https://via.placeholder.com/150"
                                        }
                                        alt={group.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-medium text-foreground text-lg">
                                        {group.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};
export default Index