/*
  ﴿ نُورُ الذِّكْر ﴾ — أذكار صحيحة وأدعية مأثورة
  جميع الأذكار من الصحيحين (البخاري ومسلم) والسنن الصحيحة
  ─────────────────────────────────────────────────
  سجل التغييرات (الأحدث أولاً):
  • 2026-10-17 [v1] النسخة المرجعية محفوظة في: _snapshots/v1_2026-10-17_20-41-16
    - بنِيّة الأقسام: زر تبويب لكل قسم (showSection) — يظهر قسماً واحداً فقط
    - كل ذكر ببطاقة مستقلة فيها: شارة عدد المرات، عدّاد المتبقّي، زر [+1]، نسخ، مشاركة
    - عند وصول عدّاد الذكر إلي الصفر: تختفي بطاقته (dissolve) وتُحفظ الحالة في localStorage
    - الإحصاءات: nz_day (إنجاز اليوم) و nz_total (إجمالي مدى الحياة) وتُحدّث مع كل ضغطة
    - المسبحة: عدّاد بهدف (33/99/100/بحسب) + دورة مكتملة (nz_rounds)
  ─────────────────────────────────────────────────
*/

'use strict';

/* ---------- أذكار الصباح ---------- */

const MORNING = [
  {
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ.',
    count: 1,
    ref: 'رواه مسلم',
  },
  {
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.',
    count: 1,
    ref: 'رواه الترمذي، وصححه الألباني',
  },
  {
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
    count: 1,
    ref: 'رواه البخاري — «سيِّد الاستغفار»',
  },
  {
    text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ.',
    count: 3,
    ref: 'رواه أبو داود، وصححه الألباني',
  },
  {
    text: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.',
    count: 7,
    ref: 'حسّنه أبو داود والترمذي، وصححه الألباني',
  },
  {
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    count: 3,
    ref: 'رواه أبو داود والترمذي، وصححه الألباني',
  },
  {
    text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.',
    count: 3,
    ref: 'رواه أبو داود والترمذي، وصححه الألباني',
  },
  {
    text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.',
    count: 1,
    ref: 'رواه الحاكم، وصححه الألباني',
  },
  {
    text: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَكَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.',
    count: 1,
    ref: 'رواه أحمد، وصححه الألباني',
  },
  {
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.',
    count: 100,
    ref: 'رواه مسلم — «من قالها مئة مرة حولت خطاياه ولو كانت مثل زبد البحر»',
  },
  {
    text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    count: 10,
    ref: 'رواه مسلم — «كانت له عدل عشر رقاب»',
  },
  {
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.',
    count: 1,
    ref: 'رواه ابن ماجه، وصححه الألباني — يقال بعد صلاة الفجر',
  },
  {
    text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.',
    count: 100,
    ref: 'متفق عليه — كان النبي ﷺ يستغفر في اليوم مئة مرة',
  },
];

/* ---------- أذكار المساء ---------- */

const EVENING = [
  {
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا.',
    count: 1,
    ref: 'رواه مسلم',
  },
  {
    text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.',
    count: 1,
    ref: 'رواه الترمذي، وصححه الألباني',
  },
  {
    text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ.',
    count: 3,
    ref: 'رواه أبو داود، وصححه الألباني',
  },
  {
    text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
    count: 3,
    ref: 'رواه مسلم — «من قالها حين يمسي فلم تضره تلك الليلة حُمَة»',
  },
  {
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    count: 3,
    ref: 'رواه أبو داود والترمذي، وصححه الألباني',
  },
  {
    text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.',
    count: 3,
    ref: 'رواه أبو داود والترمذي، وصححه الألباني',
  },
  {
    text: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.',
    count: 7,
    ref: 'حسّنه أبو داود والترمذي، وصححه الألباني',
  },
  {
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.',
    count: 100,
    ref: 'رواه مسلم',
  },
  {
    text: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَكَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.',
    count: 1,
    ref: 'رواه أحمد، وصححه الألباني',
  },
  {
    text: 'أَعُوذُ بِاللهِ مِنْ شَرِّ نَفْسِي، أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.',
    count: 1,
    ref: 'رواه الترمذي ودارمي، وصححه الألباني — كانت من دعاء النبي ﷺ عشياً',
  },
  {
    text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.',
    count: 100,
    ref: 'متفق عليه',
  },
];

