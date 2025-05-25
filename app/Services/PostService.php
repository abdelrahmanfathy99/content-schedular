<?php

namespace App\Services;

use App\Models\Platform;
use App\Models\Post;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostService
{
    public function __construct(protected PostRepositoryInterface $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    public function fetch(Post $post)
    {
        return response()->json([
            'post' => $post->load('platforms:id,type'),
        ], 201);
    }

    public function getAll(array $filters)
    {
        return response()->json([
            'posts' => $this->postRepository->getWithFilters($filters),
            'platforms' => Platform::all(),
        ], 201);
    }

    public function getDashboardStats()
    {
        $data = $this->postRepository->getStats(Auth::id());

        return response()->json([
            'total' => $data->total,
            'published' => $data->published_count,
            'scheduled' => $data->scheduled_count,
            'draft' => $data->draft_count,
            'current_month_count' => $data->current_month_count,
        ], 201);
    }

    public function create(array $data)
    {
        try {
            DB::beginTransaction();
            $post = $this->postRepository->upsertAndAttachData($data);
            DB::commit();

            return response()->json([
                'message' => 'Post created successfully',
                'post' => $post,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "An error occurred while creating the post.",
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Post $post, array $data)
    {
        try {
            DB::beginTransaction();
            $post = $this->postRepository->upsertAndAttachData(array_merge($data, ['id' => $post->id]));
            DB::commit();

            return response()->json([
                'message' => 'Post updated successfully',
                'post' => $post,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => "An error occurred while updating the post.",
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function delete(Post $post)
    {
        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }
}
