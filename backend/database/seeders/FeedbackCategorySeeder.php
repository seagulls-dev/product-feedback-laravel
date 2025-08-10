<?php

namespace Database\Seeders;

use App\Models\FeedbackCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeedbackCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Bug Report',
                'description' => 'Report issues, errors, or unexpected behavior',
                'color' => '#DC2626',
                'is_active' => true,
            ],
            [
                'name' => 'Feature Request',
                'description' => 'Suggest new features or functionality',
                'color' => '#059669',
                'is_active' => true,
            ],
            [
                'name' => 'Improvement',
                'description' => 'Suggest enhancements to existing features',
                'color' => '#2563EB',
                'is_active' => true,
            ],
            [
                'name' => 'UI/UX',
                'description' => 'Feedback about user interface and experience',
                'color' => '#7C3AED',
                'is_active' => true,
            ],
            [
                'name' => 'Performance',
                'description' => 'Report performance issues or optimization suggestions',
                'color' => '#EA580C',
                'is_active' => true,
            ],
            [
                'name' => 'General',
                'description' => 'General feedback and suggestions',
                'color' => '#6B7280',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            FeedbackCategory::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
