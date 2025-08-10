<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeedbackCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackCategoryController extends Controller
{
    
    public function index(): JsonResponse
    {
        $categories = FeedbackCategory::active()
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    
    public function create()
    {
        //
    }

    
    public function store(Request $request)
    {
        //
    }

    
    public function show(string $id)
    {
        //
    }

    
    public function edit(string $id)
    {
        //
    }

    
    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
