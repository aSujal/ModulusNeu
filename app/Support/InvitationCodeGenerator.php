<?php

namespace App\Support;

use Illuminate\Support\Str;

class InvitationCodeGenerator
{
    public static function generate(): string
    {
        return Str::random(6);
    }
}
