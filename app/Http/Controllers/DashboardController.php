<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\PostService;

class DashboardController extends Controller
{
    public function __construct(protected PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index()
    {
        return $this->postService->getDashboardStats();
    }
}
