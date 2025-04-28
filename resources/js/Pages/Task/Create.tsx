import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';

export default function Index() {
    const [formValues, setFormValues] = useState({
        title: '',
        file: null,
        text: '',
        score: '',
        group_id: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
            const files = e.target.files; // Check if 'files' exists
            setFormValues((prevValues) => ({
                ...prevValues,
                [name]: files ? files[0] : null
            }));
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                [name]: value
            }));
        }
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await router.post(`/groups/${formValues["group_id"]}/task/create`, {
                title: formValues.title,
                file: formValues.file,
                text: formValues.text,
                score: formValues.score,
                group_id: formValues.group_id
            });
          } catch (error) {
            console.error("Error deleting member:", error);
          }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Task" />
            
            <div className="container mx-auto p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            value={formValues.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="file" className="block text-sm font-medium">File</label>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="text" className="block text-sm font-medium">Text</label>
                        <textarea
                            id="text"
                            name="text"
                            value={formValues.text}
                            onChange={handleChange}
                            placeholder="Enter text"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="score" className="block text-sm font-medium">Score</label>
                        <Input
                            id="score"
                            name="score"
                            type="number"
                            value={formValues.score}
                            onChange={handleChange}
                            placeholder="Enter score"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="group_id" className="block text-sm font-medium">Group ID</label>
                        <Input
                            id="group_id"
                            name="group_id"
                            type="text"
                            value={formValues.group_id}
                            onChange={handleChange}
                            placeholder="Enter group ID"
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
