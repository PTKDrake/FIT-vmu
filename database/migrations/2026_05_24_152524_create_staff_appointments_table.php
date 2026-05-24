<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('staff_appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_profile_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('unit_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('position_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['staff_profile_id', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_appointments');
    }
};
