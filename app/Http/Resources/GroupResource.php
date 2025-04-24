<?php

namespace App\Http\Resources;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;



/**@mixin Group*/
class GroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'groupMembers' => GroupMemberResource::collection($this->groupMembers)->jsonOptions()
        ];
    }
}
