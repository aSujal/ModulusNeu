<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateGroupRequest;
use App\Http\Resources\GroupMemberResource;
use App\Http\Resources\GroupResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\TaskResource;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\InvitationCode;
use App\Models\Post;
use App\Models\Task;
use App\Models\TaskAnswer;
use App\Support\InvitationCodeGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class GroupController extends Controller
{
    public function showUserGroup(int $id): InertiaResponse
    {
        $group = Group::with('posts')->findOrFail($id);
        $data = [
            'group' => GroupResource::make($group)->jsonSerialize(),
        ];
        $user = Auth::user();

        $groupMember = $group->groupMembers()->where('user_id', $user->id)->first();
        if ($groupMember && in_array($groupMember->pivot->role, ['admin', 'owner'])) {
            $data["group"]['groupMembers'] = GroupMemberResource::collection(
                $group->groupMembers()->get()
            )->jsonSerialize();
        }

        $data["group"]['posts'] = PostResource::collection($group->posts)->jsonSerialize();
        $tasks = TaskResource::collection($group->tasks)->jsonSerialize();
        if (Auth::user()->isAdminOrOwner($group->id)) {
            $data["group"]['tasks'] = $tasks;
        } else {
            $data["group"]['tasks'] = collect($tasks)->map(function ($task) {
                $task['responses'] = collect($task['responses'])->filter(function ($response): bool {
                    return $response['user']['id'] === Auth::id();
                })->values(); // reset keys
                return $task;
            })->values();
        }

        return Inertia::render('Groups/Index', $data);
    }

    public function updateGroup(int $id, CreateOrUpdateGroupRequest $request): RedirectResponse
    {
        // $groupMember = GroupMember::findOrFail(Auth::user()->id);
        $groupMember = GroupMember::where('user_id', Auth::user()->id)
            ->where('group_id', $id)
            ->firstOrFail();
        if ($groupMember->isAdminOrOwner()) {
            Group::findOrFail($id)->update([
                'name' => $request->validated()['name'],
            ]);
            return $this->backWith('success', 'Group Updated Successfully');
        }

        return $this->backWith('error', 'You are not Admin or Owner');
    }

    public function deleteGroup(int $id): RedirectResponse
    {
        $groupMember = GroupMember::where('user_id', Auth::user()->id)->where('group_id', $id)->firstOrFail();

        if ($groupMember->isOwner()) {
            Group::destroy($id);

            return $this->redirectWith('success', 'Group deleted Successfully', 'dashboard');
        }

        return $this->redirectWith('error', 'You are not Owner', 'dashboard');
    }

    public function createGroup(CreateOrUpdateGroupRequest $request): RedirectResponse
    {
        $group = Auth::user()->ownedGroups()->create([
            'name' => $request->validated()['name']
        ]);

        $group->groupMembers()->attach(Auth::id(), ['role' => 'owner']);

        return $this->backWith('success', 'Group created successfully');
    }

    public function createInvitationCode(int $id): RedirectResponse
    {
        $groupMember = GroupMember::where('user_id', Auth::user()->id)->where('group_id', $id)->firstOrFail();

        if (!$groupMember->isAdminOrOwner()) {
            return $this->backWith('error', 'You are not Admin or Owner');
        }

        $group = Group::with('invitationCode')->findOrFail($id);
        if ($group->invitationCode && $group->invitationCode->expires_at > now()) {
            return $this->backWith(
                'error',
                'An Invitation Code already exists',
                ['code' => $group->invitationCode->code]
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
        $invitationCode = InvitationCode::whereCode($code)->with('group')->first();

        if (!$invitationCode) {
            return request()->isMethod('post')
                ? $this->backWith('error', 'Invitation Code is invalid')
                : $this->redirectWith('error', 'Invitation Code is invalid', 'dashboard');
        }

        if ($invitationCode->expires_at < now()) {
            $invitationCode->delete();

            return request()->isMethod('post')
                ? $this->backWith('error', 'Invitation Code is expired or invalid')
                : $this->redirectWith('error', 'Invitation Code is expired or invalid', 'dashboard');
        }

        if ($invitationCode->group->groupMembers()->whereUserId(Auth::id())->exists()) {
            return request()->isMethod('post')
                ? $this->backWith('error', 'Group already joined')
                : $this->redirectWith('error', 'Group already joined', 'dashboard');
        }

        $invitationCode->group->groupMembers()->attach(Auth::id(), ['role' => 'user']);

        return request()->isMethod('post')
            ? $this->backWith('success', 'Group joined successfully')
            : $this->redirectWith('success', 'Group joined successfully', 'dashboard');
    }
}
