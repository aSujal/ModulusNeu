<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\InvitationCode;

class InvitationCodeFactory extends Factory
{
    protected $model = InvitationCode::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->name(),
            'expires_at' => $this->faker->name(),
        ];
    }
}