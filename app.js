/*
  ﴿ نُورُ الذِّكْر ﴾ — منطق التطبيق (v4)
  سجل التغييرات:
  2026-11-02 [v4] إعادة تصميم Tailwind + قائمة جانبية + حسابات مستخدمين محلية (localStorage)
    - كل مستخدم: اسم مستخدم + كلمة سر (مهمة هنا على الجهاز فقط — ليست تشفيراً مصوفاً)
    - لكل حساب: عدّاد الحسنات (+10 لكل تسبيحة)، مجموع التسبيحات، سلاسل الأيام، تقدّم كل قسم
    - لوحة الصدارة: ترتيب الحسابات المحلية على هذا الجهاز حسب الحسنات
  البيانات النصية للأذكار في azkar-data.js (مستخرجة حرفياً)
  ملاحظة: يحافظ على حمايات null-safe حتى تعمل islam.html (legacy) مع نفس الملف
*/

'use strict';

/* ==========================================================
   التخزين المحلي
   ========================================================== */
const STORE = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const HASANAT_PER_REP = 10; // القاعدة العشرية: كل حسنة بعشر أمثالها

/* ==========================================================
   قاعدة البيانات المحلية: المستخدمون
   users = { username: { u, p, created, hasanat, reps, days:{}, done:{section:{idx:count}} } }
   ========================================================== */
const DB = {
  load() { return STORE.get('nz_users', {}); },
  save(users) { STORE.set('nz_users', users); },
  get(u) { return this.load()[u] || null; },
  hash(s) { // بسيط على الجهاز فقط (تلميح: الثقة بالجهاز، لا بالشبكة)
    let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(16);
  },
  register(u, p) {
    const users = this.load();
    if (users[u]) return { ok: false, err: 'اسم المستخدم محجوز، اختر غيره' };
    if (u.length < 3) return { ok: false, err: 'الاسم قصير جداً (٣ أحرف فأكثر)' };
    if (p.length < 4) return { ok: false, err: 'كلمة السر قصيرة (٤ خانات فأكثر)' };
    users[u] = { u, p: this.hash(p), created: todayKey(), hasanat: 0, reps: 0, days: {}, done: {} };
    this.save(users);
    return { ok: true };
  },
  login(u, p) {
    const users = this.load();
    const user = users[u];
    if (!user) return { ok: false, err: 'لا يوجد حساب بهذا الاسم' };
    if (user.p !== this.hash(p)) return { ok: false, err: 'كلمة السر غير صحيحة' };
    user.reps = user.reps || 0; user.hasanat = user.hasanat || 0;
    // ترحيل التقدّم القديم (قبل الحسابات) إن وُجد وخانة القسم فارغة
    SECTIONS.forEach((s) => {
      const legacy = STORE.get('nz_done_' + s.id, null);
      if (legacy && Object.keys(user.done[s.id] || {}).length === 0) {
        user.done[s.id] = legacy;
        const tot = Object.values(legacy).reduce((a, c) => a + (c || 0), 0);
        user.reps += tot; user.hasanat += tot * HASANAT_PER_REP;
      }
    });
    this.save(users);
    return { ok: true };
  },
  // إضافة تسبيحة للحساب الحالي
  addRep(user, sectionId, idx) {
    const users = this.load(); const u = users[user]; if (!u) return;
    u.reps = (u.reps || 0) + 1;
    u.hasanat = (u.hasanat || 0) + HASANAT_PER_REP;
    u.days = u.days || {}; u.days[todayKey()] = (u.days[todayKey()] || 0) + 1;
    u.done = u.done || {}; const s = u.done[sectionId] || (u.done[sectionId] = {});
    s[idx] = (s[idx] || 0) + 1;
    users[user] = u; this.save(users);
  },
};

const Auth = {
  current() { return STORE.get('nz_current', null); },
  login(u) { STORE.set('nz_current', u); },
  logout() { STORE.del('nz_current'); },
  me() { const u = this.current(); return u ? DB.get(u) : null; },
};

