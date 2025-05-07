<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskAnswer extends Model
{   
    protected $fillable = [
        'name',
        'file',
        'score',
        'text',
        'task_id',
        'user_id',
    ];
    public function user()
     {
        return $this->belongsTo(User::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