/* ---------- أذكار النوم ---------- */

const SLEEP = [
  {
    text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.',
    count: 1,
    ref: 'متفق عليه — يقال عند النوم',
  },
  {
    text: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.',
    count: 1,
    ref: 'متفق عليه — «فإن مُتَّ مُتَّ على الفطرة»',
  },
  {
    text: 'يُجَمِّعُ كَفَّيْهِ ثُمَّ يَنْفُثُ فِيهِمَا وَيَقْرَأُ: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾ وَ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾ وَ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ﴾، ثُمَّ يَمْسَحُ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ، يَبْدَأُ بِهِمَا رَأْسَهُ وَوَجْهَهُ وَمَا أَقْبَلَ مِنْ جَسَدِهِ.',
    count: 3,
    ref: 'متفق عليه — أفعل ذلك ثلاث مرات حين أوي إلى فراشي',
  },
  {
    text: 'سُبْحَانَ اللَّهِ (٣٣ مرة)، الْحَمْدُ لِلَّهِ (٣٣ مرة)، اللَّهُ أَكْبَرُ (٣٤ مرة).',
    count: 1,
    ref: 'متفق عليه — كان النبي ﷺ يوصي فاطمة وعليا بهذا عند النوم',
  },
  {
    text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ.',
    count: 1,
    ref: 'رواه مسلم',
  },
  {
    text: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَمَا أَظَلَّتْ، وَرَبَّ الْأَرَضِينَ وَمَا أَقَلَّتْ، وَرَبَّ الشَّيَاطِينِ وَمَا أَضَلَّتْ، كُنْ لِي جَارًا مِنْ شَرِّ خَلْقِكَ كُلِّهِمْ جَمِيعًا.',
    count: 1,
    ref: 'رواه الترمذي وأبو داود، وصححه الألباني',
  },
  {
    text: 'اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ.',
    count: 1,
    ref: 'رواه مسلم (صحيح)',
  },
  {
    text: 'قراءة سورة آمنة الرسول (الآيتان 285 و286 من سورة آل عمران)',
    count: 1,
    ref: 'رواه مسلم — «من قرأهما في ليلة أجزتَه»',
  },
];

/* ---------- الذكر بعد الصلاة ---------- */

const PRAYER = [
  {
    text: 'أَسْتَغْفِرُ اللَّهَ (ثلاثاً)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.',
    count: 1,
    ref: 'رواه مسلم — كان النبي ﷺ إذا سلّم استغفر ثلاثاً ثم قال هذا',
  },
  {
    text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.',
    count: 1,
    ref: 'متفق عليه',
  },
  {
    text: 'سُبْحَانَ اللَّهِ (٣٣)، الْحَمْدُ لِلَّهِ (٣٣)، اللَّهُ أَكْبَرُ (٣٣)، ثم تمام المئة: لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    count: 1,
    ref: 'رواه مسلم — «غفرت خطاياه ولو كانت مثل زبد البحر»',
  },
  {
    text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.',
    count: 1,
    ref: 'رواه أبو داود، وصححه الألباني — دعاء معقّب بعد الصلاة',
  },
  {
    text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    count: 10,
    ref: 'رواه مسلم — عشر مرات بعد كل صلاة، ومئة مرة بعد المغرب خاصة',
  },
  {
    text: 'اللَّهُمَّ لَا تَصْرِفْ قَلْبِي بَعْدَ إِذْ هَدَيْتَنِي، وَهَبْ لِي مِنْ لَدُنْكَ رَحْمَةً، إِنَّكَ أَنْتَ الْوَهَّابُ.',
    count: 1,
    ref: 'رواه الترمذي، وصححه الألباني — يقال مباشرة بعد الصلاة',
  },
];

/* ---------- أدعية مأثورة ---------- */

