<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateTaskAnswerRequest;
use App\Models\TaskAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskAnswerController extends Controller
{
    public function index()
    {
    }

    public function show($id)
    {
        // Logic to display a specific task answer
        return view('task_answers.show', compact('id'));
    }

    public function create()
    {
        // Logic to show form for creating a new task answer
        return Inertia::render('TaskAnswer/Create');
    }

    public function store($taskId,CreateOrUpdateTaskAnswerRequest $request)
    {
        $validated = $request->validated();
        if($request->hasFile("file")){
            $file= Storage::disk("local")->put("tasks", $request->file("file"));
        }
        $task = TaskAnswer::create([
            "name" => $validated["name"],
            "file" => $file,
            "text" => $request["text"],
            "score" => 0,
            "task_id" => $taskId,
            "user_id" => $request->user()->id,
        ]);
        
        return $this->backWith(
            'success',
            'Task answer created successfully'
        );
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
    }

    public function destroy($id)
    {
    }
}
