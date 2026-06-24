<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            // The language the invitation is rendered in, chosen by the couple at
            // creation. One locale per invitation; the guest never toggles it.
            $table->string('locale', 8)->default('en')->after('template_slug');
        });
    }

    public function down(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            $table->dropColumn('locale');
        });
    }
};
