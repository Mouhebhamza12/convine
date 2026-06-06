<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'message' => 'Convive API',
    'frontend' => 'http://localhost:3000',
]));
