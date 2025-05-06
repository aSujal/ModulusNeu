import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "../ui/rich-text-editor";
import Quill, { Delta } from "quill";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface EditPostDialogProps {
    post: { id: number; title: string; description: string };
    onUpdated: () => void;
    open: boolean;
    groupId: number;
}

export function EditPostDialog({ post, onUpdated, open,groupId }: EditPostDialogProps) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.description);
    const editorRef = React.useRef<Quill | null>(null);
    
    useEffect(() => {
        setTitle(post.title);
        setContent(post.description);
    }, [post]);
    useEffect(() => {
        if (editorRef.current) {
            const quill = new Quill(document.createElement("div"));
            const convertedDelta = quill.clipboard.convert({html:post.description});
            editorRef.current.setContents(convertedDelta);
        }
    }
    , [editorRef.current]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                id: post.id,
                title: title,
                description: content,
            };
            
            await router.put(`/post/${groupId}/update`, data, {
                onSuccess: () => {
                    toast.success("Post updated successfully!");
                    onUpdated();
                },
                onError: () => {
                    toast.error("Failed to update post.");
                },
            });
        } catch (error) {
            toast.error("An error occurred.");
        }
    };
    

    const handleEditorChange = (value: {
        body: string;
        html: string;
        delta: Delta;
    }) => {
        console.log("Editor value changed:", value);
        setContent(value.html); // Update the content state with the editor's HTML
    };

    return (
        <Dialog open={open} onOpenChange={() => onUpdated()}>
            <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription>Update your post details below.</DialogDescription>
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
                            <RichTextEditor
                                innerRef={editorRef}
                                variant="update"
                                onChange={handleEditorChange} 
                                placeholder="Update your post content here..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onUpdated()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title.trim() || !content.trim()}>
                            Update Post
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}