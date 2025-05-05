import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Group, GroupMember } from '@/types';
import PostsList from '@/components/posts/PostsList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import InviteModal from '@/components/groups/InviteModal';
import { FileText, PlusCircle, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupMembers } from '@/components/groups/GroupMembers';
import { CreatePostDialog } from '@/components/posts/CreatePost';
import { CreateTaskDialog } from '@/components/tasks/CreateTask';
import TasksList from '@/components/tasks/TasksList';

export default function Index({ group }: { group: Group; }) {
  const [groupName, setGroupName] = useState(group.name);
  const [inviteOpen, setInviteOpen] = useState(false);
  const groupMembers = group?.groupMembers ?? [];
  const [taskListKey, setTaskListKey] = useState(0);
  const user = usePage().props.auth.user;

  const handleTaskCreated = () => {
    setTaskListKey(prev => prev + 1);
  };

  console.log("group", group)
  console.log("groupMembers", groupMembers)
  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleGroupNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await router.put(`/groups/${group.id}`, { name: groupName });
    } catch (error) {
      console.error("Error updating group name:", error);
    }
  };

  const handleDeleteGroup = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this group? This action cannot be undone.");
    if (!confirmDelete) return;
    try {
      await router.delete(`/groups/${group.id}`);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const isAdmin = groupMembers?.find(e => e.id === user.id && (e.role === "owner" || e.role === "admin"))

  return (
    <AuthenticatedLayout>
      <Head title={`Group: ${groupName}`} />
      <header className="border-b">
        <div className="flex items-center px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 flex justify-center items-center bg-primary rounded-md font-bold text-primary-foreground text-lg">
                {group.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="font-bold text-2xl">{group.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <InviteModal name={group.name} open={inviteOpen} setOpen={setInviteOpen} groupId={group.id} />
            <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)}>
              <Users className="mr-2 w-4 h-4" />
              Invite Members
            </Button>
          </div>
        </div>
      </header>
      <div className='relative flex-1 items-start md:gap-6 md:grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px] px-4 sm:px-6 py-6'>
        <Tabs defaultValue="posts" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            {isAdmin && (
              <div className='flex items-center gap-2'>
                <CreatePostDialog groupId={group.id}>
                  <Button size="sm" variant="outline">
                    <FileText className="mr-2 w-4 h-4" />
                    New Post
                  </Button>
                </CreatePostDialog>
                <CreateTaskDialog groupId={group.id} onCreated={handleTaskCreated}>
                  <Button size="sm">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    New Task
                  </Button>
                </CreateTaskDialog>
              </div>
            )}
          </div>
          <TabsContent value="posts" className="mt-4">
            <PostsList group={group} />
          </TabsContent>
          <TabsContent value="tasks" className="mt-4">
            <TasksList key={taskListKey} group={group} />
          </TabsContent>
        </Tabs>
        {groupMembers.length > 0 && (
          <aside className="hidden md:block top-16 sticky h-[calc(100vh-8rem)]">
            <GroupMembers group={group} />
          </aside >
        )}
      </div >
    </AuthenticatedLayout >
  );
}
