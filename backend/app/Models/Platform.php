<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
    /** @use HasFactory<\Database\Factories\PlatformFactory> */
    use HasFactory;


    protected $guarded = [];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_platforms');
    }
}
