<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    public const CACHE_KEY = 'app.settings';

    protected $fillable = ['key', 'value'];

    public $timestamps = false;

    public static function getValue(string $key, ?string $default = null): ?string
    {
        $setting = static::where('key', $key)->first();

        return $setting?->value ?? $default;
    }

    public static function set(string $key, ?string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        static::flushCache();
    }

    /**
     * @param  array<string, string|null>  $values
     */
    public static function setMany(array $values): void
    {
        if ($values === []) {
            return;
        }

        $rows = [];
        foreach ($values as $key => $value) {
            $rows[] = ['key' => $key, 'value' => $value];
        }

        static::upsert($rows, ['key'], ['value']);
        static::flushCache();
    }

    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
