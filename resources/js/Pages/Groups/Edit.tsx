import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export interface GroupMember {
  id: number;
  role: string;
  user: string;
}

export interface Group {
  id: number;
  name: string;
  groupMembers: GroupMember[];
}

export default function Edit({ group, groupMembers }: { group: Group; groupMembers: GroupMember[] }) {
  const [groupName, setGroupName] = useState(group.name);
  const [members, setMembers] = useState(groupMembers);

  // Handle Group Name Change
  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  // Handle Member Role Change and Auto-submit the role change
  const handleRoleChange = async (memberId: number, newRole: string) => {
    setMembers(members.map((member) =>
      member.id === memberId ? { ...member, role: newRole } : member
    ));

    // Send the POST request for the role change
    try {
      await router.post(`/groups/update-user-role`, {
        group_id : group.id,
        user_id : memberId,
        new_role : newRole,
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Handle Group Name Save (Submit)
  const handleGroupNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send the POST request for the group name change
    try {
      await router.put(`/groups/${group.id}`, { name: groupName });
    } catch (error) {
      console.error("Error updating group name:", error);
    }
  };

  const handleDeleteMember = async (memberId: number) => {

    setMembers(members.filter(member => member.id !== memberId));

    try {
      await router.delete(`/groups/${group.id}/members/${memberId}`,{});
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

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Group: ${groupName}`} />

      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white"><span className='text-red-700'>BRAUCHT NH DESIGN</span><br/>Edit Group: {groupName}</h2>
        </div>

        {/* Edit Group Name */}
        <div className="max-w-7xl mx-auto mb-8">
          <label htmlFor="groupName" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Group Name</label>
          <input
            id="groupName"
            value={groupName}
            onChange={handleGroupNameChange}
            className="mt-2 p-4 w-full text-lg border border-gray-300 rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group name"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGroupNameSubmit}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
            >
              Save Group Name
            </button>
            <button
              onClick={handleDeleteGroup}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200"
            >
              Delete Group
            </button>
          </div>
        </div>

        {/* Edit Group Members */}
        <div className="max-w-7xl mx-auto mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Group Members</h3>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">{member.user}</p>
                  <p className="text-md text-gray-500 dark:text-gray-300">Current Role: {member.role}</p>
                </div>
                <div>
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="user">User</option>
                  </select>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>


                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
