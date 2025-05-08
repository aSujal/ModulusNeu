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
            "id"=>$this->id,
            'name' => $this->name,
            'posts' => PostResource::collection($this->posts)->jsonSerialize(),
            'group_members_count' => $this->group_members_count,
        ];
    }
}