const DUAS = [
  {
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى.',
    count: 1,
    ref: 'رواه مسلم — من أحب دعاء النبي ﷺ',
  },
  {
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ.',
    count: 1,
    ref: 'رواه البخاري — عن أنس رضي الله عنه كان النبي ﷺ يدعو بها دائماً',
  },
  {
    text: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.',
    count: 1,
    ref: 'رواه الترمذي وصححه الألباني — «ما من رجل مُكْرَه يدعو بها إلا أجابَه الله»',
  },
  {
    text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الْآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ.',
    count: 1,
    ref: 'سورة البقرة 201 — كان أكثر دعاء النبي ﷺ',
  },
  {
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفَجْأَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ.',
    count: 1,
    ref: 'رواه مسلم',
  },
  {
    text: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ.',
    count: 1,
    ref: 'رواه الترمذي، وصححه الألباني',
  },
  {
    text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.',
    count: 1,
    ref: 'رواه أبو داود، وصححه الألباني — أوصى بها النبي ﷺ معاذاً رضي الله عنه',
  },
  {
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ، فَإِنَّهُ لَا يَمْلِكُهَا إِلَّا أَنْتَ.',
    count: 1,
    ref: 'رواه أبو داود، وصححه الألباني',
  },
  {
    text: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، إِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ.',
    count: 1,
    ref: 'رواه الترمذي، وصححه الألباني — من دعاء قنوت وتر',
  },
  {
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.',
    count: 1,
    ref: 'متفق عليه — كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن',
  },
  {
    text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.',
    count: 1,
    ref: 'متفق عليه — الصلاة الإِبراهيمية، من أفضل الصلاة بالنبي ﷺ',
  },
  {
    text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.',
    count: 1,
    ref: 'متفق عليه — كنز من كنوز الجنة، يقال عند البلاء والشدة',
  },
];

const SECTIONS = [
  { id: 'morning', name: 'أذكار الصباح', target: 'cardsMorning', items: MORNING },
  { id: 'evening', name: 'أذكار المساء', target: 'cardsEvening', items: EVENING },
  { id: 'sleep', name: 'أذكار النوم', target: 'cardsSleep', items: SLEEP },
  { id: 'prayer', name: 'الذكر بعد الصلاة', target: 'cardsPrayer', items: PRAYER },
  { id: 'duas', name: 'أدعية مأثورة', target: 'cardsDuas', items: DUAS },
];

/* ========================================================== */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const STORE = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg, gold = false) {
  let el = $('#realToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'realToast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.toggle('gold', gold);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- بناء الأذكار ---------- */

function zikrHTML(item, sectionName, idx) {
  const total = item.count || 1;
  return `
  <article class="card" data-section="${sectionName}" data-idx="${idx}">
    <span class="card-count-badge">عدد المرات المطلوبة: ${total === 1 ? 'مرة واحدة' : `${total} مرات`}</span>
    <p class="card-inner">${item.text}</p>
    ${item.ref ? `<span class="card-reference">— ${item.ref}</span>` : ''}
    <div class="card-remaining">
      <span class="remaining-pill" data-remaining>
        <span class="rem-num" data-num>${total}</span>
        <span class="remaining-label">مرة متبقّية</span>
      </span>
      <button class="card-counter-btn" title="اضغط بعد كل مرّة تنهي فيها الذكر">+1</button>
      <div class="card-actions">
        <button class="card-icon-btn js-copy" title="نسخ الذكر">⧉</button>
        <button class="card-icon-btn js-share" title="مشاركة">↗</button>
      </div>
    </div>
  </article>`;
}

/* تنظيم البطاقات حسب المتبقّي */
function applyRemainder(cardEl, item, completed) {
  const total = item.count || 1;
  const remaining = Math.max(total - completed, 0);
  const numEl = cardEl.querySelector('[data-num]');
  const pill = cardEl.querySelector('[data-remaining]');
  const label = pill.querySelector('.remaining-label');
  if (total === 1) label.textContent = 'مرة متبقّية';
  else label.textContent = 'مرة متبقّية';
  numEl.textContent = remaining;
  pill.classList.toggle('low', remaining > 0 && remaining <= 3);
  return remaining;
}

function render() {
  let totalItems = 0;
  SECTIONS.forEach((sec) => {
    const host = document.getElementById(sec.target);
    if (!host) return;
    host.innerHTML = sec.items.map((it, i) => zikrHTML(it, sec.name, i)).join('');
    const progress = STORE.get('nz_done_' + sec.id, {});
    host.querySelectorAll('.card').forEach((cardEl) => {
      const idx = cardEl.dataset.idx;
      const item = sec.items[+idx];
      const completed = progress[idx] || 0;
      const remaining = applyRemainder(cardEl, item, completed);
      if (remaining <= 0) cardEl.style.display = 'none';
    });
    totalItems += sec.items.length;
  });
  $('#statMorning') && ($('#statMorning').textContent = MORNING.length);
  $('#statEvening') && ($('#statEvening').textContent = EVENING.length);
  $('#statTotal') && ($('#statTotal').textContent = totalItems);
}

/* عدّاد كل ذكر: كل ضغطة = نزول المتبقّي ١، وعند الصفر تختفي البطاقة */
function bindCounters() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-counter-btn');
    if (btn) {
      const card = btn.closest('.card');
      const sectionEl = card.closest('.zikr-section');
      const sectionId = sectionEl.dataset.section;
      const idx = card.dataset.idx;
      const sec = SECTIONS.find((s) => s.id === sectionId);
      const item = sec?.items?.[+idx];
      if (!item) return;
      const total = item.count || 1;
      const key = 'nz_done_' + sectionId;
      const prog = STORE.get(key, {});
      const completed = Math.min((prog[idx] || 0) + 1, total);
      prog[idx] = completed;
      STORE.set(key, prog);
      bumpRepCounter();

      const remaining = applyRemainder(card, item, completed);
      if (remaining <= 0) {
        // اختفاء البطاقة بحنان
        card.classList.add('dissolving');
        setTimeout(() => { card.style.display = 'none'; }, 600);
        toast('أتممتَ الذكر كاملاً — بارك الله فيك ✓', true);
      } else if (remaining <= 3) {
        toast('أوشكتَ على الانتهاء، باقي ' + remaining);
      }
      renderDayProgress();
      return;
    }

    const copyBtn = e.target.closest('.js-copy');
    if (copyBtn) {
      const text = copyBtn.closest('.card').querySelector('.card-inner').innerText;
      copyText(text);
      return;
    }
    const shareBtn = e.target.closest('.js-share');
    if (shareBtn) {
      const text = shareBtn.closest('.card').querySelector('.card-inner').innerText;
      shareZikr(text);
    }
  });
}

