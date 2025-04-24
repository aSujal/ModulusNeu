<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateGroupRequest;
use App\Http\Resources\GroupResource;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\InvitationCode;
use App\Support\InvitationCodeGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class GroupController extends Controller
{
    public function showUserGroup(int $id): InertiaResponse
    {
        $group = Group::with('group_members')->findOrFail($id);

        return Inertia::render('User/Groups/Edit', [
            'group' => GroupResource::make($group),
        ]);
    }

    public function updateGroup(int $id, CreateOrUpdateGroupRequest $request): RedirectResponse
    {
        $groupMember = GroupMember::findOrFail(Auth::user()->id);

        if ($groupMember->isAdminOrOwner()) {
            Group::findOrFail($id)->update([
                'name' => $request->validated()['name'],
            ]);

            return $this->backWith('success','Group Updated Successfully');
        }

        return $this->backWith('error','You are not Admin or Owner');
    }

    public function deleteGroup(int $id): RedirectResponse
    {
        $groupMember = GroupMember::findOrFail(Auth::user()->id);

        if ($groupMember->isAdmin()) {
            Group::destroy($id);

            return $this->redirectWith('success','Group deleted Successfully', 'user.groups');
        }

        return $this->redirectWith('error','You are not Admin or Owner', 'dashboard');
    }

    public function createGroup(CreateOrUpdateGroupRequest $request): RedirectResponse
    {
        $group = Auth::user()->groups()->create([
            'name' => $request->validated()['name']
        ]);

        $group->groupMembers()->attach(Auth::id(), ['role' => 'owner']);

        return $this->backWith('success','Group created successfully');
    }

    public function createInvitationCode(int $id): RedirectResponse
    {
        $groupMember = GroupMember::findOrFail(Auth::user()->id);

        if (!$groupMember->isAdminOrOwner()) {
            return $this->backWith('error','You are not Admin or Owner');
        }

        $group = Group::with('invitationCode')->findOrFail($id);
        if ($group->invitationCode->isNotEmpty()) {
            return $this->backWith(
                'error',
                'An Invitation Code already exists',
                ['invitationCode' => $group->invitationCode->code]
            );
        }

        $invitationCode = $group->invitationCode()->create([
            'code' => InvitationCodeGenerator::generate(),
            'expires_at' => now()->addMinutes(60),
        ]);

        return $this->backWith(
            'success',
            'Invitation Code created successfully',
            ['code' => $invitationCode->code]
        );
    }

    public function joinGroup(string $code): RedirectResponse
    {
        $invitationCode = InvitationCode::whereCode($code)->with('group')->firstOrFail();

        if ($invitationCode->expires_at < now()) {
            $invitationCode->delete();

            return $this->backWith('success','Invitation Code is expired or invalid');
        }

        if ($invitationCode->group->groupMembers()->whereUserId(Auth::id())->exists()) {
            return $this->backWith('error','Group already joined');
        }

        $invitationCode->group->groupMembers()->attach(Auth::id(), ['role' => 'user']);

        return $this->backWith('error','Group joined successfully');
    }
}
