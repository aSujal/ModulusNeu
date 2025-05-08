import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Group } from "@/types";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { GroupCard } from "@/components/groups/group-card";
import { toast } from "sonner";

const Index = ({ groups }: { groups: Group[] }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
    const { url } = usePage();
    const { notification } = usePage().props;

    useEffect(() => {
        if(notification) {
            if(notification.type === 'error') {
                toast.error(notification?.message);
            } else if(notification.type === 'success') {
                toast.success(notification?.message);
            }
        }
    }, []);

    const idFromUrl = (): number => {
        const segments = url.split('/');
        const extractedId = segments.pop();
        if (extractedId && !isNaN(Number(extractedId))) {
            return Number(extractedId);
        }
        return 0;
    };
    useEffect(() => {
        if (idFromUrl()) {
            const group = groups.find((group) => group.id === idFromUrl());
            if (group) {
                setCurrentGroup(group);
            }
        }
    }, [idFromUrl, groups]);
    console.log(groups);
    return (
        <AuthenticatedLayout>
            <Head title="GroupHub" />
            <div className="flex flex-col min-h-screen">
                <header className="border-b">
                    <div className="flex items-center px-4 sm:px-6 h-16">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8">
                                <div className="absolute inset-0 flex justify-center items-center bg-primary rounded-md font-bold text-primary-foreground text-lg">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                </div>
                            </div>
                            <span className="font-bold text-xl">Modulus</span>
                        </div>
                    </div>
                </header>
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-3xl tracking-tight">Your Groups</h2>
                        <CreateGroupModal open={showModal} onClose={() => setShowModal(false)} />
                        <Button onClick={() => setShowModal(true)}>
                            <PlusCircle className="mr-2 w-4 h-4" />
                            Create Group
                        </Button>
                    </div>
                    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};
export default Index
