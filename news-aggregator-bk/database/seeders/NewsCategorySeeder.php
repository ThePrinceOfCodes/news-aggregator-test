<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Technology', 'description' => 'Latest updates in technology'],
            ['name' => 'Sports', 'description' => 'All about sports events'],
            ['name' => 'Politics', 'description' => 'News about politics'],
            ['name' => 'Health', 'description' => 'Health-related news and updates'],
            ['name' => 'Entertainment', 'description' => 'Movies, music, and celebrity news'],
        ];

        DB::table('categories')->insert($categories);
    }
}
