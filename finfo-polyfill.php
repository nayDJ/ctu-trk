<?php

declare(strict_types=1);

if (! defined('FILEINFO_NONE')) {
    define('FILEINFO_NONE', 0);
}

if (! defined('FILEINFO_MIME_TYPE')) {
    define('FILEINFO_MIME_TYPE', 16);
}

if (! defined('FILEINFO_MIME')) {
    define('FILEINFO_MIME', 1040);
}

if (! class_exists('finfo', false)) {
    class finfo
    {
        public function __construct(...$arguments) {}

        public function file(string $filename, int $flags = 0, $context = null): string|false
        {
            if (! is_file($filename) || ! is_readable($filename)) {
                return false;
            }

            $handle = @fopen($filename, 'rb');

            if ($handle === false) {
                return false;
            }

            $head = (string) fread($handle, 512);
            fclose($handle);

            return self::detect($head, strtolower(pathinfo($filename, PATHINFO_EXTENSION)));
        }

        public function buffer(string $contents, int $flags = 0, $context = null): string|false
        {
            return self::detect(substr($contents, 0, 512), '');
        }

        private static function detect(string $head, string $extension): string
        {
            if (str_starts_with($head, "\x89PNG\r\n\x1a\n")) {
                return 'image/png';
            }

            if (str_starts_with($head, "\xFF\xD8\xFF")) {
                return 'image/jpeg';
            }

            if (str_starts_with($head, 'GIF87a') || str_starts_with($head, 'GIF89a')) {
                return 'image/gif';
            }

            if (str_starts_with($head, 'RIFF') && substr($head, 8, 4) === 'WEBP') {
                return 'image/webp';
            }

            if (str_starts_with($head, '%PDF-')) {
                return 'application/pdf';
            }

            $text = ltrim($head);

            if (str_starts_with($text, '<svg') || (str_starts_with($text, '<?xml') && stripos($text, '<svg') !== false)) {
                return 'image/svg+xml';
            }

            return match ($extension) {
                'jpg', 'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                'svg' => 'image/svg+xml',
                'pdf' => 'application/pdf',
                default => 'application/octet-stream',
            };
        }
    }
}

if (! function_exists('finfo_open')) {
    function finfo_open(int $flags = FILEINFO_MIME_TYPE, ?string $magicDatabase = null): finfo|false
    {
        return new finfo($flags, $magicDatabase);
    }
}

if (! function_exists('finfo_file')) {
    function finfo_file(finfo $finfo, string $filename, int $flags = 0, $context = null): string|false
    {
        return $finfo->file($filename, $flags, $context);
    }
}

if (! function_exists('finfo_buffer')) {
    function finfo_buffer(finfo $finfo, string $contents, int $flags = 0, $context = null): string|false
    {
        return $finfo->buffer($contents, $flags, $context);
    }
}

if (! function_exists('finfo_close')) {
    function finfo_close(finfo $finfo): bool
    {
        return true;
    }
}

if (! function_exists('mime_content_type')) {
    function mime_content_type(string $filename): string|false
    {
        return (new finfo)->file($filename);
    }
}
