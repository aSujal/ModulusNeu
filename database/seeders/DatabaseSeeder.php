<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(50)->create();

        foreach (range(1, 10) as $index) {
            /**@var User $owner*/
            $owner = $users->random();

            $group = Group::create([
                'name' => 'Group ' . $index,
                'user_id' => $owner->id,
            ]);

            foreach (range(1, 20) as $index) {
                $group->posts()->create([
                    'title' => "sdgikdsfjghjkf",
                    'status' => "öffentlich",
                    'description' => "hsadglkhsdlkghdsflkghdlsfkghdfklpughdkjghd",
                    'publish_at' => Carbon::now()->addDays(rand(1,50))
                ]);
            }


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
