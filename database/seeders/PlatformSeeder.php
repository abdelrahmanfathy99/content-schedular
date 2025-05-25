<?php

namespace Database\Seeders;

use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Platform::updateOrCreate(
            [
                'id' => FACEBOOK
            ],
            [
                'name' => 'facebook page',
                'type' => 'facebook',
            ]
        );

        Platform::updateOrCreate(
            [
                'id' => INSTAGRAM
            ],
            [
                'name' => 'instagram page',
                'type' => 'instagram',
            ]
        );

        Platform::updateOrCreate(
            [
                'id' => TWITTER
            ],
            [
                'name' => 'twitter page',
                'type' => 'twitter',
            ]
        );

        Platform::updateOrCreate(
            [
                'id' => LINKEDIN
            ],
            [
                'name' => 'linkedin page',
                'type' => 'linkedin',
            ]
        );
    }
}
