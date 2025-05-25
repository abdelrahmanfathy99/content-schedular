<?php

namespace App\Console\Commands;

use App\Jobs\PublishScheduledPostJob;
use App\Models\Post;
use Illuminate\Console\Command;

class publishScheduledPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:publish-scheduled-jobs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $posts = Post::query()
            ->where('status', 'scheduled')
            ->where('scheduled_time', '<=', now()->toDateTimeString())
            ->get();

        foreach ($posts as $post) {
            PublishScheduledPostJob::dispatchSync($post->id, $post->scheduled_time);
        }
    }
}
