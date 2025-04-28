<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(int $taskId)
    {
        $task = Task::findOrFail($taskId);
        return Inertia::render('Task/Index', [
            'task' => $task,
        ]);
    }
    public function create(){
        return Inertia::render('Task/Create');
    }
    public function store(int $groupId, CreateOrUpdateTaskRequest $request)
    {
        $validated = $request->validated();
        if($request->hasFile("file")){
            $file= Storage::disk("local")->put("tasks", $request->file("file"));
        }
        $task = Task::create([
            "title" => $validated["title"],
            "file" => $file,
            "text" => $request["text"],
            "score" => $request["score"],
            "group_id" => $groupId,
        ]);
        
        return $this->backWith(
            'success',
            'Post created successfully'
        );
    }
    public function update(int $id, CreateOrUpdateTaskRequest $request): RedirectResponse
    {
        $task = Task::findOrFail($id);
        if (Auth::user()->isAdminOrOwner($task->group_id)) {
            $validated = $request->validated();
            $task->update([
                "title" => $validated["title"],
                "file" => $validated["file"],
                "text" => $validated["text"],
                "score" => $validated["score"],
            ]);

            return $this->backWith('success','Task updated successfully!');
        }
        return $this->backWith('error','You are not an Admin or Owner of this group.');
    }
    public function destroy($taskId): RedirectResponse
    {
        $task = Task::findOrFail($taskId);

        if (Auth::user()->isAdminOrOwner($task->group_id)) {
            $task->delete();
            return $this->backWith('success','Task deleted successfully!');
        }
        return $this->backWith('error','You are not an Admin or Owner of this group.');
    }
    
}