/* ==========================================================
   أدوات مساعدة
   ========================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let toastTimer = null;
function toast(msg, gold = false) {
  let el = $('#nzToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'nzToast';
    el.className = 'fixed bottom-6 right-1/2 translate-x-1/2 z-[500] rounded-full px-6 py-2.5 text-sm font-bold text-white bg-emerald-900 shadow-lg shadow-emerald-900/30';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.toggle('!bg-amber-400', gold);
  el.classList.toggle('!text-emerald-950', gold);
  el.style.animation = 'toastIn .3s ease';
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2400);
}

/* ==========================================================
   بناء بطاقات الأذكار
   ========================================================== */
function zikrHTML(item, sectionId, idx) {
  const total = item.count || 1;
  return `
  <article class="card-item card-in rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5 relative overflow-hidden" data-section="${sectionId}" data-idx="${idx}" style="animation-delay:${idx * 60}ms">
    <span class="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-amber-300 to-emerald-600"></span>
    <span class="inline-block text-[11px] font-bold text-emerald-700 dark:text-amber-300 bg-emerald-50 dark:bg-emerald-900/70 rounded-full px-3 py-1 mb-3">عدد المرات المطلوبة: ${total === 1 ? 'مرة واحدة' : `${total} مرات`}</span>
    <p class="font-quran text-xl leading-loose text-stone-800 dark:text-stone-100 mb-3">${item.text}</p>
    ${item.ref ? `<span class="text-xs text-stone-500 dark:text-stone-400">— ${item.ref}</span>` : ''}
    <div class="mt-4 flex items-center gap-3 flex-wrap">
      <span class="rem-pill inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 bg-amber-50 dark:bg-amber-400/10 border border-amber-200/70 dark:border-amber-400/30" data-remaining>
        <b class="rem-num font-head text-lg text-amber-600 dark:text-amber-300 min-w-[2ch] text-center" data-num>${total}</b>
        <span class="text-[11px] font-semibold text-stone-500 dark:text-stone-400">مرة متبقّية</span>
      </span>
      <button class="card-counter-btn bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-xl px-5 py-2 text-sm font-bold transition-all shadow-sm shadow-emerald-700/30 inline-flex items-center gap-1" title="اضغط بعد كل مرّة">+1</button>
      <div class="ms-auto flex gap-1.5">
        <button class="card-icon-btn js-copy w-9 h-9 rounded-xl border border-emerald-100 dark:border-emerald-800 text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors" title="نسخ الذكر">⧉</button>
        <button class="card-icon-btn js-share w-9 h-9 rounded-xl border border-emerald-100 dark:border-emerald-800 text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors" title="مشاركة">↗</button>
      </div>
    </div>
  </article>`;
}

function applyRemainder(cardEl, item, completed) {
  const total = item.count || 1;
  const remaining = Math.max(total - completed, 0);
  const numEl = cardEl.querySelector('[data-num]');
  const pill = cardEl.querySelector('[data-remaining]');
  if (!numEl || !pill) return remaining;
  numEl.textContent = remaining;
  numEl.classList.remove('pop-num'); void numEl.offsetWidth; numEl.classList.add('pop-num');
  pill.classList.toggle('!border-amber-400', remaining > 0 && remaining <= 3);
  return remaining;
}

function render() {
  const user = Auth.me();
  SECTIONS.forEach((sec) => {
    const host = document.getElementById(sec.target);
    if (!host) return;
    const prog = (user && user.done[sec.id]) || {};
    host.innerHTML = sec.items
      .map((it, i) => {
        // الأذكار المكتملة تحت ٠ تُخفى مباشرة عند الرسم
        const done = (prog[i] || 0) >= (it.count || 1);
        return done ? '' : zikrHTML(it, sec.id, i);
      })
      .join('');
  });
  updateCountsBadges();
}

function updateCountsBadges() {
  const user = Auth.me();
  SECTIONS.forEach((sec) => {
    const cnt = document.getElementById('count' + sec.target.slice(5));
    if (!cnt) return;
    const prog = (user && user.done[sec.id]) || {};
    const doneItems = sec.items.filter((it, i) => (prog[i] || 0) >= (it.count || 1)).length;
    cnt.textContent = `${doneItems}/${sec.items.length}`;
  });
}

