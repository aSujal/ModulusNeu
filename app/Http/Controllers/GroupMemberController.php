<?php

namespace App\Http\Controllers;

use App\Models\GroupMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class GroupMemberController extends Controller
{
    //
    public function index(){
        $user = Auth::user();
        $groups = $user->groups()->get();
        // dd($groups);
        $formattedGroups = $groups->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name
            ];
        });
        return Inertia::render('Dashboard/Index', [
            'groups' => $formattedGroups,
        ]);
    }
    public function removeUserFromGroup(int $groupId, int $userId){

        $currentUser = Auth::user();
        $groupMember = GroupMember::where('group_id', $groupId)
                                ->where('user_id', $userId)
                                ->first();

        if (!$groupMember) {
            return $this->redirectWith('error', 'Group Member not found', 'user.groups');
        }
        $currentGroupMember = GroupMember::where('group_id', $groupId)
                                        ->where('user_id', $currentUser->id)
                                        ->first();

        if ($currentGroupMember && $currentGroupMember->isAdminOrOwner()) {

            $groupMember->delete();

            return $this->redirectWith('success', 'Group Member deleted successfully', 'user.groups');
        }

        return $this->redirectWith('error', 'You are not an Admin or Owner of the group', 'dashboard');
    }

    public function changeUserRole(int $groupId, int $userId, string $newRole)
    {
        $currentUser = Auth::user();
        
        $groupMember = GroupMember::where('group_id', $groupId)
                                ->where('user_id', $userId)
                                ->first();

        if (!$groupMember) {
            return $this->redirectWith('error', 'Group Member not found', 'user.groups');
        }

        $currentGroupMember = GroupMember::where('group_id', $groupId)
                                        ->where('user_id', $currentUser->id)
                                        ->first();

        if ($currentGroupMember && $currentGroupMember->isAdminOrOwner()) {

            $validRoles = ['admin', 'user', 'owner'];
            if (!in_array($newRole, $validRoles)) {
                return $this->redirectWith('error', 'Invalid role', 'user.groups');
            }

            $groupMember->role = $newRole;
            $groupMember->save();

            return $this->redirectWith('success', 'Group Member role updated successfully', 'user.groups');
        }

        return $this->redirectWith('error', 'You are not an Admin or Owner of the group', 'dashboard');
    }

}
