<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->string('role')->nullable()->after('visibility');
            $table->dropIndex('menus_context_index');
            $table->dropColumn('context');
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->enum('context', ['public', 'admin_sidebar'])->default('public')->after('parent_id');
            $table->index('context');
        });
    }

    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropIndex('menus_context_index');
            $table->dropColumn('context');
            $table->dropColumn('role');
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->enum('context', ['admin', 'public'])->default('public')->after('parent_id');
            $table->index('context');
        });
    }
};
