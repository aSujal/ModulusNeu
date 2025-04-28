<?php

namespace App\Http\Requests;

use App\Models\Group;
use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateOrUpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $group = Group::find($this->route('groupId'));
        // Auth::user()->can('create', $group);
        dd($this->user()->can('create-post', $group));
        return $group && $this->user()->can('create-post', $group);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'file' => ['file'],
            'text' => ['required', 'string'],
            'score' => ['required', 'integer', 'min:0'], 
        ];
    }
}
