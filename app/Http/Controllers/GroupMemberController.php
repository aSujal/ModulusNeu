<?php

namespace App\Http\Controllers;

use App\Models\GroupMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class GroupMemberController extends Controller
{
    public function removeUserFromGroup($groupId,$memberId){
        $currentUser = Auth::user();
        $groupMember = GroupMember::where('group_id', $groupId)
                                ->where('user_id', $memberId)
                                ->first();

        if (!$groupMember) {
            return $this->backWith('error','Group Member not found');
        }
        $currentGroupMember = GroupMember::where('group_id', $groupId)
                                        ->where('user_id', $currentUser->id)
                                        ->first();

        if ($currentGroupMember && $currentGroupMember->isAdminOrOwner()) {

            $groupMember->delete();
            return $this->backWith('success','Group Member deleted successfully');
        }

        return $this->backWith('error','You are not an Admin or Owner of the group');
    }

    public function updateUserRole(Request $request)
    {
        $groupId = $request->input('group_id');
        $userId = $request->input('user_id');
        $newRole = $request->input('new_role');

        $currentUser = Auth::user();
        
        $groupMember = GroupMember::where('group_id', $groupId)
                                ->where('user_id', $userId)
                                ->first();

        if (!$groupMember) {
            return $this->backWith('error','Group Member not found');
        }

        $currentGroupMember = GroupMember::where('group_id', $groupId)
                                        ->where('user_id', $currentUser->id)
                                        ->first();

        if ($currentGroupMember && $currentGroupMember->isAdminOrOwner()) {

            $validRoles = ['admin', 'user', 'owner'];
            if (!in_array($newRole, $validRoles)) {
                return $this->backWith('error','Invalid role');
            }

            $groupMember->role = $newRole;
            $groupMember->save();

            return $this->backWith('success','Group Member role updated successfully');
        }
        return $this->backWith('error','You are not an Admin or Owner of the group');
    }

}
