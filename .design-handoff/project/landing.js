// ═══════════════════════════════════════════
// INGLÉS HOTELERO · LANDING · interactions
// ═══════════════════════════════════════════

// ─── i18n ─────────────────────────────────
const I18N = {
  en: {
    'nav.method': 'Method', 'nav.features': 'Platform', 'nav.dashboard': 'For managers',
    'nav.pricing': 'Pricing', 'nav.faq': 'FAQ', 'nav.cta': 'Request a free pilot',
    'hero.kicker': 'English for hospitality · B1 guaranteed',
    'hero.h1': 'The English your team <em>uses on shift</em>, not the one they forget in class.',
    'hero.sub': '3-minute micro-lessons per role — front desk, housekeeping, bar, restaurant — with real assessment and a dashboard for HR. No long courses, no manuals, no PowerPoints nobody finishes.',
    'hero.cta1': 'Request a free pilot', 'hero.cta2': 'Get a quote in 24h',
    'hero.m1': 'per lesson, on shift', 'hero.m2': 'roles covered by default', 'hero.m3': 'CEFR in 90 days',
    'bp.from': 'Starting level', 'bp.to': 'Destination · 90 days',
    'bp.l1': 'TEAM', 'bp.l2': 'SHIFT', 'bp.l3': 'COST',
    'stamp1.t': 'Approved', 'stamp1.s': 'Free pilot', 'stamp1.d': 'APR · 2026',
    'bag.role': 'ROLE', 'bag.hotel': 'HOTEL', 'bag.level': 'LEVEL',
    'trust.label': 'Teams training at 4 and 5-star hotels across Mexico',
    'p.eye': 'The Observation · <em>Traditional course</em>',
    'p.h': 'Your team doesn\'t need to know what the <em>present perfect</em> is. They need to know how to apologize for the AC at 2:14 AM.',
    'p.cap': 'Overheard in the HR office',
    'p.q': '"We paid three months of in-person classes. Employees passed the test. And they still freeze in front of a guest asking for a hypoallergenic pillow."',
    'p.attr': '— HR Management · Hotel in Riviera Maya · January 2026',
    'm.eye': 'The Method · <em>4 stages</em>', 'm.sub': 'A journey, not a course',
    'm.h': 'How English moves from classroom to shift — in <em>four movements</em>.',
    'm.lede': 'Every employee walks the same path: diagnostic, daily drill, assessment, real use with guests. No 7am group classes.',
    'm.s1.k': 'Diagnostic', 'm.s1.t': '12 minutes to see where each person stands.',
    'm.s1.p': 'Not a boring test — a role-play: "Handle this guest." We assess pronunciation, operational vocabulary and confidence.',
    'm.s2.k': 'Daily drill', 'm.s2.t': '3 minutes a day, per role, on WhatsApp.',
    'm.s2.p': '"Answer this complaint." "Do the check-in." "Explain the menu." Audio, text, or both. In pocket, on shift, no classroom.',
    'm.s3.k': 'Assessment', 'm.s3.t': 'CEFR-aligned exam, every 30 days.',
    'm.s3.p': 'Certified B1 with a rubric reviewed by human evaluators. Not self-assessment. Clear report for HR and manager.',
    'm.s4.k': 'Passport', 'm.s4.t': 'Employees collect stamps. Managers measure outcomes.',
    'm.s4.p': 'Every achievement — 7-day streak, level up, completed unit — gets stamped. Good for retention, good for performance reviews.',
    'f.eye': 'The Platform · <em>What\'s in the box</em>', 'f.sub': 'iOS · Android · Web · WhatsApp',
    'f.h': 'Four surfaces. One system. <em>Zero friction</em> to adopt.',
    'f.1.k': '01 · Daily drills',
    'f.1.t': 'Micro-lessons that arrive on WhatsApp — because that\'s where they already are.',
    'f.1.p': '3 minutes. A real shift scenario. Audio reply. Instant feedback. No need to install another app nobody opens.',
    'f.2.k': '02 · Passport', 'f.2.t': 'Every employee collects stamps.',
    'f.2.p': 'Retention and pride without cheesy gamification. The stamps are real: they certify levels, streaks, completed units.',
    'f.3.k': '03 · CEFR exam', 'f.3.t': 'The exam feels like a journey, not a school test.',
    'f.3.p': 'Boarding pass with the destination clear. Scenarios from the employee\'s role. Human review. Exportable certificate.',
    'f.4.k': '04 · Role-specific content', 'f.4.t': '12 roles. Real vocabulary. None of "the book is on the table".',
    'f.4.p': 'Front desk, housekeeping, bar, restaurant, concierge, bellhop, spa, pool, banquets, security, maintenance, valet. Each with its own curriculum.',
    'd.eye': '04 · The dashboard · For HR and managers',
    'd.h': 'One sheet. Your whole team. <em>No reports at 8 PM.</em>',
    'd.p': 'Managers see who leveled up, who stopped studying, who has an exam this week. Monthly PDF reports ready for the corporate office.',
    'd.b1.t': 'Progress by employee, shift, and hotel.',
    'd.b1.s': 'Filters by management, tenure, role. Exportable.',
    'd.b2.t': 'Alerts when someone is at risk.',
    'd.b2.s': 'Employee without drill for 5 days → notification to their manager. Not to HR a week later.',
    'd.b3.t': 'ROI reports.',
    'd.b3.s': 'Cost per certified employee. Correlation with turnover. Impact on guest reviews.',
    'tt.eye': 'The evidence · <em>Postcards from managers</em>', 'tt.sub': 'Click to see the sender',
    'tt.h': 'Three managers, three hotels, the same <em>phrase</em>: "I want this for the rest of the team."',
    'tt.flip': 'Flip', 'tt.to': 'To',
    'tt.1.q': 'We stopped paying the private teacher. My receptionists pass B1 in 70 days and sound less nervous with a Canadian than with a Mexican guest.',
    'tt.1.r': 'Manager · Hotel Gran Cabo',
    'tt.2.q': 'My housekeeping team was afraid to run into a guest. Now they send drill audios in the WhatsApp group. I didn\'t ask for that — it just happened.',
    'tt.2.r': 'HR Head · Palma Azul',
    'tt.3.q': 'The dashboard saves me two afternoons a month. Before, HR asked me for reports. Now I open the tab, screenshot, paste in corporate chat.',
    'tt.3.r': 'Ops Director · La Casona',
    'pr.eye': 'Pricing · <em>Per employee, per month</em>', 'pr.sub': 'MXN · USD billing available',
    'pr.h': 'Honest pricing, like a <em>ticket</em>. No hidden cost under the perforation.',
    'pr.1.k': 'Ticket · Starter', 'pr.1.t': 'One hotel. One shift. Start.',
    'pr.1.d': 'Up to 20 employees. 3 roles. Ideal for boutique hotels or proof of concept.',
    'pr.1.p': 'per employee / month · 12 month min.',
    'pr.1.f1': 'Daily WhatsApp drill', 'pr.1.f2': '3 roles available',
    'pr.1.f3': 'Final CEFR exam (A2 or B1)', 'pr.1.f4': 'Basic manager dashboard',
    'pr.1.f5': 'No HR integrations', 'pr.1.cta': 'Request a quote',
    'pr.2.badge': 'Recommended', 'pr.2.k': 'Ticket · Pro', 'pr.2.t': 'Full hotel. All roles.',
    'pr.2.d': 'Teams of 20 to 150. All 12 catalog roles. Advanced reports and alerts.',
    'pr.2.p': 'per employee / month · 12 month min.',
    'pr.2.f1': 'Everything in Starter', 'pr.2.f2': '12 roles · full curriculum',
    'pr.2.f3': 'Diagnostic + 2 CEFR exams', 'pr.2.f4': 'Dashboard with alerts and exports',
    'pr.2.f5': 'Dedicated account manager', 'pr.2.cta': 'Request a free pilot',
    'pr.3.k': 'Ticket · Group', 'pr.3.t': 'Hotel chain. Multiple properties.',
    'pr.3.d': '500+ employees across multiple properties. SSO, integrations and custom content.',
    'pr.3.amt': 'Custom', 'pr.3.p': 'annual contract · USD billing optional',
    'pr.3.f1': 'Everything in Pro', 'pr.3.f2': 'SSO (Okta, Azure AD)',
    'pr.3.f3': 'HRIS integration', 'pr.3.f4': 'Chain-specific custom content',
    'pr.3.f5': 'Consolidated multi-property reports', 'pr.3.cta': 'Talk to sales',
    'q.eye': 'Questions · <em>From real managers</em>',
    'q.h': 'The questions we always get — answered <em>without fluff</em>.',
    'q.1.q': 'What if my team doesn\'t have a computer?',
    'q.1.a': '94% of our drills run on WhatsApp, on personal or shift phones. No laptops, no training room. For the exam we recommend a tablet or computer (any hotel device works).',
    'q.2.q': 'How long until we see results?',
    'q.2.a': 'First measurable change in 14 days (confidence and vocabulary). Certifiable CEFR level up in 60–90 days, assuming 3 min/day of drilling.',
    'q.3.q': 'Is the exam valid outside the hotel?',
    'q.3.a': 'Yes. We issue a certificate aligned with the Common European Framework (CEFR). Usable for other jobs, work visas, and programs like J-1. A real benefit, not just for your hotel.',
    'q.4.q': 'What if I sign up and an employee leaves?',
    'q.4.a': 'Transferable to another employee at the same hotel at no cost, within the same month. After that, we prorate. In practice, clients report less turnover, not more.',
    'q.5.q': 'How is this different from Duolingo / Babbel?',
    'q.5.a': 'We teach role-specific English, not general English. A receptionist doesn\'t need to talk about their dog or the weather — they need to do a check-in, call a taxi, solve a complaint. All content written by hoteliers + linguists.',
    'q.6.q': 'How does the free pilot work?',
    'q.6.a': '30 days, up to 10 employees, one role. No credit card. If by day 30 there\'s no measurable progress in the diagnostic, we close the pilot with no commitment. If there is, we quote.',
    'cta.eye': '· Last stop ·',
    'cta.h': 'Request a free pilot. <em>It takes three minutes</em> — exactly the same as a lesson.',
    'cta.p': 'We\'ll reach out in 24 hours with a plan for your hotel, a clear quote, and a start date. No long demos, no lock-in.',
    'cta.b1': 'Request a free pilot', 'cta.b2': 'Get a quote in 24h',
    'cta.stamp.t': 'Free pilot', 'cta.stamp.s': '30 days · no card', 'cta.stamp.d': 'APR · 2026',
    'foot.about': 'English learning for hospitality. Made by hoteliers, in Mexico. Since 2024.',
    'foot.product': 'Product', 'foot.method': 'Method', 'foot.platform': 'Platform',
    'foot.mgr': 'For managers', 'foot.pricing': 'Pricing',
    'foot.company': 'Company', 'foot.about2': 'About us', 'foot.clients': 'Clients',
    'foot.press': 'Press', 'foot.careers': 'Careers',
    'foot.contact': 'Contact', 'foot.whatsapp': 'WhatsApp', 'foot.pilot': 'Request a free pilot',
    'foot.copy': '© 2026 Inglés Hotelero · Made in Los Cabos, MX',
    'foot.legal': 'Privacy · Terms · Legal notice'
  }
};

