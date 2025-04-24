<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    //
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function taskAnswers()
    {
        return $this->hasMany(TaskAnswer::class);
    }
}
