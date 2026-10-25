<?php

namespace Database\Factories;

use App\Models\InfoRequest;
use App\Modules\InfoRequest\Enums\InfoRequestStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class InfoRequestFactory extends Factory
{
    protected $model = InfoRequest::class;

    public function definition(): array
    {
        return [
            'ticket' => 'IFM-'.strtoupper(fake()->bothify('?????')),
            'tracking_code' => strtoupper(fake()->bothify('?????')),
            'requester_name' => fake()->name(),
            'requester_phone' => fake()->phoneNumber(),
            'requester_email' => fake()->safeEmail(),
            'requester_address' => fake()->address(),
            'title' => fake()->sentence(6),
            'description' => fake()->paragraphs(2, true),
            'info_requested' => fake()->sentence(10),
            'status' => InfoRequestStatus::SUBMITTED,
        ];
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => InfoRequestStatus::COMPLETED]);
    }
}
