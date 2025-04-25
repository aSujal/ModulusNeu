<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Post;

/** @mixin Post */
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at,
            'id' => $this->id,
            'title' => $this->title,
            'status' => $this->status,
            'description' => $this->description,
            'publish_at' => $this->publish_at,
        ];
    }
}
