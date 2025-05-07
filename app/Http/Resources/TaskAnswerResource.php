<?php

namespace App\Http\Resources;

use App\Models\TaskAnswer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TaskAnswer */
class TaskAnswerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'file'      => $this->file,
            'text'      => $this->text,
            'score'     => $this->score,
            'user' => $this->user,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
