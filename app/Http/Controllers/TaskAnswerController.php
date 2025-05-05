<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateTaskAnswerRequest;
use App\Http\Requests\UpdateTaskAnswer;
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

    public function store(int $taskId,CreateOrUpdateTaskAnswerRequest $request)
    {
        if (TaskAnswer::findOrFail($taskId)) {
            return $this->backWith('error', 'You can not uplaod a new answer.');
        }

        $validated = $request->validated();
        if($request->hasFile("file")){
            $file= Storage::disk("local")->put("tasks", $request->file("file"));
        }

        Auth::user()->taskAnswers()->create([
            "name" => $validated["name"],
            "file" => $file,
            "text" => $request["text"],
            "task_id" => $taskId
        ]);
        
        return $this->backWith(
            'success',
            'Task answer created successfully'
        );
    }

    public function update($id, UpdateTaskAnswer $request)
    {
        $task = TaskAnswer::findOrFail($$id);
        $validated = $request->validated();


        if($request->hasFile("file")){
            $file = Storage::disk("local")->put("tasks", $request->file("file"));
        }

        $task->update([
            "name" => $validated["name"],
            "file" => $file,
            "text" => $request["text"]
        ]);
        
        return $this->backWith(
            'success',
            'Task answer updated successfully'
        );
    }

    public function destroy($id)
    {
        TaskAnswer::destroy($$id);

        return $this->backWith(
            'success',
            'Task answer deleted successfully'
        );
    }
}
