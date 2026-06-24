<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            // The set of languages the couple offers their guests (subset of the
            // template's supported locales). `locale` stays the primary/default.
            $table->json('locales')->nullable()->after('locale');
            // The couple's personal message, authored per offered language:
            // { "en": "...", "fr": "...", "ar": "..." }. The plain `message`
            // column is kept in sync with the primary language for back-compat.
            $table->json('messages')->nullable()->after('message');
        });
    }

    public function down(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            $table->dropColumn(['locales', 'messages']);
        });
    }
};
