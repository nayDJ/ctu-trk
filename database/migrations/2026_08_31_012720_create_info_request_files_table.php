<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('info_request_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('info_request_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['follow_up']);
            $table->string('path');
            $table->string('mime');
            $table->unsignedBigInteger('size');
            $table->timestamps();

            $table->index('info_request_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('info_request_files');
    }
};
