<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Security hardening: stop persisting a recoverable copy of customer passwords.
 * Passwords are now shown once at creation/regeneration and only the bcrypt
 * hash is stored, so a leaked APP_KEY can no longer expose customer logins.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'plain_password')) {
                $table->dropColumn('plain_password');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'plain_password')) {
                $table->text('plain_password')->nullable();
            }
        });
    }
};
