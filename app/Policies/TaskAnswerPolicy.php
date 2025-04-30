<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\TaskAnswer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskAnswerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TaskAnswer $taskAnswer): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Group $group): bool
    {
        $joinedGroup = $user->groups()->where('group_id', $group->id)->first();
        return $joinedGroup !== null;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TaskAnswer $taskAnswer): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TaskAnswer $taskAnswer): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TaskAnswer $taskAnswer): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TaskAnswer $taskAnswer): bool
    {
        return false;
    }
}
