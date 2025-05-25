<?php

namespace App\Repositories;

use App\Models\Post;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Support\Facades\Auth;

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
            ->with(['platforms:id,type'])
            ->for(Auth::id())
            ->filter($data)
            ->paginate($data['per_page'] ?? 10, page: $data['page'] ?? 1);
    }

    public function getStats(int $userId)
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();
        $data = Post::query()
            ->where('user_id', $userId)
            ->selectRaw('
                COUNT(*) as total,
                COUNT(CASE WHEN status = "published" THEN 1 END) as published_count,
                COUNT(CASE WHEN status = "scheduled" THEN 1 END) as scheduled_count,
                COUNT(CASE WHEN status = "draft" THEN 1 END) as draft_count,
                COUNT(CASE WHEN created_at BETWEEN ? AND ? THEN 1 END) as current_month_count
            ', [$startOfMonth, $endOfMonth])
            ->first();

        return $data;
    }
}
