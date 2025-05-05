import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "../ui/rich-text-editor"
import { Delta } from "quill"
import { router } from "@inertiajs/react"
import { toast } from "sonner"

interface CreatePostDialogProps {
    children: React.ReactNode
    groupId: number
}

export function CreatePostDialog({ children, groupId }: CreatePostDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const data = {
                title: title,
                description: content,
            }
            await router.post(`/groups/${groupId}/post/create`, data, {
                onSuccess: () => {
                    toast.success("Post created!")
                    setOpen(false)
                    setTitle("")
                    setContent("")
                },
                onError: (error) => {
                    toast.error("Didn't work unlucky")
                }
            });
        } catch (error) {
            toast.error("ha")
        }
    }

    const handleEditorChange = (value: {
        body: string;
        html: string;
        delta: Delta;
    }) => {
        console.log('Editor content updated:', value);
        setContent(value.html)
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handlePost}>
                    <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                        <DialogDescription>Share information with your group members.</DialogDescription>
                    </DialogHeader>
                    <div className="gap-4 grid py-4">
                        <div className="gap-2 grid">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        <div className="gap-2 grid">
                            <Label htmlFor="content">Content</Label>
                            <RichTextEditor onChange={handleEditorChange} placeholder="Write your post content here..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title.trim() || !content.trim()}>
                            Create post
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
