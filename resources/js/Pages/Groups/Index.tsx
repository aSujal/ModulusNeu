import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Group, GroupMember } from '@/types';
import PostsList from '@/components/posts/PostsList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import InviteModal from '@/components/groups/InviteModal';
import { FileText, Pen, PlusCircle, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupMembers } from '@/components/groups/GroupMembers';
import { CreatePostDialog } from '@/components/posts/CreatePost';
import { CreateTaskDialog } from '@/components/tasks/CreateTask';
import TasksList from '@/components/tasks/TasksList';
import PreferencesModal from '@/components/groups/PreferencesModal';

export default function Index({ group }: { group: Group; }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [taskListKey, setTaskListKey] = useState(0);
  const user = usePage().props.auth.user;
  const notification = usePage().props.notification;
  console.log(group);
  const groupMembers = group?.groupMembers ?? [];

  useEffect(() => {
    if (notification) {
      if (notification.type === 'error') {
        toast.error(notification?.message);
      } else if (notification.type === 'success') {
        toast.success(notification?.message);
      }
    }
  }, []);

  const handleTaskCreated = () => {
    setTaskListKey(prev => prev + 1);
  };

  const handleOpenPreferences = () => {
    setPreferencesOpen(true);
  };

  const isAdmin = groupMembers?.some(e => e.id === user.id && (e.role === "owner" || e.role === "admin"));

  return (
    <AuthenticatedLayout>
      <Head title={`Group: ${group.name}`} />
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
            <PreferencesModal group={group} initialValue={group.name} open={preferencesOpen} setOpen={() => setPreferencesOpen(false)} />
            {isAdmin && (
              <>
                <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)}>
                  <Users className="w-4 h-4" />
                  Invite Members
                </Button>
                <Button variant="outline" size="sm" onClick={handleOpenPreferences}>
                  <Pen className="w-4 h-4" />
                  Preferences
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <div
        className={`relative flex-1 items-start px-4 sm:px-6 py-6 ${isAdmin ? 'md:gap-6 md:grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px]' : ''}`}>
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
        {isAdmin && groupMembers.length > 0 && (
          <aside className="hidden md:block top-16 sticky h-[calc(100vh-8rem)]">
            <GroupMembers group={group} />
          </aside >
        )}
      </div >
    </AuthenticatedLayout >
  );
}
