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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('partner1')->default('محمد');
            $table->string('partner2')->default('نور');
            $table->string('anniversary_date')->default('2022-10-14T19:30:00');
            $table->string('hero_title')->default('عالمنا الصغير • لحظات لا تُنسى');
            $table->text('hero_subtitle')->nullable();
            $table->text('romantic_quote')->nullable();
            $table->string('quote_author')->default('إلى الأبد ودائماً');
            $table->string('admin_pin')->default('1204');
            $table->string('love_letter_title')->default('إلى شريكة روحي وأجمل ما في هذا الكون،');
            $table->longText('love_letter_content')->nullable();
            $table->string('love_letter_signoff')->default('بكل الحب والامتنان، دائماً وأبداً.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
