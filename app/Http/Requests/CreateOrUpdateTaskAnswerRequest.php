<?php

namespace App\Http\Requests;

use App\Models\Group;
use App\Models\Task;
use App\Models\TaskAnswer;
use Illuminate\Foundation\Http\FormRequest;

class CreateOrUpdateTaskAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $task=Task::find($this->route('taskId')) ;
        $group = $task->group;
        return $task && $group && $this->user()->can('create', [TaskAnswer::class,$group]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'file' => 'nullable|file',
            'text' => 'required|string',
            'score' => 'nullable|numeric',
        ];
    }
}
