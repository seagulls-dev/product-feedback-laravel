<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FeedbackCategoryController;
use App\Http\Controllers\Api\FeedbackCommentController;
use App\Http\Controllers\Api\FeedbackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public feedback routes (read-only)
Route::get('/feedback', [FeedbackController::class, 'index']);
Route::get('/feedback/{feedback}', [FeedbackController::class, 'show']);
Route::get('/feedback-categories', [FeedbackCategoryController::class, 'index']);
Route::get('/feedback/{feedback}/comments', [FeedbackCommentController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Feedback routes
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::put('/feedback/{feedback}', [FeedbackController::class, 'update']);
    Route::delete('/feedback/{feedback}', [FeedbackController::class, 'destroy']);
    Route::post('/feedback/{feedback}/upvote', [FeedbackController::class, 'upvote']);
    Route::post('/feedback/{feedback}/downvote', [FeedbackController::class, 'downvote']);
    
    // Comment routes
    Route::post('/comments', [FeedbackCommentController::class, 'store']);
    Route::get('/comments/{comment}', [FeedbackCommentController::class, 'show']);
    Route::put('/comments/{comment}', [FeedbackCommentController::class, 'update']);
    Route::delete('/comments/{comment}', [FeedbackCommentController::class, 'destroy']);
    
    // User search for mentions
    Route::get('/users/search', [FeedbackCommentController::class, 'searchUsers']);
    
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
