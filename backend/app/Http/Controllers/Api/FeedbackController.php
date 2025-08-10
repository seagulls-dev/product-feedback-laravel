<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\FeedbackCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
   
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::with(['user', 'category'])
            ->orderBy('created_at', 'desc');

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('feedback_category_id', $request->category_id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by title or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $feedback = $query->paginate($request->get('per_page', 15));

        return response()->json($feedback);
    }

   
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'feedback_category_id' => 'required|exists:feedback_categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $feedback = Feedback::create([
            'title' => $request->title,
            'description' => $request->description,
            'feedback_category_id' => $request->feedback_category_id,
            'user_id' => Auth::id(),
        ]);

        $feedback->load(['user', 'category']);

        return response()->json([
            'message' => 'Feedback created successfully',
            'feedback' => $feedback,
        ], 201);
    }

    
    public function show(Feedback $feedback): JsonResponse
    {
        $feedback->load([
            'user',
            'category',
            'topLevelComments.user',
            'topLevelComments.replies.user'
        ]);

        return response()->json($feedback);
    }

   
    public function update(Request $request, Feedback $feedback): JsonResponse
    {
        // Only allow the owner to update their feedback
        if ($feedback->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'feedback_category_id' => 'sometimes|required|exists:feedback_categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $feedback->update($request->only(['title', 'description', 'feedback_category_id']));
        $feedback->load(['user', 'category']);

        return response()->json([
            'message' => 'Feedback updated successfully',
            'feedback' => $feedback,
        ]);
    }

   
    public function destroy(Feedback $feedback): JsonResponse
    {
        if ($feedback->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully',
        ]);
    }

    public function upvote(Feedback $feedback): JsonResponse
    {
        $feedback->increment('upvotes');

        return response()->json([
            'message' => 'Feedback upvoted',
            'upvotes' => $feedback->upvotes,
            'net_score' => $feedback->net_score,
        ]);
    }


    public function downvote(Feedback $feedback): JsonResponse
    {
        $feedback->increment('downvotes');

        return response()->json([
            'message' => 'Feedback downvoted',
            'downvotes' => $feedback->downvotes,
            'net_score' => $feedback->net_score,
        ]);
    }
}