/* إعادة كل الأذكار للظهور من جديد */
function bindResetAll() {
  if (!document.getElementById('resetAllBtn')) return;
  $('#resetAllBtn').addEventListener('click', () => {
    SECTIONS.forEach((s) => localStorage.removeItem('nz_done_' + s.id));
    localStorage.removeItem('nz_day');
    localStorage.removeItem('nz_total');
    render();
    renderDayProgress();
    showSection('morning');
    toast('رُجّعت كل الأذكار كما كانت ✓');
  });
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => toast('تمّ نسخ الذكر ✓'),
      () => fallbackCopy(text)
    );
  } else fallbackCopy(text);
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); toast('تمّ نسخ الذكر ✓'); } catch { toast('تعذّر النسخ'); }
  ta.remove();
}

function shareZikr(text) {
  if (navigator.share) {
    navigator.share({ text: text + '\n\n— من موقع «نُور الذِّكْر»' }).catch(() => {});
  } else copyText(text);
}

/* ---------- تقدّم أذكار اليوم والإحصائيات ---------- */

const todayKey = () => new Date().toDateString();

function bumpRepCounter() {
  const day = STORE.get('nz_day', {});
  if (day.date !== todayKey()) { day.date = todayKey(); day.reps = 0; }
  day.reps++;
  STORE.set('nz_day', day);
  const tot = STORE.get('nz_total', 0);
  STORE.set('nz_total', tot + 1);
}

