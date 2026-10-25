<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('href');
            $table->string('icon')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('menus')->nullOnDelete();
            $table->enum('context', ['admin', 'public']);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('visibility')->default('all');
            $table->timestamps();

            $table->index('context');
            $table->index('parent_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
