<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('ticket', 20)->unique();
            $table->string('tracking_code', 20)->unique();
            $table->foreignId('category_id')->constrained();
            $table->string('reporter_name');
            $table->string('reporter_phone');
            $table->string('reporter_email')->nullable();
            $table->string('reporter_address')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->string('title');
            $table->text('description');
            $table->string('location')->nullable();
            $table->enum('status', ['SUBMITTED', 'VERIFIED', 'PROCESSING', 'COMPLETED', 'REJECTED'])->default('SUBMITTED');
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