function renderDayProgress() {
  if (!document.getElementById('dpValue')) return;
  const h = new Date().getHours();
  const isMorning = h >= 4 && h < 16;
  const secId = isMorning ? 'morning' : 'evening';
  const sec = SECTIONS.find((s) => s.id === secId);
  const list = sec.items;
  const prog = STORE.get('nz_done_' + secId, {});
  const totalReps = list.reduce((a, it) => a + (it.count || 1), 0);
  const doneReps = list.reduce((a, it, i) => a + Math.min(prog[i] || 0, it.count || 1), 0);
  const pct = totalReps ? Math.round((doneReps / totalReps) * 100) : 0;
  $('#dpValue').textContent = `${doneReps} / ${totalReps}`;
  const fill = $('#dpFill');
  fill.style.width = pct + '%';
  fill.style.minWidth = doneReps > 0 && doneReps < totalReps ? '14px' : '0';
  const hint = $('#dpHint');
  if (pct === 0) hint.textContent = isMorning ? 'ابدأ صباحك بذكر الله، فيه الخيرُ كله.' : 'مساؤك مبارك، ابدأ أذكار المساء الآن.';
  else if (pct === 100) hint.textContent = 'ما شاء الله! أتممتَ أذكار ' + (isMorning ? 'الصباح' : 'المساء') + ' كاملة 🌿';
  else hint.textContent = `أنجزتَ ${doneReps} من ${totalReps} تسبيحة اليوم، واصِلْ الباقي!`;

  // الرقائق
  const day = STORE.get('nz_day', {});
  $('#chipDone').textContent = (day.date === todayKey() ? day.reps : 0);
  const leftAll = ['morning', 'evening'].reduce((acc, id) => {
    const s = SECTIONS.find((x) => x.id === id);
    const p = STORE.get('nz_done_' + id, {});
    return acc + s.items.reduce((a, it, i) => {
      const c = p[i] || 0;
      return a + Math.max((it.count || 1) - c, 0);
    }, 0);
  }, 0);
  $('#chipLeft').textContent = leftAll;
  $('#chipTotal').textContent = STORE.get('nz_total', 0);
}

/* ---------- المسبحة ---------- */

const PHRASES = [
  'سُبْحَانَ اللَّهِ',
  'الْحَمْدُ لِلَّهِ',
  'لَا إِلَٰهَ إِلَّا اللَّهُ',
  'اللَّهُ أَكْبَرُ',
  'أَسْتَغْفِرُ اللَّهَ',
  'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
];

const tasbihState = {
  phrase: STORE.get('nz_phrase', PHRASES[0]),
  count: STORE.get('nz_count', 0),
  target: STORE.get('nz_target', 33),
  rounds: STORE.get('nz_rounds', 0),
};

function renderTasbih() {
  if (!document.getElementById('tasbihPhrase')) return;
  $('#tasbihPhrase').textContent = tasbihState.phrase;
  $('#tasbihCount').textContent = tasbihState.count;
  $('#tasbihRounds').textContent = tasbihState.rounds;
  $$('.phrase-chip').forEach((c) => c.classList.toggle('active', c.dataset.phrase === tasbihState.phrase));
  $$('.target-chip').forEach((c) => c.classList.toggle('active', +c.dataset.target === tasbihState.target));
  updateRing();
}

function updateRing() {
  const ring = $('#tasbihRing');
  const circ = 2 * Math.PI * 54; // ≈ 339.3
  const t = tasbihState.target > 0 ? tasbihState.target : 33;
  const ratio = Math.min(tasbihState.count / t, 1);
  ring.style.strokeDashoffset = circ * (1 - ratio);
}

function tasbihTap() {
  tasbihState.count++;
  let completed = false;
  if (tasbihState.target > 0 && tasbihState.count >= tasbihState.target) {
    tasbihState.rounds++;
    completed = true;
    tasbihState.count = 0;
  } else if (tasbihState.target === 0 && tasbihState.count > 0 && tasbihState.count % 33 === 0) {
    tasbihState.rounds++;
    completed = true;
  }
  STORE.set('nz_phrase', tasbihState.phrase);
  STORE.set('nz_count', tasbihState.count);
  STORE.set('nz_target', tasbihState.target);
  STORE.set('nz_rounds', tasbihState.rounds);
  renderTasbih();
  if (completed) toast('أتممت ٣٣ من «' + tasbihState.phrase + '» ✓', true);
}

function bindTasbih() {
  if (!document.getElementById('tasbihBtn')) return;
  $('#tasbihBtn').addEventListener('click', tasbihTap);
  $('#tasbihReset').addEventListener('click', () => {
    tasbihState.count = 0;
    STORE.set('nz_count', 0);
    renderTasbih();
  });
  $$('.phrase-chip').forEach((c) =>
    c.addEventListener('click', () => {
      tasbihState.phrase = c.dataset.phrase;
      tasbihState.count = 0;
      STORE.set('nz_phrase', tasbihState.phrase);
      STORE.set('nz_count', 0);
      renderTasbih();
    })
  );
  $$('.target-chip').forEach((c) =>
    c.addEventListener('click', () => {
      tasbihState.target = +c.dataset.target;
      STORE.set('nz_target', tasbihState.target);
      renderTasbih();
    })
  );
}

/* ---------- خط / سمة / قائمة ---------- */

