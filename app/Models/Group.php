<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id', // The owner of the group
    ];

    // Group belongs to one user (owner)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Group can have many users as members (many-to-many)
    public function groupMembers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members')
            ->withPivot('role') // Store the role of the user in the pivot table
            ->withTimestamps();
    }

    // A group has many posts
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // A group has many tasks
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
