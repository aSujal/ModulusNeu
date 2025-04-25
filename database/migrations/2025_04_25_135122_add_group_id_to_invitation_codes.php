<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invitation_codes', function (Blueprint $table) {
            // Add the group_id column to the invitation_codes table
            $table->unsignedBigInteger('group_id')->after('id');

            // Foreign key constraint to link to the groups table
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitation_codes', function (Blueprint $table) {
            //
            $table->dropForeign(['group_id']);
            $table->dropColumn('group_id');
        });
    }
};
