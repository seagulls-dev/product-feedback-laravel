<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('feedback_comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->text('content_html')->nullable(); // Processed HTML content with formatting
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('feedback_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('feedback_comments')->onDelete('cascade'); // For nested comments
            $table->json('mentioned_users')->nullable(); // Store mentioned user IDs
            $table->timestamps();
            
            $table->index(['feedback_id', 'created_at']);
            $table->index(['parent_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_comments');
    }
};
