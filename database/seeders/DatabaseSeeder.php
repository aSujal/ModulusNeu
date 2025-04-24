<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(1000)->create();

        foreach (range(1, 100) as $index) {
            /**@var User $owner*/
            $owner = $users->random();

            $group = Group::create([
                'name' => 'Group ' . $index,
                'user_id' => $owner->id,
            ]);

            $group->groupMembers()->attach(
                $owner->id,
                ['role' => 'owner']
            );

            $membersCount = rand(10, 30);
            $groupMembers = $users->where('id', '!=', $owner->id)->random($membersCount - 1);

            foreach ($groupMembers as $user) {
                $group->groupMembers()->attach(
                    $user->id,
                    ['role' => 'user']
                );

            }
        }

    }
}
