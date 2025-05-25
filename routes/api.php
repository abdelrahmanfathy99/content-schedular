<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PlatFormController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/platforms', [PlatFormController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::prefix('user')->group(function () {
        Route::resource('post', PostController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
    });
});
