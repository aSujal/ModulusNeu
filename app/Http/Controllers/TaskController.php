<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Group;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function showFile($filenameWithoutExtension)
    {
        // nur die user die in diese gruppe sind können es seehen
        $files = Storage::disk('local')->files('tasks');
        $matchingFile = collect($files)->first(function ($file) use ($filenameWithoutExtension) {
            return pathinfo($file, PATHINFO_FILENAME) === $filenameWithoutExtension;
        });

        if (!$matchingFile) {
            abort(404, 'File not found.');
        }
        return Storage::disk('local')->download($matchingFile);
    }
    public function index(int $taskId)
    {
        $task = Task::findOrFail($taskId);
        return Inertia::render('Task/Index', [
            'task' => $task,
        ]);
    }
    public function create()
    {
        return Inertia::render('Task/Create');
    }
    public function store(int $groupId, CreateOrUpdateTaskRequest $request)
    {
        $validated = $request->validated();
        if ($request->hasFile("file")) {
            $file = Storage::disk("local")->put("tasks", $request->file("file"));
        }
        Task::create([
            "title" => $validated["title"],
            "file" => $file ?? null,
            "text" => $request["text"],
            "max_score" => $request["max_score"],
            "due_date" => $request["due_date"] ?? null,
            "group_id" => $groupId,
        ]);

        return $this->backWith(
            'success',
            'Post created successfully'
        );
    }

    public function getTasksForGroup($groupId)
    {
        $group = Group::with('tasks')->findOrFail($groupId);
        $user = Auth::user();
        $groupMember = $group->groupMembers()->where('user_id', $user->id)->first();
        if (!$groupMember) {
            abort(403, 'Unauthorized');
        }
        // dd( $group->tasks);
        // return Inertia::render('Group/Tasks', [
        //     'group' => $group,
        //     'tasks' => TaskResource::collection($group->tasks),
        // ]);
        return TaskResource::collection($group->tasks);
    }

    public function update(int $groupId, CreateOrUpdateTaskRequest $request): RedirectResponse
    {
        $task = Task::findOrFail($request["id"]);
        if ($request->hasFile("file")) {
            $file = Storage::disk("local")->put("tasks", $request->file("file"));
        }
        $validated = $request->validated();
        $task->update([
            "title" => $validated["title"],
            "file" => $file ?? null,
            "text" => $validated["text"],
            "due_date" => $validated['due_date'],
            "max_score" => $validated["max_score"],
        ]);

        return $this->backWith('success', 'Task updated successfully!');
    }
    public function destroy($taskId): RedirectResponse
    {
        $task = Task::findOrFail($taskId);

        if (Auth::user()->isAdminOrOwner($task->group_id)) {
            $task->delete();
            return $this->backWith('success', 'Task deleted successfully!');
        }
        return $this->backWith('error', 'You are not an Admin or Owner of this group.');
    }
}