function bindCounters() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-counter-btn');
    if (btn) {
      const card = btn.closest('.card-item');
      const sectionId = card.dataset.section;
      const idx = card.dataset.idx;
      const sec = SECTIONS.find((s) => s.id === sectionId);
      const item = sec?.items?.[+idx];
      if (!item) return;
      const total = item.count || 1;

      const me = Auth.me();
      if (!me) {
        toast('سجّل دخولك أولاً ليُحسب لك إنجازك ✨');
        openView('profile');
        return;
      }
      const completedTotal = Math.min((me.done[sectionId]?.[idx] || 0) + 1, total);
      DB.addRep(Auth.current(), sectionId, idx);

      const after = DB.get(Auth.current());
      const nowCount = (after.done[sectionId] || {})[idx] || 0;
      const remaining = applyRemainder(card, item, Math.min(nowCount, total));
      if (remaining <= 0) {
        card.classList.add('celebrate', 'dissolve');
        setTimeout(() => { card.style.display = 'none'; }, 600);
        toast('أتممتَ الذكر كاملاً — بارك الله فيك 🌟', true);
      }
      updateCountsBadges();
      refreshUserUI({ cards: false });
      return;
    }
    const copyBtn = e.target.closest('.js-copy');
    if (copyBtn) { copyText(copyBtn.closest('.card-item').querySelector('.font-quran, .card-inner').innerText); return; }
    const shareBtn = e.target.closest('.js-share');
    if (shareBtn) { shareZikr(shareBtn.closest('.card-item').querySelector('.font-quran, .card-inner').innerText); }
  });
}

function copyText(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast('تمّ النسخ ✓'), () => fallbackCopy(text));
  else fallbackCopy(text);
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast('تمّ النسخ ✓'); } catch { toast('تعذّر النسخ'); }
  ta.remove();
}
function shareZikr(text) {
  if (navigator.share) navigator.share({ text: text + '\n\n— من موقع «نُور الذِّكْر»' }).catch(() => {});
  else copyText(text);
}

/* ==========================================================
   لوحة الحساب + الحسنات + الصدارة
   ========================================================== */
