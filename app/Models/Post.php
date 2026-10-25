<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'excerpt', 'body', 'image', 'author_id', 'is_published', 'published_at'];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    protected function bodyHtml(): Attribute
    {
        return Attribute::make(
            get: fn (): string => $this->formatBody((string) $this->body),
        );
    }

    private function formatBody(string $body): string
    {
        $body = trim($body);

        if ($body === '') {
            return '';
        }

        if (preg_match('/<(p|div|h[1-6]|ul|ol|blockquote|figure|table|pre)\b/i', $body)) {
            return $body;
        }

        $paragraphs = preg_split('/\R{2,}/', $body) ?: [];
        $html = [];

        foreach ($paragraphs as $paragraph) {
            $paragraph = trim($paragraph);

            if ($paragraph !== '') {
                $escaped = str_replace(["\r\n", "\r", "\n"], '<br>', e($paragraph));
                $html[] = '<p>'.$escaped.'</p>';
            }
        }

        return implode('', $html);
    }
}
