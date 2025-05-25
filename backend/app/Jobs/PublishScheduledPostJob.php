<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class PublishScheduledPostJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private int $postId, private string $scheduledTime)
    {
        $this->postId = $postId;
        $this->scheduledTime = $scheduledTime;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $post = Post::find($this->postId);
        if (!$post || $post->status !== 'scheduled' || $post->scheduled_time !== $this->scheduledTime) {
            return;
        }

        $post->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        DB::table('post_platforms')
            ->where('post_id', $this->postId)
            ->update(['status' => 'published']);

        // Dispatch job to publish the post on all platforms
    }
}
