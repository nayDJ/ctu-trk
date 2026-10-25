<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ponytail: guard hasIndex agar idempoten di DB yang sudah punya index ini
        $this->addIndex('agendas', 'agendas_is_published_index', ['is_published']);
        $this->addIndex('agendas', 'agendas_is_published_starts_at_index', ['is_published', 'starts_at']);
        $this->addIndex('messages', 'messages_is_read_index', ['is_read']);
        $this->addIndex('audit_logs', 'audit_logs_action_index', ['action']);
        $this->addIndex('audit_logs', 'audit_logs_role_index', ['role']);
        $this->addIndex('posts', 'posts_is_published_published_at_index', ['is_published', 'published_at']);

        if (! Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');

        $this->dropIndex('posts', 'posts_is_published_published_at_index', ['is_published', 'published_at']);
        $this->dropIndex('audit_logs', 'audit_logs_action_index', ['action']);
        $this->dropIndex('audit_logs', 'audit_logs_role_index', ['role']);
        $this->dropIndex('messages', 'messages_is_read_index', ['is_read']);
        $this->dropIndex('agendas', 'agendas_is_published_starts_at_index', ['is_published', 'starts_at']);
        $this->dropIndex('agendas', 'agendas_is_published_index', ['is_published']);
    }

    private function addIndex(string $table, string $name, array $columns): void
    {
        if (! $this->hasIndex($table, $name)) {
            Schema::table($table, function (Blueprint $table) use ($columns) {
                $table->index($columns);
            });
        }
    }

    private function dropIndex(string $table, string $name, array $columns): void
    {
        if ($this->hasIndex($table, $name)) {
            Schema::table($table, function (Blueprint $table) use ($columns) {
                $table->dropIndex($columns);
            });
        }
    }

    private function hasIndex(string $table, string $name): bool
    {
        return collect(Schema::getIndexes($table))->pluck('name')->contains($name);
    }
};
