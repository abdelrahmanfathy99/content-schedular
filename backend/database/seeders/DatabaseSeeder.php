<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (env('APP_ENV') === 'local') {
            $this->call(UserSeeder::class);
            $this->call(PlatformSeeder::class);
            $this->call(PostSeeder::class);
        }
    }
}