// original Spanish copy is in the HTML; we stash it on first switch so we can restore
const original = new Map();

function setLang(lang) {
  document.body.dataset.lang = lang;
  document.querySelectorAll('.lang button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!original.has(el)) original.set(el, el.innerHTML);
    if (lang === 'en' && I18N.en[key]) {
      el.innerHTML = I18N.en[key];
    } else {
      el.innerHTML = original.get(el);
    }
  });
}

document.querySelectorAll('.lang button').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

// ─── NAV SCROLL STATE ─────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

// ─── INTERSECTION REVEAL ──────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.rise, .stamp-anim').forEach(el => {
  // if already "in" (hero above-fold) skip observer — already has .in
  if (el.classList.contains('in')) return;
  io.observe(el);
});

// ─── HERO STAMP: delayed stamp-in on load ──
setTimeout(() => {
  document.querySelector('.hero-stamp-over')?.classList.add('in');
}, 700);

// ─── POSTCARD FLIP ─────────────────────────
document.querySelectorAll('.tt-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ─── TWEAKS ────────────────────────────────
const tweaks = document.getElementById('tweaks');

window.addEventListener('message', (e) => {
  if (e.data?.type === '__activate_edit_mode') tweaks.classList.add('open');
  if (e.data?.type === '__deactivate_edit_mode') tweaks.classList.remove('open');
});
window.parent.postMessage({ type: '__edit_mode_available' }, '*');

tweaks.querySelectorAll('.tweaks-seg').forEach(seg => {
  const key = seg.dataset.tweak;
  seg.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      seg.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyTweak(key, btn.dataset.value);
    });
  });
});

