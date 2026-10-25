<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('info_requests', function (Blueprint $table) {
            $table->id();
            $table->string('ticket', 20)->unique();
            $table->string('tracking_code', 20)->unique();
            $table->string('requester_name');
            $table->string('requester_phone');
            $table->string('requester_email')->nullable();
            $table->string('requester_address')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('info_requested');
            $table->enum('status', ['SUBMITTED', 'PROCESSING', 'COMPLETED', 'REJECTED'])->default('SUBMITTED');
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('info_requests');
    }
};
