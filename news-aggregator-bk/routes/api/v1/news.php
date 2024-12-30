<?php

use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::get('/news-data', [NewsController::class, 'getNewsData']);
Route::get('/news-headlines', [NewsController::class, 'getNewsHeadlines']);
Route::get('/news/{id}', [NewsController::class, 'getNewsById']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/news-headlines-user', [NewsController::class, 'getUsersNewsHeadlines']);
});