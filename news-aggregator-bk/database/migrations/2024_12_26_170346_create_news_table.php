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
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->string('image_url')->nullable();
            $table->string('source');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->text('content');
            $table->text('headline');
            $table->text('title');
            $table->string('author')->nullable();
            $table->string('pub_date');
            $table->string('api_origin')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
