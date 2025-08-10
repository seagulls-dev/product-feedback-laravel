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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('feedback_category_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['open', 'in_progress', 'completed', 'rejected'])->default('open');
            $table->integer('upvotes')->default(0);
            $table->integer('downvotes')->default(0);
            $table->timestamps();
            
            $table->index(['status', 'created_at']);
            $table->index(['feedback_category_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
