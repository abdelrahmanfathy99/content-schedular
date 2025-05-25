<?php

namespace App\Repositories\Interfaces;

use App\Models\Post;
use App\Models\User;

interface PostRepositoryInterface
{
    public function upsertAndAttachData(array $data): Post;
    public function getWithFilters(array $filters);
    public function getDashboardStats(int $userId);
    public function getPlatFormStats(int $userId);
}
