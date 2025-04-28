<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function create(int $groupId, CreateOrUpdateTaskRequest $request)
    {
        $validated = $request->validated();
        if($validated->hasFile("file")){
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
}