function streak(user) {
  if (!user.days) return 0;
  let n = 0; const d = new Date();
  while (user.days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function refreshUserUI(opts = {}) {
  const user = Auth.me();
  const chip = $('#userChip');
  if (!chip) return;
  if (user) {
    chip.innerHTML = `
      <div class="flex items-center gap-3 rounded-2xl bg-emerald-800/60 border border-white/10 p-3">
        <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-emerald-950 font-head font-bold grid place-items-center text-lg shrink-0">${user.u[0]}</span>
        <div class="min-w-0">
          <div class="text-sm font-bold text-amber-100 truncate">${user.u}</div>
          <div class="text-[11px] text-emerald-200/80">💰 الحسنات: <b class="text-amber-300">${user.hasanat || 0}</b></div>
        </div>
      </div>`;
    $('#dashUserHint')?.classList.add('hidden');
  } else {
    chip.innerHTML = `
      <button onclick="openView('profile')" class="w-full flex items-center gap-3 rounded-2xl bg-white/5 border border-dashed border-white/20 p-3 hover:bg-white/10 transition-colors">
        <span class="w-10 h-10 rounded-xl bg-white/10 grid place-items-center text-xl">👤</span>
        <div class="text-right">
          <div class="text-sm font-bold text-white">زائر</div>
          <div class="text-[11px] text-emerald-200/70">سجّل دخولك ليُحسب إنجازك</div>
        </div>
      </button>`;
    $('#dashUserHint')?.classList.remove('hidden');
  }
  renderDashboard();
  renderLeaderboard();
  if (opts.cards !== false) render(); // إعادة رسم البطاقات بعدّادات المستخدم
  renderProfile();
}

function renderDashboard() {
  const user = Auth.me();
  if (!document.getElementById('dashHan')) return;
  const han = user?.hasanat || 0;
  const today = user?.days?.[todayKey()] || 0;
  $('#dashHan').textContent = han;
  $('#dashToday').textContent = today;
  $('#dashStreak').textContent = streak(user || {});
  const totalDone = user ? SECTIONS.reduce((a, s) => a + s.items.filter((it, i) => ((user.done[s.id] || {})[i] || 0) >= (it.count || 1)).length, 0) : 0;
  $('#dashDone').textContent = totalDone;

  // مخطط الأسبوع
  const bars = $('#weekBars');
  if (bars) {
    const names = ['س', 'أ', 'ن', 'ث', 'ر', 'خ', 'ج'];
    const d = new Date(); const dows = [6, 0, 1, 2, 3, 4, 5];
    bars.innerHTML = '';
    const max = Math.max(1, ...dows.map((_, k) => { const dd = new Date(); dd.setDate(d.getDate() - k); return user?.days?.[dd.toISOString().slice(0, 10)] || 0; }));
    dows.forEach((_, k) => {
      const dd = new Date(); dd.setDate(d.getDate() - k);
      const v = user?.days?.[dd.toISOString().slice(0, 10)] || 0;
      const el = document.createElement('div');
      el.className = 'flex flex-col items-center gap-1 flex-1';
      el.innerHTML = `
        <div class="w-full h-24 rounded-t-lg bg-emerald-100 dark:bg-emerald-900/50 grid place-items-end overflow-hidden">
          <div class="w-full bg-gradient-to-t from-emerald-600 to-amber-400 rounded-t-lg transition-all duration-700" style="height:${(v / max) * 100}%"></div>
        </div>
        <span class="text-[10px] text-stone-500 dark:text-stone-400">${names[(dd.getDay() + 6) % 7]}</span>`;
      bars.appendChild(el);
    });
  }
}

function renderLeaderboard() {
  const host = $('#boardBody'); if (!host) return;
  const users = Object.values(DB.load()).sort((a, b) => (b.hasanat || 0) - (a.hasanat || 0));
  const medals = ['🥇', '🥈', '🥉'];
  host.innerHTML = users.length === 0
    ? `<div class="py-10 text-center text-stone-500 dark:text-stone-400 text-sm">لا توجد حسابات بعد — أنشئ حسابك لتكون الأوّل 🌟</div>`
    : users.map((u, i) => `
      <tr class="border-b border-emerald-100/60 dark:border-emerald-800/40 last:border-0 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/30 transition-colors ${Auth.current() === u.u ? '!bg-amber-50 dark:!bg-amber-400/10' : ''}">
        <td class="py-3 px-4 font-bold text-sm">${medals[i] || `<span class="text-stone-400">${i + 1}</span>`}</td>
        <td class="py-3 px-4 font-bold">${u.u}${Auth.current() === u.u ? ' <span class="text-[10px] bg-emerald-600 text-white rounded px-1.5 py-0.5">أنت</span>' : ''}</td>
        <td class="py-3 px-4 text-emerald-700 dark:text-amber-300 font-head font-bold">${u.hasanat || 0}</td>
        <td class="py-3 px-4 text-stone-500 dark:text-stone-400 text-sm">${u.reps || 0}</td>
        <td class="py-3 px-4 text-stone-500 dark:text-stone-400 text-sm">${streak(u)} ${streak(u) ? '🔥' : ''}</td>
      </tr>`).join('');
}

function renderProfile() {
  const host = $('#profileBody'); if (!host) return;
  const user = Auth.me();
  if (!user) {
    host.innerHTML = `
      <div class="max-w-md mx-auto card-in">
        <div class="rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 shadow-md p-8 text-center">
          <div class="text-5xl mb-3">🔐</div>
          <h3 class="font-head text-xl font-bold mb-1">حسابك المحلي</h3>
          <p class="text-sm text-stone-500 dark:text-stone-400 mb-6">أنشئ حساباً أو سجّل دخولك — تُحفظ بياناتك في جهازك فقط (localStorage)، لا تُرسل لأي خادم.</p>
          <div id="authErr" class="hidden mb-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/30 rounded-xl px-3 py-2"></div>
          <input id="inUser" placeholder="اسم المستخدم" class="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900/40 px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 ring-amber-300 transition" />
          <input id="inPass" type="password" placeholder="كلمة السر" class="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900/40 px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 ring-amber-300 transition" />
          <div class="flex gap-2 mb-4">
            <button id="btnLogin" class="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl py-3 text-sm font-bold transition-colors">دخول</button>
            <button id="btnRegister" class="flex-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl py-3 text-sm font-bold transition-colors">حساب جديد</button>
          </div>
          <p class="text-[11px] text-stone-400">⚙️ الحساب مخصص لوحدة هذا الجهاز — استخدم أسماء مختلفة لكل فرد من أسرتك ثم قارنوا في «الصدارة».</p>
        </div>
      </div>`;
    bindAuthForm();
  } else {
    const per = SECTIONS.map((s) => {
      const done = s.items.filter((it, i) => ((user.done[s.id] || {})[i] || 0) >= (it.count || 1)).length;
      return { name: s.name, done, total: s.items.length };
    });
    host.innerHTML = `
      <div class="max-w-lg mx-auto card-in">
        <div class="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-700 pattern-dots text-white shadow-lg p-8 text-center mb-6">
          <span class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-300 to-amber-500 grid place-items-center font-head text-4xl font-bold text-emerald-950 shadow-lg mb-3">${user.u[0]}</span>
          <h3 class="font-head text-2xl font-bold">${user.u}</h3>
          <p class="text-emerald-200/80 text-xs mt-1">عضو منذ ${user.created}</p>
          <div class="grid grid-cols-3 gap-3 mt-6">
            <div class="rounded-2xl bg-white/10 p-3"><div class="font-head text-2xl font-bold text-amber-300">${user.hasanat}</div><small class="text-emerald-200/80">حسنات</small></div>
            <div class="rounded-2xl bg-white/10 p-3"><div class="font-head text-2xl font-bold text-amber-300">${user.reps}</div><small class="text-emerald-200/80">تسبيحة</small></div>
            <div class="rounded-2xl bg-white/10 p-3"><div class="font-head text-2xl font-bold text-amber-300">${streak(user)}</div><small class="text-emerald-200/80">يوم متتابع</small></div>
          </div>
          <button id="btnLogout" class="mt-6 w-full rounded-xl bg-white/10 hover:bg-rose-500/80 border border-white/20 py-3 text-sm font-bold transition-colors">تسجيل الخروج ↩</button>
        </div>
        <div class="rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 shadow-sm p-6">
          <h4 class="font-head font-bold mb-4">🎯 إنجاز الأقسام</h4>
          ${per.map((p) => `
            <div class="mb-4 last:mb-0">
              <div class="flex justify-between text-xs font-bold mb-1"><span>${p.name}</span><span class="text-emerald-600 dark:text-amber-300">${p.done}/${p.total}</span></div>
              <div class="h-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-l from-amber-400 to-emerald-600 transition-all duration-1000" style="width:${(p.done / p.total) * 100}%"></div></div>
            </div>`).join('')}
        </div>
      </div>`;
    $('#btnLogout').addEventListener('click', () => { Auth.logout(); refreshUserUI(); toast('تمّ الخروج — في أمان الله'); });
  }
}

function bindAuthForm() {
  const showErr = (m) => { const e = $('#authErr'); e.textContent = m; e.classList.remove('hidden'); };
  $('#btnLogin').addEventListener('click', () => {
    const u = $('#inUser').value.trim(), p = $('#inPass').value;
    const r = DB.login(u, p);
    if (!r.ok) return showErr(r.err);
    Auth.login(u); refreshUserUI(); openView('dashboard');
    toast(`أهلاً بعودتك يا ${u} 🌟`, true);
  });
  $('#btnRegister').addEventListener('click', () => {
    const u = $('#inUser').value.trim(), p = $('#inPass').value;
    const r = DB.register(u, p);
    if (!r.ok) return showErr(r.err);
    DB.login(u, p); Auth.login(u); refreshUserUI(); openView('dashboard');
    toast(`أنشأنا حسابك يا ${u} — يمكنك التسبيح الآن!`, true);
  });
}

/* ==========================================================
   المسبحة
   ========================================================== */
const PHRASES = ['سُبْحَانَ اللَّهِ', 'الْحَمْدُ لِلَّهِ', 'لَا إِلَٰهَ إِلَّا اللَّهُ', 'اللَّهُ أَكْبَرُ', 'أَسْتَغْفِرُ اللَّهَ', 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ'];
const tasbihState = { phrase: STORE.get('nz_phrase', PHRASES[0]), count: STORE.get('nz_count', 0), target: STORE.get('nz_target', 33), rounds: STORE.get('nz_rounds', 0) };

function renderTasbih() {
  if (!document.getElementById('tasbihPhrase')) return;
  $('#tasbihPhrase').textContent = tasbihState.phrase;
  $('#tasbihCount').textContent = tasbihState.count;
  $('#tasbihRounds').textContent = tasbihState.rounds;
  // شرائح جمل التسبيح
  const row = $('#phraseRow');
  if (row) {
    row.innerHTML = PHRASES.map((p) => `
      <button class="phrase-chip rounded-xl px-3.5 py-1.5 text-sm font-bold border transition-all duration-200
        ${p === tasbihState.phrase
          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm scale-105'
          : 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 text-emerald-800 dark:text-emerald-200'}"
        data-phrase="${p}">${p}</button>`).join('');
  }
  $$('.target-chip').forEach((c) => {
    const on = +c.dataset.target === tasbihState.target;
    c.classList.toggle('!bg-emerald-700', on);
    c.classList.toggle('!text-white', on);
    c.classList.toggle('!border-emerald-700', on);
    c.classList.toggle('scale-105', on);
  });
  updateRing();
}
function updateRing() {
  const ring = document.getElementById('tasbihRing'); if (!ring) return;
  const t = tasbihState.target > 0 ? tasbihState.target : 33;
  ring.style.strokeDashoffset = 339.3 * (1 - Math.min(tasbihState.count / t, 1));
}
function tasbihTap() {
  tasbihState.count++;
  let done = false;
  if (tasbihState.target > 0 && tasbihState.count >= tasbihState.target) { tasbihState.rounds++; done = true; tasbihState.count = 0; }
  else if (tasbihState.target === 0 && tasbihState.count > 0 && tasbihState.count % 33 === 0) { tasbihState.rounds++; done = true; }
  const me = Auth.me();
  if (me) {
    const users = DB.load(); const u = users[Auth.current()];
    u.reps++; u.hasanat += HASANAT_PER_REP; u.days = u.days || {};
    u.days[todayKey()] = (u.days[todayKey()] || 0) + 1;
    DB.save(users);
  }
  STORE.set('nz_phrase', tasbihState.phrase); STORE.set('nz_count', tasbihState.count);
  STORE.set('nz_target', tasbihState.target); STORE.set('nz_rounds', tasbihState.rounds);
  renderTasbih(); refreshUserUI({ cards: false });
  if (done) toast(`أتممت دورة «${tasbihState.phrase}» — بارك الله فيك`, true);
}
function bindTasbih() {
  if (!document.getElementById('tasbihBtn')) return;
  $('#tasbihBtn').addEventListener('click', tasbihTap);
  $('#tasbihReset').addEventListener('click', () => { tasbihState.count = 0; STORE.set('nz_count', 0); renderTasbih(); });
  $('#phraseRow')?.addEventListener('click', (e) => {
    const c = e.target.closest('.phrase-chip'); if (!c) return;
    tasbihState.phrase = c.dataset.phrase; tasbihState.count = 0;
    STORE.set('nz_phrase', c.dataset.phrase); STORE.set('nz_count', 0); renderTasbih();
  });
  $$('.target-chip').forEach((c) => c.addEventListener('click', () => {
    tasbihState.target = +c.dataset.target; STORE.set('nz_target', tasbihState.target); renderTasbih();
  }));
}

/* ==========================================================
   التنقل (القائمة الجانبية)
   ========================================================== */
const VIEW_TITLES = {
  dashboard: 'لوحة إنجازك', morning: 'أذكار الصباح', evening: 'أذكار المساء', sleep: 'أذكار النوم',
  prayer: 'الذكر بعد الصلاة', duas: 'أدعية مأثورة', tasbih: 'المسبحة الإلكترونية',
  leaderboard: 'لوحة الصدارة', profile: 'حسابي',
};

function openView(id, scroll = true) {
  $$('.view-sec').forEach((s) => s.classList.toggle('hidden', s.id !== 'view-' + id));
  const v = $('#view-' + id);
  if (v) { v.classList.remove('view-in'); void v.offsetWidth; v.classList.add('view-in'); }
  $$('.side-link').forEach((l) => {
    const on = l.dataset.view === id;
    l.classList.toggle('bg-white/15', on);
    l.classList.toggle('text-amber-300', on);
    l.classList.toggle('border-amber-300/40', on);
  });
  $('#pageTitle') && ($('#pageTitle').textContent = VIEW_TITLES[id] || '');
  if (id === 'tasbih') renderTasbih();
  if (id === 'leaderboard') renderLeaderboard();
  if (id === 'profile') renderProfile();
  history.replaceState(null, '', '#' + id);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  // إغلاق القائمة على الجوال
  if (typeof closeSidebar === 'function') closeSidebar();
}

function bindNav() {
  $$('.side-link').forEach((l) => l.addEventListener('click', (e) => { e.preventDefault(); openView(l.dataset.view); }));
  $$('.js-goto').forEach((b) => b.addEventListener('click', () => openView(b.dataset.view)));
  const drawer = $('#sidebar'), backdrop = $('#sideBackdrop');
  const open = () => { drawer.classList.remove('translate-x-full'); backdrop.classList.remove('hidden'); document.body.classList.add('overflow-hidden'); };
  window.closeSidebar = () => { if (innerWidth < 1024) { drawer.classList.add('translate-x-full'); backdrop.classList.add('hidden'); document.body.classList.remove('overflow-hidden'); } };
  $('#menuBtn')?.addEventListener('click', open);
  $('#sideClose')?.addEventListener('click', () => { drawer.classList.add('translate-x-full'); backdrop.classList.add('hidden'); document.body.classList.remove('overflow-hidden'); });
  backdrop?.addEventListener('click', () => { drawer.classList.add('translate-x-full'); backdrop.classList.add('hidden'); document.body.classList.remove('overflow-hidden'); });
  window.addEventListener('scroll', () => {
    $('#toTop')?.classList.toggle('show', scrollY > 500);
  }, { passive: true });
  $('#toTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- خط / سمة ---------- */
function bindUI() {
  // السمة الليلية (html.dark + body.dark للتوافق مع الصفحة القديمة islam.html)
  const applyDark = (dark) => {
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
  };
  applyDark(STORE.get('nz_dark', true)); // الوضع الليلي هو الافتراضي للهوية
  const themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    themeBtn.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('dark');
      applyDark(dark);
      STORE.set('nz_dark', dark);
      themeBtn.textContent = dark ? '☀️' : '🌙';
    });
  }
  let fontIdx = STORE.get('nz_font', 0);
  const applyFont = () => document.documentElement.style.setProperty('--scale', ['1', '1.12', '1.25', '0.9'][fontIdx]);
  applyFont();
  $('#fontBtn')?.addEventListener('click', () => { fontIdx = (fontIdx + 1) % 4; STORE.set('nz_font', fontIdx); applyFont(); toast('حجم الخط: ' + ['عادي', 'كبير', 'أكبر', 'صغير'][fontIdx]); });
}

/* ---------- إقلاع ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const dark = STORE.get('nz_dark', true);
  document.documentElement.classList.toggle('dark', dark);
  document.body.classList.toggle('dark', dark);
  render();
  bindCounters();
  bindTasbih();
  renderTasbih();
  bindNav();
  bindUI();
  refreshUserUI();
  openView(VIEW_TITLES[location.hash.slice(1)] ? location.hash.slice(1) : 'dashboard', false);
  // تحديث الحسنات كل دقيقة (لتغيير اليوم)
  setInterval(renderDashboard, 60 * 1000);
});
