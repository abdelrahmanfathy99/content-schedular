<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostFilterRequest;
use App\Http\Requests\PostRequest;
use App\Models\Post;
use App\Services\PostService;

class PostController extends Controller
{
    public function __construct(protected PostService $postService)
    {
        $this->postService = $postService;
    }

    public function show(Post $post)
    {
        return $this->postService->fetch($post);
    }

    public function index(PostFilterRequest $request)
    {
        return $this->postService->getAll($request->validated());
    }

    public function store(PostRequest $request)
    {
        return $this->postService->create($request->validated());
    }

    public function update(Post $post, PostRequest $request)
    {
        return $this->postService->update($post, $request->validated());
    }

    public function destroy(Post $post)
    {
        return $this->postService->delete($post);
    }
}
