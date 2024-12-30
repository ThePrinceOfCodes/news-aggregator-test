<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preference extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'source',
        'author'
    ];

    protected $casts = [
        'category' => 'array', 
        'source' => 'array',   
        'author' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
