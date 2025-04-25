<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //
    protected $fillable = [
        'title',
        'status',
        'publish_at',
        'type',
        'group_id',
    ];
    public function group()
     {
        return $this->belongsTo(Group::class);
    }
    
}
