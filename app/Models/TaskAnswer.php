<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskAnswer extends Model
{   
    public function groupMember()
     {
        return $this->belongsTo(GroupMember::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
