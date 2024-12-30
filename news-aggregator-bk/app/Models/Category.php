<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //
    protected $fillable = [
        'name',
        'description'
    ];

    public $timestamps = false;

    public function news()
    {
        return $this->hasMany(News::class, 'category_id');
    }
}
