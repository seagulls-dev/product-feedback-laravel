<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Feedback extends Model
{
    protected $fillable = [
        'title',
        'description',
        'user_id',
        'feedback_category_id',
        'status',
        'upvotes',
        'downvotes',
    ];

    protected $casts = [
        'upvotes' => 'integer',
        'downvotes' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FeedbackCategory::class, 'feedback_category_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(FeedbackComment::class);
    }

     // Get only top-level comments (no parent).
    public function topLevelComments(): HasMany
    {
        return $this->hasMany(FeedbackComment::class)->whereNull('parent_id');
    }

    // Scope to filter by status.
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

     // Scope to filter by category.
    public function scopeWithCategory($query, $categoryId)
    {
        return $query->where('feedback_category_id', $categoryId);
    }

     // Get the net score (upvotes - downvotes).
    public function getNetScoreAttribute(): int
    {
        return $this->upvotes - $this->downvotes;
    }
}
