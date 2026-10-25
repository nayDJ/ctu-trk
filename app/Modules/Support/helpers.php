<?php

if (! function_exists('mask_name')) {
    function mask_name(string $name): string
    {
        $parts = explode(' ', $name);

        return implode(' ', array_map(function ($part) {
            $len = mb_strlen($part);
            if ($len <= 1) {
                return $part;
            }

            return mb_substr($part, 0, 1).str_repeat('*', $len - 1);
        }, $parts));
    }
}

if (! function_exists('mask_phone')) {
    function mask_phone(string $phone): string
    {
        $len = mb_strlen($phone);
        if ($len <= 4) {
            return $phone;
        }

        $visible = min(4, $len);
        $masked = str_repeat('*', $len - $visible);

        return mb_substr($phone, 0, $visible).$masked;
    }
}

if (! function_exists('mask_email')) {
    function mask_email(string $email): string
    {
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return $email;
        }

        $local = $parts[0];
        $domain = $parts[1];
        $len = mb_strlen($local);
        if ($len <= 1) {
            return $email;
        }

        return mb_substr($local, 0, 1).str_repeat('*', $len - 1).'@'.$domain;
    }
}

if (! function_exists('mask_address')) {
    function mask_address(string $address): string
    {
        $len = mb_strlen($address);
        if ($len <= 6) {
            return $address;
        }

        $visible = min(6, $len);

        return mb_substr($address, 0, $visible).str_repeat('*', $len - $visible);
    }
}
