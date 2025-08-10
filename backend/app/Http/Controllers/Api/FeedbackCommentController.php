<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\FeedbackComment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use League\CommonMark\CommonMarkConverter;

class FeedbackCommentController extends Controller
{
    
    public function index(Request $request, Feedback $feedback): JsonResponse
    {
        $comments = $feedback->topLevelComments()
            ->with(['user', 'replies.user'])
            ->orderBy('created_at', 'asc')
            ->paginate($request->get('per_page', 20));

        return response()->json($comments);
    }

  
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'feedback_id' => 'required|exists:feedback,id',
            'parent_id' => 'nullable|exists:feedback_comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process content for formatting and mentions
        $content = $request->content;
        $mentionedUsers = $this->extractMentions($content);
        $contentHtml = $this->processContent($content);

        $comment = FeedbackComment::create([
            'content' => $content,
            'content_html' => $contentHtml,
            'user_id' => Auth::id(),
            'feedback_id' => $request->feedback_id,
            'parent_id' => $request->parent_id,
            'mentioned_users' => $mentionedUsers,
        ]);

        $comment->load(['user', 'replies.user']);

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => $comment,
        ], 201);
    }

   
    public function show(FeedbackComment $comment): JsonResponse
    {
        $comment->load(['user', 'feedback', 'replies.user']);
        
        return response()->json($comment);
    }

    
    public function update(Request $request, FeedbackComment $comment): JsonResponse
    {
        // Only allow the owner to update their comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process content for formatting and mentions
        $content = $request->content;
        $mentionedUsers = $this->extractMentions($content);
        $contentHtml = $this->processContent($content);

        $comment->update([
            'content' => $content,
            'content_html' => $contentHtml,
            'mentioned_users' => $mentionedUsers,
        ]);

        $comment->load(['user', 'replies.user']);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment,
        ]);
    }

    
    public function destroy(FeedbackComment $comment): JsonResponse
    {
        // Only allow the owner to delete their comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }

  
    private function extractMentions(string $content): array
    {
        preg_match_all('/@(\w+)/', $content, $matches);
        
        if (empty($matches[1])) {
            return [];
        }

        $usernames = array_unique($matches[1]);
        $users = User::whereIn('name', $usernames)->pluck('id')->toArray();

        return $users;
    }

    
    private function processContent(string $content): string
    {
        $converter = new CommonMarkConverter([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);

        // Convert mentions to links
        $content = preg_replace(
            '/@(\w+)/',
            '[@$1](#user/$1)',
            $content
        );

        $html = $converter->convert($content)->getContent();

        return $html;
    }

    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $users = User::where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'email')
            ->limit(10)
            ->get();

        return response()->json($users);
    }
}
