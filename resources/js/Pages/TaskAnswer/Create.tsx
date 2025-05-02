import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateTaskAnswer() {
    const [formValues, setFormValues] = useState({
        name: '',
        file: null,
        text: '',
        task_id: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
            const files = e.target.files; // Check if 'files' exists
            setFormValues((prevValues) => ({
                ...prevValues,
                [name]: files ? files[0] : null,
            }));
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // /task/{taskId}/answers/create
            await router.post(`/task/${formValues["task_id"]}/answers/create`, {
                name: formValues.name,
                file: formValues.file,
                text: formValues.text,
                task_id: formValues.task_id,
            });
            toast.success('Task answer created successfully!');
        } catch (error) {
            console.error('Error creating task answer:', error);
            toast.error('Failed to create task answer.');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Task Answer" />

            <div className="mx-auto p-4 container">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium text-sm">
                            Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formValues.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="file" className="block font-medium text-sm">
                            File
                        </label>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="text" className="block font-medium text-sm">
                            Text
                        </label>
                        <textarea
                            id="text"
                            name="text"
                            value={formValues.text}
                            onChange={handleChange}
                            placeholder="Enter text"
                            className="px-3 py-2 border rounded w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="task_id" className="block font-medium text-sm">
                            Task ID
                        </label>
                        <Input
                            id="task_id"
                            name="task_id"
                            type="text"
                            value={formValues.task_id}
                            onChange={handleChange}
                            placeholder="Enter task ID"
                            required
                        />
                    </div>

                    <Button type="submit" className="mt-4">
                        Submit
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}