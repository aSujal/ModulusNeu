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
        $specificUser = User::create([
            'full_name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $users = User::factory(50)->create();

        foreach (range(1, 10) as $index) {
            /**@var User $owner*/
            $owner = $users->random();

            $group = Group::create([
                'name' => 'Group ' . $index,
                'user_id' => $owner->id,
            ]);

            foreach (range(1, 10) as $index) {
                $group->posts()->create([
                    'title' => "Post Title " . $index,
                    'status' => "öffentlich",
                    'description' => "This is a sample description for post " . $index,
                    'publish_at' => Carbon::now()->addDays(rand(1, 50))
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

            foreach (range(1, rand(2, 5)) as $postIndex) {
                $post = $group->posts()->create([
                    'title' => 'Post ' . $postIndex . ' for ' . $group->name,
                    'status' => 'public',
                    'description' => 'This is a description for post ' . $postIndex . ' in ' . $group->name,
                    'publish_at' => Carbon::now()->addDays(rand(1, 10)),
                ]);
            }
        }
        $group = Group::find(1);
        $group->groupMembers()->attach(
            $specificUser->id,
            ['role' => 'owner']
        );
    }
}