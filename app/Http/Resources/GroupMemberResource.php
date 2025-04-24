<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;



class GroupMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'role' => $this->role,
            'user' => $this->user
        ];
    }
}
