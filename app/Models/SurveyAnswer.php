<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyAnswer extends Model
{
    use HasFactory;

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = ['survey_id', 'start_date', 'end_date'];

     public function scopeOfUser(Builder $query, int $userId): Builder
    {
        return $query->whereHas('survey', function (Builder $q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
