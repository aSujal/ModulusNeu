import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface TaskProps {
    task: {
        id: number;
        title: string;
        file: string;
        text: string;
        score: number;
        group_id: number;
        created_at: string;
        updated_at: string;
    };
}

export default function Index({ task }: TaskProps, file1: string) {
    return (
        <AuthenticatedLayout>
            <Head title={`Task - ${task.title}`} />

            <div className="mx-auto p-4 container">
                <h1 className="mb-4 font-bold text-2xl">Task Details</h1>

                <div className="mb-4">
                    <strong>Title:</strong> {task.title}
                </div>

                <div className="mb-4">
                    <strong>File:</strong>{' '}
                    <a
                        href={`/storage/tasks/${file1}`}
                        // href={`/storage/tasks/${task.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {task.file}
                    </a>
                </div>

                <div className="mb-4">
                    <strong>Text:</strong> {task.text}
                </div>

                <div className="mb-4">
                    <strong>Score:</strong> {task.score}
                </div>

                <div className="mb-4">
                    <strong>Group ID:</strong> {task.group_id}
                </div>

                <div className="mb-4">
                    <strong>Created At:</strong> {new Date(task.created_at).toLocaleString()}
                </div>

                <div className="mb-4">
                    <strong>Updated At:</strong> {new Date(task.updated_at).toLocaleString()}
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
