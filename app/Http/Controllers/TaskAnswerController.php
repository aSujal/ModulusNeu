<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateTaskAnswerRequest;
use App\Http\Requests\UpdateTaskAnswer;
use App\Models\Group;
use App\Models\Task;
use App\Models\TaskAnswer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskAnswerController extends Controller
{
    public function show($answerId)
    {
        return view('task_answers.show', compact('id'));
    }
    public function store(int $taskId, CreateOrUpdateTaskAnswerRequest $request)
    {
        $user = Auth::user();
        // Check if the user already has a task answer for the given task
        if ($user->taskAnswers()->where('task_id', $taskId)->exists()) {
            return $this->backWith(
                'error',
                'You have already submitted an answer for this task'
            );
        }

        $validated = $request->validated();
        if ($request->hasFile("file")) {
            $file = Storage::disk("local")->put("tasks", $request->file("file"));
        }

        $task = Task::findOrFail($taskId);
        $member = $task->group->groupMembers()->where('user_id', $user->id)->firstOrFail();
        $member->taskAnswers()->create([
            "file" => $file ?? null,
            "text" => $validated["text"],
            "task_id" => $taskId
        ]);

        return $this->backWith(
            'success',
            'Task answer created successfully'
        );
    }

    public function evaluate($groupId, Request $request)
    {
        $group = Group::find($groupId);
        // Auth::user()->can('create', $group);
        // dd($this->user()->can('create', [Task::class,$group]));
        // dd( $group);

        if($group && Auth::user()->can('create', [Task::class, $group])){
            $task = TaskAnswer::findOrFail($request["taskAnswerId"]);

    
            $task->update([
                'score' => $request["score"],
            ]);
    
            return $this->backWith(
                'success',
                'Task answer updated successfully'
            );
        }
        return $this->backWith(
            'error',
            'You are not allowed to evaluate this task answer'
        );
    }
        

    public function destroy($id)
    {
        $user = Auth::user();
        $taskAnswer = TaskAnswer::findOrFail($id);
        $task = Task::findOrFail($taskAnswer->task_id);
        $group = $task->group;

        // Ensure the user is a group member
        $group->groupMembers()->where('user_id', $user->id)->firstOrFail();

        // Allow if user is the author or an admin/owner
        if ($taskAnswer->user_id !== $user->id && !$user->isAdminOrOwner($group->id)) {
            return $this->backWith(
                'error',
                'You are not allowed to delete this task answer'
            );
        }

        $taskAnswer->delete();

        return $this->backWith(
            'success',
            'Task answer deleted successfully'
        );
    }
}
