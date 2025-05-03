import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Group, GroupMember } from '@/types';
import PostsList from '@/components/posts/PostsList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import InviteModal from '@/components/groups/InviteModal';
import { FileText, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserItem } from '@/components/UserItem';
import { GroupMembers } from '@/components/groups/GroupMembers';
import { CreatePostDialog } from '@/components/posts/CreatePost';

export default function Index({ group }: { group: Group; }) {
  const [groupName, setGroupName] = useState(group.name);
  const [inviteOpen, setInviteOpen] = useState(false);
  const groupMembers = group.groupMembers;

  const [members, setMembers] = useState(groupMembers);
  console.log("group", group)
  console.log("groupMembers", groupMembers)
  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleRoleChange = async (memberId: number, newRole: string) => {
    setMembers(members.map((member) =>
      member.id === memberId ? { ...member, role: newRole } : member
    ));

    try {
      await router.post(`/groups/update-user-role`, {
        group_id: group.id,
        user_id: memberId,
        new_role: newRole,
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleGroupNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await router.put(`/groups/${group.id}`, { name: groupName });
    } catch (error) {
      console.error("Error updating group name:", error);
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    setMembers(members.filter(member => member.id !== memberId));
    try {
      await router.delete(`/groups/${group.id}/members/${memberId}`, {});
    } catch (error) {
      console.error("Error deleting member:", error);

      setMembers(prevState => [...prevState]);
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
  const handlePost = async () => {
    try {
      const data = {
        title: "irgendwas",
        status: "public",
        description: "irgendwas",
        publish_at: new Date()
      }
      await router.post(`/groups/${group.id}/post/create`, data)
    } catch (error) {
      toast.error("ha")
    }
  }

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
            <div className='flex items-center gap-2'>
              <CreatePostDialog groupId={group.id}>
                <Button size="sm" variant="outline">
                  <FileText className="mr-2 w-4 h-4" />
                  New Post
                </Button>
              </CreatePostDialog>
            </div>
          </div>
          <TabsContent value="posts" className="mt-4">
            <PostsList group={group} />
          </TabsContent>
          <TabsContent value="tasks" className="mt-4">
            {/* <TasksList groupId={group.id} /> */}
          </TabsContent>
        </Tabs>
        <aside className="hidden md:block top-16 sticky h-[calc(100vh-8rem)]">
          <GroupMembers group={group} />
        </aside >
      </div >
    </AuthenticatedLayout >
  );
}
