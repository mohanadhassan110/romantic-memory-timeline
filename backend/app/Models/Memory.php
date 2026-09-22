<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Memory extends Model
{
    protected $table = 'memories';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'title',
        'date',
        'category',
        'location',
        'image_url',
        'caption',
        'featured',
        'milestone_number',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'milestone_number' => 'integer',
    ];

    // Ensure frontend gets camelCase imageUrl as well
    protected $appends = ['imageUrl'];

    public function getImageUrlAttribute(): string
    {
        return $this->attributes['image_url'] ?? '';
    }

    public function setImageUrlAttribute(?string $value): void
    {
        $this->attributes['image_url'] = $value ?? '';
    }
}
