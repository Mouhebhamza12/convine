<?php

use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\WeddingController as AdminWeddingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\WeddingController;
use Illuminate\Support\Facades\Route;

Route::get('/csrf', fn () => response()->json(['token' => csrf_token()]));

Route::post('/login', [AuthController::class, 'login']);
Route::get('/user', [AuthController::class, 'user']);

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/weddings', [AdminWeddingController::class, 'index']);
        Route::post('/customers', [AdminCustomerController::class, 'store']);
    });

    Route::get('/wedding', [WeddingController::class, 'show']);
    Route::patch('/wedding', [WeddingController::class, 'update']);
    Route::put('/wedding/guests', [GuestController::class, 'sync']);
});
