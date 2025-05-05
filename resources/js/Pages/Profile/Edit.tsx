import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-foreground">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile Settings" />

            <div className="py-12 bg-background min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Profile Information */}
                    <div className="bg-card p-6 shadow sm:rounded-lg border border-gray-300 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Update Profile Information
                        </h3>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Password Update */}
                    <div className="bg-card p-6 shadow sm:rounded-lg border border-gray-300 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Change Password
                        </h3>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Delete Account */}
                    <div className="bg-card p-6 shadow sm:rounded-lg border border-gray-300 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-red-500 mb-4">
                            Delete Account
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
