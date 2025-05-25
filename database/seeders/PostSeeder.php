<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get ids of all users
        $usersIds = User::all()->pluck('id')->toArray();
        $postStatuses = ['draft', 'scheduled', 'published'];
        $allPlatformsIds = [FACEBOOK, INSTAGRAM, TWITTER, LINKEDIN];

        $data = [];
        // create 100 posts for each user
        foreach ($usersIds as $userId) {
            for ($i = 0; $i < 100; $i++) {
                $status = fake()->randomElement($postStatuses);
                if ($status === 'published') {
                    $randomDate = now()->subDays(rand(1, 90));
                } else {
                    $randomDate = now()->addDays(rand(1, 90));
                }
                $data[] = [
                    'title' => fake()->sentence(),
                    'content' => fake()->text(250),
                    'status' => $status,
                    'scheduled_time' => $status !== 'draft' ? $randomDate->format('Y-m-d H:i:s') : null,
                    'published_at' => $status === 'published' ? $randomDate->addMinutes(rand(1, 5))->format('Y-m-d H:i:s') : null,
                    'user_id' => $userId,
                    'created_at' => $randomDate->subDays(2),
                    'updated_at' => $randomDate->setDays(2),
                ];
            }
        }

        DB::table('posts')->insert($data);

        $data = [];
        // sync posts with platforms
        $posts = Post::all()->pluck('status', 'id')->toArray();
        foreach ($posts as $postId => $status) {
            $platformsIds = fake()->randomElements($allPlatformsIds, rand(1, 4));
            foreach ($platformsIds as $platformId) {
                $status = $status === 'published' ? fake()->randomElement(['published', 'failed']) : $status;
                $data[] = [
                    'post_id' => $postId,
                    'platform_id' => $platformId,
                    'status' => $status
                ];
            }
        }

        // insert by chunks
        foreach (array_chunk($data, 50) as $chunk) {
            DB::table('post_platforms')->insert($chunk);
        }
    }
}
