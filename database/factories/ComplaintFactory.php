<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Complaint;
use App\Modules\Complaint\Enums\ComplaintStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComplaintFactory extends Factory
{
    protected $model = Complaint::class;

    public function definition(): array
    {
        return [
            'ticket' => 'CTU-'.strtoupper(fake()->bothify('?????')),
            'tracking_code' => strtoupper(fake()->bothify('?????')),
            'category_id' => Category::factory(),
            'reporter_name' => fake()->name(),
            'reporter_phone' => fake()->phoneNumber(),
            'reporter_email' => fake()->safeEmail(),
            'reporter_address' => fake()->address(),
            'is_anonymous' => false,
            'title' => fake()->sentence(6),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->address(),
            'status' => ComplaintStatus::SUBMITTED,
        ];
    }

    public function anonymous(): static
    {
        return $this->state(fn () => [
            'is_anonymous' => true,
            'reporter_name' => 'Anonim',
            'reporter_phone' => '-',
            'reporter_email' => null,
            'reporter_address' => null,
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn () => ['status' => ComplaintStatus::VERIFIED]);
    }

    public function processing(): static
    {
        return $this->state(fn () => ['status' => ComplaintStatus::PROCESSING]);
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => ComplaintStatus::COMPLETED]);
    }

    public function rejected(): static
    {
        return $this->state(fn () => ['status' => ComplaintStatus::REJECTED]);
    }
}