function applyTweak(key, value) {
  if (key === 'hero') {
    document.querySelector('.hero').dataset.variant = value;
  }
  if (key === 'dash') {
    const d = document.querySelector('.dashboard');
    if (value === 'ivory') {
      d.style.background = 'var(--ivory-deep)';
      d.style.color = 'var(--espresso)';
      d.querySelector('h2').style.color = 'var(--espresso)';
      d.querySelectorAll('p, .dashboard-bullet span').forEach(x => x.style.color = 'var(--espresso-soft)');
      d.querySelector('.caps').style.color = 'var(--espresso-muted)';
      d.querySelectorAll('.dashboard-bullet').forEach(b => b.style.borderColor = 'var(--hair)');
      d.querySelector('h2 em').style.color = 'var(--accent)';
    } else {
      d.removeAttribute('style');
      d.querySelectorAll('[style]').forEach(el => {
        if (el.tagName === 'H2' || el.tagName === 'P' || el.tagName === 'SPAN' || el.classList.contains('caps') || el.classList.contains('dashboard-bullet')) {
          el.removeAttribute('style');
        }
      });
    }
  }
  if (key === 'accent') {
    const map = {
      ink:    { a: '#2E4761', d: '#1C2E42', s: '#C3CDD8', t: '#E6ECF2' },
      forest: { a: '#3E5D43', d: '#2A3F2E', s: '#CBD5C3', t: '#E5EDE4' },
      terra:  { a: '#C15A37', d: '#8F3F23', s: '#E8D1C3', t: '#F4E3D8' }
    };
    const c = map[value];
    document.documentElement.style.setProperty('--accent', c.a);
    document.documentElement.style.setProperty('--accent-deep', c.d);
    document.documentElement.style.setProperty('--accent-soft', c.s);
    document.documentElement.style.setProperty('--accent-tint', c.t);
  }
}
