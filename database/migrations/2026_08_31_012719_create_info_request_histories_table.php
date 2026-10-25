<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('info_request_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('info_request_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['SUBMITTED', 'PROCESSING', 'COMPLETED', 'REJECTED']);
            $table->text('note')->nullable();
            $table->string('content_link')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('info_request_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('info_request_histories');
    }
};
