<?php

namespace App\Http\Controllers;

use App\Models\Memory;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TimelineController extends Controller
{
    private array $defaultMemories = [
        [
            'id' => 'mem-1',
            'title' => 'أول يوم التقت فيه عيوننا',
            'date' => '2022-10-14',
            'category' => 'البدايات',
            'location' => 'مقهى الرواق، كورنيش النيل',
            'image_url' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=80',
            'caption' => 'كان يوماً خريفياً دافئاً، جلستِ أمامي بفنجان قهوتكِ وابتسامتكِ الخجولة. في تلك اللحظة بالذات، علمتُ أن حياتي لن تعود كما كانت من قبل أبداً، وأن قدري قد اختار وطنه.',
            'featured' => true,
            'milestone_number' => 1,
        ],
        [
            'id' => 'mem-2',
            'title' => 'خطوتنا الأولى معاً تحت المطر',
            'date' => '2022-12-03',
            'category' => 'موعد غرامي',
            'location' => 'حي الزمالك العتيق',
            'image_url' => 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop&q=80',
            'caption' => 'فاجأنا المطر ونحن في منتصف الطريق. رفضتِ أن نستقل سيارة، ومشينا نضحك تحت مظلة واحدة صغيرة بالكاد تتسع لشخص، نشارك دفء الأيدي وبراءة البدايات.',
            'featured' => false,
            'milestone_number' => 2,
        ],
        [
            'id' => 'mem-3',
            'title' => 'رحلتنا الأولى إلى دهب وسحر النجوم',
            'date' => '2023-04-18',
            'category' => 'رحلة',
            'location' => 'دهب، جنوب سيناء',
            'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
            'caption' => 'أمضينا ليلة كاملة أمام البحر الأحمر نعدّ الشهب الساقطة في سماء سيناء. أخبرتكِ يومها أن أمنيتي تحققت بالفعل حين أصبحتِ أنتِ بجانبي.',
            'featured' => false,
            'milestone_number' => 3,
        ],
        [
            'id' => 'mem-4',
            'title' => 'يوم خطوبتنا وعهد العمر الأبدي',
            'date' => '2023-11-20',
            'category' => 'محطة فارقة',
            'location' => 'حديقة القصر، التجمع الخامس',
            'image_url' => 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&auto=format&fit=crop&q=80',
            'caption' => 'اليوم الذي لبستِ فيه الخاتم أمام كل من نحب. كانت دموع الفرح في عينيكِ أثمن وسام عُلّق على صدري في هذه الحياة.',
            'featured' => true,
            'milestone_number' => 4,
        ],
        [
            'id' => 'mem-5',
            'title' => 'شروق الشمس الأسطوري من قمة جبل موسى',
            'date' => '2024-03-08',
            'category' => 'رحلة',
            'location' => 'سانت كاترين',
            'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
            'caption' => 'تسلقنا الجبل لست ساعات متواصلة في البرد القارس. وعندما لامست أشعة الشمس الذهبية وجهكِ في القمة، أدركت أن أي صعوبة في هذه الدنيا تهون ما دمتِ تمسكين بيدي.',
            'featured' => false,
            'milestone_number' => 5,
        ],
        [
            'id' => 'mem-6',
            'title' => 'عشاؤنا السنوي الهادئ على ضوء الشموع',
            'date' => '2024-10-14',
            'category' => 'احتفال',
            'location' => 'مطعم سيكويا، الزمالك',
            'image_url' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
            'caption' => 'مر عامان كأنهما رمشة عين. جلسنا نسترجع كل ضحكة وكل عثرة تجاوزناها معاً، واحتفلنا بأن حبنا يزداد كل يوم نضجاً وعمقاً وجمالاً.',
            'featured' => false,
            'milestone_number' => 6,
        ],
    ];

    public function index()
    {
        // Ensure settings exist
        $setting = Setting::first();
        if (!$setting) {
            $setting = Setting::create([
                'partner1' => 'محمد',
                'partner2' => 'نور',
                'anniversary_date' => '2022-10-14T19:30:00',
                'hero_title' => 'عالمنا الصغير • لحظات لا تُنسى',
                'hero_subtitle' => 'خط زمني يروي حكاية حبنا، وأيامنا الدافئة، وكل ضحكة نسجناها معاً.',
                'romantic_quote' => '«سأبحث عنكِ في كل حياة، وعبر كل سماء مرصعة بالنجوم.»',
                'quote_author' => 'إلى الأبد ودائماً',
                'admin_pin' => '1204',
                'love_letter_title' => 'إلى شريكة روحي وأجمل ما في هذا الكون،',
                'love_letter_content' => "لو أخبرني أحدهم قبل سنوات أن قلبي سيجد سكينته الكاملة بين تفاصيل ابتسامتكِ، لصدقته في نفس اللحظة التي التقت فيها أعيننا لأول مرة.\n\nكل لحظة على هذا الخط الزمني ليست مجرد صورة التقطت بكاميرا؛ بل هي معجزة صغيرة أهدانا إياها القدر. من فنجان القهوة الأول الذي تحول إلى 4 ساعات من الأحاديث الصادقة، إلى خطواتنا العفوية تحت المطر حين كنا نبتسم كالأطفال دون أي اكتراث للعالم.\n\nشكراً لأنكِ ملاذي الآمن، ومغامرتي الأجمل، والوطن الحقيقي الذي لطالما بحثت عنه. أعدكِ أن أظل بجانبكِ دوماً، نجمع ألوان الغروب معاً، وأحبكِ في كل صباح أكثر من اليوم الذي مضى.\n\nعيد حب وسعادة لقلبكِ يا حبيبتي، وهذه المساحة هي مجرد توثيق لبداية قصة حبنا الأبدية التي ما زلنا نكتبها معاً.",
                'love_letter_signoff' => 'بكل الحب والامتنان، دائماً وأبداً.',
            ]);
        }

        // Ensure default memories exist if database was freshly initialized
        if (Memory::count() === 0 && !request()->has('empty_ok')) {
            foreach ($this->defaultMemories as $mem) {
                Memory::create($mem);
            }
        }

        $memories = Memory::orderBy('date', 'asc')->get();

        return response()->json([
            'success' => true,
            'memories' => $memories,
            'settings' => $setting,
        ]);
    }

    public function storeMemory(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|string',
            'category' => 'nullable|string',
            'location' => 'nullable|string',
            'imageUrl' => 'nullable|string',
            'image_url' => 'nullable|string',
            'caption' => 'required|string',
            'featured' => 'nullable|boolean',
            'milestoneNumber' => 'nullable|integer',
        ]);

        $id = $request->input('id') ?? ('mem-' . time() . '-' . Str::random(4));
        $imageUrl = $request->input('imageUrl') ?? $request->input('image_url') ?? '';

        $memory = Memory::create([
            'id' => $id,
            'title' => $validated['title'],
            'date' => $validated['date'],
            'category' => $validated['category'] ?? 'موعد غرامي',
            'location' => $validated['location'] ?? null,
            'image_url' => $imageUrl,
            'caption' => $validated['caption'],
            'featured' => $request->boolean('featured'),
            'milestone_number' => $request->input('milestoneNumber') ?? (Memory::count() + 1),
        ]);

        return response()->json([
            'success' => true,
            'memory' => $memory,
            'message' => 'تم حفظ الذكرى بنجاح في قاعدة البيانات',
        ], 201);
    }

    public function updateMemory(Request $request, $id)
    {
        $memory = Memory::findOrFail($id);

        $imageUrl = $request->input('imageUrl') ?? $request->input('image_url') ?? $memory->image_url;

        $memory->update([
            'title' => $request->input('title', $memory->title),
            'date' => $request->input('date', $memory->date),
            'category' => $request->input('category', $memory->category),
            'location' => $request->input('location', $memory->location),
            'image_url' => $imageUrl,
            'caption' => $request->input('caption', $memory->caption),
            'featured' => $request->boolean('featured', $memory->featured),
            'milestone_number' => $request->input('milestoneNumber', $memory->milestone_number),
        ]);

        return response()->json([
            'success' => true,
            'memory' => $memory,
            'message' => 'تم تعديل الذكرى بنجاح',
        ]);
    }

    public function destroyMemory($id)
    {
        $memory = Memory::find($id);
        if ($memory) {
            $memory->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الذكرى من قاعدة البيانات',
        ]);
    }

    public function clearAllMemories()
    {
        Memory::truncate();

        return response()->json([
            'success' => true,
            'message' => 'تم مسح جميع الذكريات من قاعدة البيانات',
        ]);
    }

    public function updateSettings(Request $request)
    {
        $setting = Setting::first();
        if (!$setting) {
            $setting = new Setting();
        }

        $data = [];
        if ($request->has('partner1')) $data['partner1'] = $request->input('partner1');
        if ($request->has('partner2')) $data['partner2'] = $request->input('partner2');
        if ($request->has('anniversaryDate')) $data['anniversary_date'] = $request->input('anniversaryDate');
        if ($request->has('heroTitle')) $data['hero_title'] = $request->input('heroTitle');
        if ($request->has('heroSubtitle')) $data['hero_subtitle'] = $request->input('heroSubtitle');
        if ($request->has('romanticQuote')) $data['romantic_quote'] = $request->input('romanticQuote');
        if ($request->has('quoteAuthor')) $data['quote_author'] = $request->input('quoteAuthor');
        if ($request->has('adminPin')) $data['admin_pin'] = $request->input('adminPin');
        if ($request->has('loveLetterTitle')) $data['love_letter_title'] = $request->input('loveLetterTitle');
        if ($request->has('loveLetterContent')) $data['love_letter_content'] = $request->input('loveLetterContent');
        if ($request->has('loveLetterSignoff')) $data['love_letter_signoff'] = $request->input('loveLetterSignoff');

        $setting->fill($data);
        $setting->save();

        return response()->json([
            'success' => true,
            'settings' => $setting,
            'message' => 'تم تحديث إعدادات الشريكين في قاعدة البيانات',
        ]);
    }

    public function resetToDefaults()
    {
        Memory::truncate();
        foreach ($this->defaultMemories as $mem) {
            Memory::create($mem);
        }

        $setting = Setting::first();
        if ($setting) {
            $setting->update([
                'partner1' => 'محمد',
                'partner2' => 'نور',
                'anniversary_date' => '2022-10-14T19:30:00',
                'hero_title' => 'عالمنا الصغير • لحظات لا تُنسى',
                'hero_subtitle' => 'خط زمني يروي حكاية حبنا، وأيامنا الدافئة، وكل ضحكة نسجناها معاً.',
                'romantic_quote' => '«سأبحث عنكِ في كل حياة، وعبر كل سماء مرصعة بالنجوم.»',
                'quote_author' => 'إلى الأبد ودائماً',
                'admin_pin' => '1204',
                'love_letter_title' => 'إلى شريكة روحي وأجمل ما في هذا الكون،',
                'love_letter_content' => "لو أخبرني أحدهم قبل سنوات أن قلبي سيجد سكينته الكاملة بين تفاصيل ابتسامتكِ، لصدقته في نفس اللحظة التي التقت فيها أعيننا لأول مرة.\n\nكل لحظة على هذا الخط الزمني ليست مجرد صورة التقطت بكاميرا؛ بل هي معجزة صغيرة أهدانا إياها القدر. من فنجان القهوة الأول الذي تحول إلى 4 ساعات من الأحاديث الصادقة، إلى خطواتنا العفوية تحت المطر حين كنا نبتسم كالأطفال دون أي اكتراث للعالم.\n\nشكراً لأنكِ ملاذي الآمن، ومغامرتي الأجمل، والوطن الحقيقي الذي لطالما بحثت عنه. أعدكِ أن أظل بجانبكِ دوماً، نجمع ألوان الغروب معاً، وأحبكِ في كل صباح أكثر من اليوم الذي مضى.\n\nعيد حب وسعادة لقلبكِ يا حبيبتي، وهذه المساحة هي مجرد توثيق لبداية قصة حبنا الأبدية التي ما زلنا نكتبها معاً.",
                'love_letter_signoff' => 'بكل الحب والامتنان، دائماً وأبداً.',
            ]);
        }

        return response()->json([
            'success' => true,
            'memories' => Memory::orderBy('date', 'asc')->get(),
            'settings' => $setting,
            'message' => 'تمت استعادة البيانات النموذجية بنجاح',
        ]);
    }
}
