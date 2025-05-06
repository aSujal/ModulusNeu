<?php

namespace App\Http\Requests;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateOrUpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $group = Auth::user()->ownedGroups()->where('id', $this->route("groupId"))->first();
        $joinedGroup = Auth::user()->groups()->where('group_id', $this->route("groupId"))->first();

        return $group || $joinedGroup?->pivot->role == "admin";
    }

    public function rules(): array
    {
        return [
            'id' => 'nullable|integer|exists:posts,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ];
    }
}
