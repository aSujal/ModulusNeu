<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class GroupMember extends Pivot
{
    protected $table = 'group_members';
    protected $fillable = [
        'user_id',
        'group_id',
        'role',
    ];

    // Optionally, add methods for role checking
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isAdminOrOwner()
    {
        return $this->role === 'admin' || $this->role === 'owner';
    }
}

