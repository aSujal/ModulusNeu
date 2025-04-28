<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    //
    protected $fillable = [
        'title',
        'file',
        'text',
        'score',
        'group_id',
    ];
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function taskAnswers()
    {
        return $this->hasMany(TaskAnswer::class);
    }
}
