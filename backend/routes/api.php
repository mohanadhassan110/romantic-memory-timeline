<?php

use App\Http\Controllers\TimelineController;
use Illuminate\Support\Facades\Route;

Route::get('/timeline', [TimelineController::class, 'index']);
Route::post('/memories', [TimelineController::class, 'storeMemory']);
Route::put('/memories/{id}', [TimelineController::class, 'updateMemory']);
Route::delete('/memories/{id}', [TimelineController::class, 'destroyMemory']);
Route::delete('/memories', [TimelineController::class, 'clearAllMemories']);
Route::post('/settings', [TimelineController::class, 'updateSettings']);
Route::post('/reset', [TimelineController::class, 'resetToDefaults']);
