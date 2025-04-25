import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Group, GroupMember } from '@/types';
import GroupLayout from '@/Components/groups/Layout';
import PostsList from '@/Components/posts/PostsList';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';


export default function Index({ group }: { group: Group; }) {
  const [groupName, setGroupName] = useState(group.name);
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
      <Head title={`Edit Group: ${groupName}`} />
      <GroupLayout group={group}>
        <div className='flex flex-col gap-4 w-full'>
          <PostsList group={group} />
          <Button onClick={handlePost} />
        </div>
      </GroupLayout>
    </AuthenticatedLayout>
  );
}
