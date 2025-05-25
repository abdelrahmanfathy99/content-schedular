<?php

namespace App\Repositories;

use App\Models\Post;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostRepository implements PostRepositoryInterface
{
    public function upsertAndAttachData(array $data): Post
    {
        return Post::upsertNewInstance(
            $data['id'] ?? null,
            $data['title'],
            $data['content'],
            $data['status'],
            $data['scheduled_time'] ?? null,
            $data['platform_ids'] ?? [],
            Auth::id(),
        );
    }

    public function getWithFilters(array $data)
    {
        return Post::query()
            ->with(['platforms:id,type', 'activities'])
            ->for(Auth::id())
            ->filter($data)
            ->paginate($data['per_page'] ?? 10, page: $data['page'] ?? 1);
    }

    public function getDashboardStats(int $userId)
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $result = Post::query()
            ->where('user_id', $userId)
            ->selectRaw('
                COUNT(DISTINCT posts.id) as total,
                COUNT(DISTINCT CASE WHEN posts.status = "published" THEN posts.id END) as published_count,
                COUNT(DISTINCT CASE WHEN posts.status = "scheduled" THEN posts.id END) as scheduled_count,
                COUNT(DISTINCT CASE WHEN posts.status = "draft" THEN posts.id END) as draft_count,
                COUNT(DISTINCT CASE WHEN posts.created_at BETWEEN ? AND ? THEN posts.id END) as current_month_count,
                COUNT(pp.id) as total_platforms_published_posts,
                SUM(CASE WHEN pp.status = "published" THEN 1 ELSE 0 END) as success_platforms
            ', [$startOfMonth, $endOfMonth])
            ->leftJoin('post_platforms as pp', function ($join) {
                $join->on('pp.post_id', '=', 'posts.id')
                    ->where('posts.status', 'published');
            })
            ->first();

        $successRate = 0;
        if ($result->total_platforms_published_posts > 0) {
            $successRate = ($result->success_platforms / $result->total_platforms_published_posts) * 100;
        }

        return [
            'total' => $result->total,
            'published' => $result->published_count,
            'scheduled' => $result->scheduled_count,
            'draft' => $result->draft_count,
            'current_month_count' => $result->current_month_count,
            'success_rate' => $successRate
        ];
    }

    public function getPlatFormStats(int $userId)
    {
        return Post::query()
            ->where('user_id', $userId)
            ->join('post_platforms as pp', 'pp.post_id', '=', 'posts.id')
            ->join('platforms as p', 'p.id', '=', 'pp.platform_id')
            ->select('p.type as platform_name', DB::raw('COUNT(posts.id) as total_posts'))
            ->groupBy('p.type')
            ->orderBy('total_posts', 'desc')
            ->get()
            ->pluck('total_posts', 'platform_name')
            ->toArray();
    }
}
