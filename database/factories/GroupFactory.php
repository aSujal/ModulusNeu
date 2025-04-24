<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Group;

class GroupFactory extends Factory
{
    protected $model = Group::class;

    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 100000),
            'name' => $this->faker->name(),
            'created_at' => $this->faker->dateTime()
        ];
    }
}
