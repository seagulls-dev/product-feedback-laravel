<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeedbackComment extends Model
{
    protected $fillable = [
        'content',
        'content_html',
        'user_id',
        'feedback_id',
        'parent_id',
        'mentioned_users',
    ];

    protected $casts = [
        'mentioned_users' => 'array',
    ];

     // Get the user who created this comment.
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

     // Get the feedback this comment belongs to.
    public function feedback(): BelongsTo
    {
        return $this->belongsTo(Feedback::class);
    }

     // Get the parent comment (for nested comments).
    public function parent(): BelongsTo
    {
        return $this->belongsTo(FeedbackComment::class, 'parent_id');
    }

     // Get child comments (replies).
    public function replies(): HasMany
    {
        return $this->hasMany(FeedbackComment::class, 'parent_id');
    }

     // Get mentioned users.
    public function mentionedUsers()
    {
        if (empty($this->mentioned_users)) {
            return collect();
        }
        
        return User::whereIn('id', $this->mentioned_users)->get();
    }

     // Scope to get only top-level comments.
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

     // Check if this comment has replies.
    public function hasReplies(): bool
    {
        return $this->replies()->exists();
    }
}
