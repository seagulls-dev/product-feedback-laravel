<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeedbackCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

     // Get all feedback items for this category.
    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

     // Scope to get only active categories.
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