function bindUI() {
  // الوضع الليلي
  const themeBtn = $('#themeBtn');
  if (document.body.classList.contains('dark')) themeBtn.textContent = '☀️';
  else themeBtn.textContent = '🌙';
  themeBtn.addEventListener('click', () => {
    const nowDark = document.body.classList.toggle('dark');
    STORE.set('nz_dark', nowDark);
    themeBtn.textContent = nowDark ? '☀️' : '🌙';
  });

  // حجم الخط
  let fontIdx = STORE.get('nz_font', 0);
  const applyFont = () => {
    const scales = [1, 1.12, 1.25, 0.9];
    document.documentElement.style.setProperty('--scale', String(scales[fontIdx]));
  };
  applyFont();
  $('#fontBtn').addEventListener('click', () => {
    fontIdx = (fontIdx + 1) % 4;
    STORE.set('nz_font', fontIdx);
    applyFont();
    toast('حجم الخط: ' + ['عادي', 'كبير', 'أكبر', 'صغير'][fontIdx]);
  });

  // القائمة للجوال
  const nav = $('#mainNav');
  $('#menuBtn').addEventListener('click', () => nav.classList.toggle('open'));
  nav.addEventListener('click', (e) => { if (e.target.matches('a')) nav.classList.remove('open'); });

  // التنقل بين الأقسام
  bindSectionNav();

  // شريط تقدم التمرير والعودة للأعلى
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct = total > 0 ? (scrollY / total) * 100 : 0;
    $('#scrollProgress').style.width = pct + '%';
    $('#toTop').classList.toggle('show', scrollY > 500);
  }, { passive: true });

  $('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- التنقل بين الأقسام ---------- */

const SECTION_DESCS = {
  morning: 'تورد بعد صلاة الفجر حتى طلوع الشمس — يحفظك الله طوال يومك.',
  evening: 'تورد بعد صلاة العصر حتى غروب شمس — حظن اليوم كله بحفظ الله.',
  sleep: 'ما يقال أنتَ إلى فراشك — تنام على حفظ الله وعابت أن تولّي أمرَك إليه.',
  prayer: 'أذكار ثابتة بعد كل صلاة مكتوبة — ذكر باكٍ ثم تسبيح وتحميد.',
  duas: 'أدعية ثابتة في الصحيحين والسنن — لكل شأن: الهم، الكرب، الثبات، والرزق.',
  tasbih: 'سبحة إلكترونية + عدّاد بهدف (33/99/100) يحفظ دوراتك تلقائياً.',
};

function showSection(id, scroll = true) {
  $$('.zikr-section').forEach((s) => s.classList.toggle('active', s.id === id));
  const tab = document.querySelector(`.cat-tab[data-target="${id}"]`);
  if (tab && document.getElementById('catDesc')) {
    $$('.cat-tab').forEach((t) => t.classList.toggle('active', t === tab));
    $('#catDesc').textContent = SECTION_DESCS[id] || '';
  }
  $$('#mainNav .nav-link').forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  history.replaceState(null, '', '#' + id);
  if (scroll) {
    const top = $('#catTop').getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  if (id === 'tasbih') renderTasbih();
}

function bindSectionNav() {
  $$('.cat-tab').forEach((t) =>
    t.addEventListener('click', () => showSection(t.dataset.target))
  );
  $$('#mainNav .nav-link, .hero-cta .btn').forEach((a) => {
    if (!a.getAttribute('href')?.startsWith('#')) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      if (id === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      showSection(id);
    });
  });
}

/* ---------- إقلاع ---------- */

document.addEventListener('DOMContentLoaded', () => {
  if (STORE.get('nz_dark', false)) document.body.classList.add('dark');
  render();
  bindCounters();
  bindResetAll();
  bindTasbih();
  renderTasbih();
  bindUI();
  // تفعيل القسم من العنوان (إن وُجد) وإلا الافتراضي — في الصفحات الفرعية بلا أذكار لا نغيّر شيئاً
  if (SECTIONS.some((s) => document.getElementById(s.target))) {
    const initId = SECTION_DESCS[location.hash.slice(1)] ? location.hash.slice(1) : 'morning';
    showSection(initId, false);
  }
  window.scrollTo(0, 0);
  renderDayProgress();
  setInterval(renderDayProgress, 60 * 1000);
});
