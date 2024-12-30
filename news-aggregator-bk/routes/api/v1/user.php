<?php

use App\Http\Controllers\PreferenceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/preferences', [PreferenceController::class, 'updateOrCreatePreferences']);
});