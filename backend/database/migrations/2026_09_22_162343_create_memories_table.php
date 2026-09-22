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
        Schema::create('memories', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('date');
            $table->string('category')->default('موعد غرامي');
            $table->string('location')->nullable();
            $table->longText('image_url');
            $table->text('caption');
            $table->boolean('featured')->default(false);
            $table->integer('milestone_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memories');
    }
};
