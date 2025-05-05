<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //
    protected $fillable = [
        'title',
        'type',
        'group_id',
        'description'
    ];
    public function group()
     {
        return $this->belongsTo(Group::class);
    }
    
}
