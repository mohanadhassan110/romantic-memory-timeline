<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'partner1',
        'partner2',
        'anniversary_date',
        'hero_title',
        'hero_subtitle',
        'romantic_quote',
        'quote_author',
        'admin_pin',
        'love_letter_title',
        'love_letter_content',
        'love_letter_signoff',
    ];

    protected $appends = [
        'anniversaryDate',
        'heroTitle',
        'heroSubtitle',
        'romanticQuote',
        'quoteAuthor',
        'adminPin',
        'loveLetterTitle',
        'loveLetterContent',
        'loveLetterSignoff',
    ];

    public function getAnniversaryDateAttribute() { return $this->attributes['anniversary_date'] ?? ''; }
    public function getHeroTitleAttribute() { return $this->attributes['hero_title'] ?? ''; }
    public function getHeroSubtitleAttribute() { return $this->attributes['hero_subtitle'] ?? ''; }
    public function getRomanticQuoteAttribute() { return $this->attributes['romantic_quote'] ?? ''; }
    public function getQuoteAuthorAttribute() { return $this->attributes['quote_author'] ?? ''; }
    public function getAdminPinAttribute() { return $this->attributes['admin_pin'] ?? '1204'; }
    public function getLoveLetterTitleAttribute() { return $this->attributes['love_letter_title'] ?? ''; }
    public function getLoveLetterContentAttribute() { return $this->attributes['love_letter_content'] ?? ''; }
    public function getLoveLetterSignoffAttribute() { return $this->attributes['love_letter_signoff'] ?? ''; }
}
