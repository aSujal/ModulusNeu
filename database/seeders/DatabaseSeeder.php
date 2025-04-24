<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 1000 users
        $users = User::factory(1000)->create();

        // Create 100 groups
        foreach (range(1, 100) as $index) {
            // Get a random user to be the owner
            $owner = $users->random();

            // Create a group and associate it with the owner
            $group = Group::create([
                'name' => 'Group ' . $index,  // Example group name
                'user_id' => $owner->id,  // Set the owner user_id
            ]);

            // Add the owner to the group_members table with the role 'owner'
            $group->groupMembers()->attach(
                $owner->id,
                ['role' => 'owner']
            );

            // Ensure each group has between 10 and 30 members (excluding the owner)
            $membersCount = rand(10, 30);
            $groupMembers = $users->where('id', '!=', $owner->id)->random($membersCount - 1);

            // Attach the selected members to the group
            foreach ($groupMembers as $user) {
                $group->groupMembers()->attach(
                    $user->id,
                    ['role' => 'user']
                );
            }
        }

    }
}
