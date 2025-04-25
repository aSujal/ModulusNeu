<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;



class GroupMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            'role' => $this->role ?? $this->pivot->role,
            'user' => $this->user ?? $this->full_name
        ];
    }
}
