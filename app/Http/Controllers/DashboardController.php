<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupResource;
use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $groups = Group::with('posts')->withCount('groupMembers')->whereUserId(Auth::user()->id)->get();
        $user = User::with(['ownedGroups.groupMembers', 'groups.groupMembers'])->findOrFail(Auth::user()->id);


        $ownedGroups = GroupResource::collection($user->ownedGroups)->jsonSerialize();
        $memberGroups = GroupResource::collection($user->groups)->jsonSerialize();
        $allGroups = collect([...$ownedGroups, ...$memberGroups])
            ->unique('id')
            ->values() 
            ->all();

        $allGroups = collect($allGroups)->map(function ($group) {
    
            $group['group_members_count'] = count($group['groupMembers']);
            return $group;
        })->all();

        return Inertia::render('Dashboard/Index', [
            'groups' => $allGroups
        ]);
    }
}
