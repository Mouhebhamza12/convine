<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            $table->boolean('paid')->default(false)->after('status');
            $table->timestamp('paid_at')->nullable()->after('paid');
        });

        // Owner-viewable credential. Stored encrypted at rest (APP_KEY), decrypted
        // on read — the admin chose "always-viewable" password recovery.
        Schema::table('users', function (Blueprint $table) {
            $table->text('plain_password')->nullable()->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            $table->dropColumn(['paid', 'paid_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('plain_password');
        });
    }
};
