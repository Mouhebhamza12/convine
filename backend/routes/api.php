<?php

use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\WeddingController as AdminWeddingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\WeddingController;
use Illuminate\Support\Facades\Route;

// CSRF and authentication routes need the session, so run them under the
// `web` middleware group which boots the session store for the request.
Route::middleware('web')->group(function () {
    Route::get('/csrf', fn () => response()->json(['token' => csrf_token()]))
        ->middleware('throttle:60,1');

    // Public, unauthenticated endpoints — throttled per IP to blunt scraping,
    // token-guessing and RSVP spam.
    Route::get('/invite/{token}', [InvitationController::class, 'show'])
        ->middleware('throttle:90,1');
    Route::post('/invite/{token}/rsvp', [InvitationController::class, 'rsvp'])
        ->middleware('throttle:15,1');

    // Tight limit on login to defeat password brute-forcing.
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:6,1');
    Route::get('/user', [AuthController::class, 'user'])
        ->middleware('throttle:60,1');

    Route::middleware(['auth', 'throttle:120,1'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/weddings', [AdminWeddingController::class, 'index']);
            Route::get('/customers', [AdminCustomerController::class, 'index']);
            Route::get('/customers/{wedding}', [AdminCustomerController::class, 'show']);
            Route::post('/customers', [AdminCustomerController::class, 'store']);
            Route::patch('/customers/{wedding}', [AdminCustomerController::class, 'update']);
            Route::delete('/customers/{wedding}', [AdminCustomerController::class, 'destroy']);
            Route::post('/customers/{wedding}/regenerate-password', [AdminCustomerController::class, 'regeneratePassword']);
        });

        Route::get('/wedding', [WeddingController::class, 'show']);
        Route::patch('/wedding', [WeddingController::class, 'update']);
        Route::put('/wedding/guests', [GuestController::class, 'sync']);
    });
});
