<?php

namespace App\Models;

use App\Jobs\PublishScheduledPostJob;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory, LogsActivity;

    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'content', 'status', 'scheduled_time']) // fields to log
            ->logOnlyDirty() // only log changed attributes
            ->setDescriptionForEvent(fn(string $eventName) => "Post has been {$eventName}");
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function platforms()
    {
        return $this->belongsToMany(Platform::class, 'post_platforms');
    }

    public function scopeFor(Builder $query, int $userId)
    {
        $query->where('user_id', $userId);
    }

    public function scopeFilter(Builder $query, array $filters)
    {
        if (!empty($filters['status'])) {
            $query->whereIn('status', $filters['status']);
        }

        if (!empty($filters['title'])) {
            $query->where('title', 'like', '%' . $filters['title'] . '%');
        }


        if (!empty($filters['is_published'])) {
            $query->whereNotNull('published_at');
        }

        if (!empty($filters['scheduled_date'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereDate('scheduled_time', $filters['scheduled_date'])
                    ->orWhereNull('scheduled_time');
            });
        }

        if (!empty($filters['platform_ids'])) {
            $query->whereHas('platforms', function ($q) use ($filters) {
                $q->whereIn('platforms.id', $filters['platform_ids']);
            });
        }
    }

    public static function upsertNewInstance(
        ?int $postId = null,
        string $title,
        string $content,
        string $status,
        ?string $scheduledTime = null,
        ?array $platformIds = [],
        int $userId
    ): self {

        $post = Post::updateOrCreate([
            'id' => $postId ?? null,
        ], [
            'title' => $title,
            'content' => $content,
            'status' => $status,
            'scheduled_time' => $scheduledTime,
            'user_id' => $userId,
            'published_at' => $status === 'published' ? now() : null,
        ]);

        $post->syncPlatforms($platformIds, $status);

        if ($post->status === 'scheduled' && $post->scheduled_time) {
            $delayedTime = Carbon::now('Africa/Cairo')->diffInSeconds(Carbon::parse($scheduledTime, 'Africa/Cairo'));
            PublishScheduledPostJob::dispatch($post->id, $post->scheduled_time)->delay($delayedTime);
        }

        return $post;
    }

    public function syncPlatforms(array $platformIds, string $status)
    {
        $syncData = [];
        foreach ($platformIds as $platFormId) {
            $syncData[$platFormId] = ['status' => $status];
        }

        $this->platforms()->sync($syncData);
    }
}
