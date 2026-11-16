/* =========================================================
   Kiele Swistak — interactions & dashboards
   All numbers are derived from résumé dates; "present" = today.
   ========================================================= */
(function () {
  'use strict';

  var NOW = new Date();
  var nowM = NOW.getFullYear() * 12 + NOW.getMonth() + NOW.getDate() / 31; // fractional month index
  function m(y, mo) { return y * 12 + (mo - 1); } // month index
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmt(idx) { return MONTHS[Math.floor(idx) % 12] + ' ' + Math.floor(idx / 12); }

  /* ---------------- DATA (from the résumé) ---------------- */
  var INDUSTRY = {
    freight: { name: 'Freight logistics', css: '--c-freight' },
    wealth: { name: 'Wealth management', css: '--c-wealth' },
    hospitality: { name: 'Hospitality', css: '--c-hospitality' },
    ink: { name: 'Campus & leadership', css: '--c-ink' }
  };

  var ROLES = [
    {
      id: 'arrive', title: 'Client Success Representative', org: 'Arrive Logistics', loc: '',
      ind: 'freight', start: m(2026, 10), end: null,
      bullets: [
        'Brokers deals between shippers and carriers, matching each load to the right truck, lane and timeline.',
        'Negotiates rates with carriers and customers to land deals that work for both sides.',
        'Coordinates pickups and deliveries and tracks each load from booking to proof of delivery.',
        'Serves as the go-to contact for customers, sharing updates and resolving delays as they happen.',
        'Builds a dependable network of carrier partners through steady communication and follow-through.'
      ]
    },
    {
      id: 'css', title: 'Client Service Specialist', org: 'Johnson & Associates, Ameriprise Financial', loc: 'Tampa, FL',
      ind: 'wealth', start: m(2026, 1), end: m(2026, 5),
      bullets: [
        'Delivered high-quality client support by responding to inquiries, resolving issues and ensuring a positive experience across multiple communication channels.',
        'Managed client accounts, keeping records accurate, up to date and compliant with company standards.',
        'Built and maintained strong client relationships, resulting in increased client satisfaction and retention.',
        'Collaborated with internal teams to address client needs, streamline processes and improve service delivery.',
        'Identified opportunities to enhance the client experience and contributed to process improvements.',
        'Handled sensitive information with a high level of confidentiality and professionalism.',
        'Assisted in onboarding new clients by guiding them through services, policies and procedures.',
        'Consistently met or exceeded performance metrics, including response time, resolution rate and client satisfaction scores.'
      ]
    },
    {
      id: 'intern', title: 'Financial Advisor Intern', org: 'Johnson & Associates, Ameriprise Financial', loc: 'Tampa, FL',
      ind: 'wealth', start: m(2025, 5), end: m(2025, 12),
      bullets: [
        'Assisted senior advisor Ashley Johnson with client onboarding, financial planning and portfolio research.',
        'Observed and took part in client meetings to learn investment strategies and relationship management.',
        'Prepared account documentation and supported daily office operations.',
        'Helped manage social media outreach through the firm’s “Go Social” initiative.'
      ]
    },
    {
      id: 'barista', title: 'Barista', org: 'Starbucks Coffee Company', loc: 'New York, NY',
      ind: 'hospitality', start: m(2022, 11), end: m(2025, 5),
      bullets: [
        'Delivered high-quality customer service in a fast-paced environment, consistently meeting and exceeding customer expectations.',
        'Managed cash transactions, maintained inventory and upheld a clean and organized workspace.',
        'Developed strong communication skills, effectively resolving customer concerns and ensuring a positive guest experience.'
      ]
    },
    {
      id: 'cfa', title: 'Team Member, CFA Institute Research Challenge', org: 'The University of Tampa', loc: 'Tampa, FL',
      ind: 'ink', filter: 'leadership', start: m(2025, 9), end: null,
      bullets: [
        'Represented the University of Tampa in the CFA Institute Research Challenge.',
        'Led a team of finance students in company valuation, industry analysis and equity research.',
        'Collaborated with faculty mentors and industry professionals to refine analytical and presentation skills.'
      ]
    }
  ];

  var CAMPUS = [
    { title: 'Fashion Club', sub: 'Treasurer', start: m(2025, 9), end: null },
    { title: 'American Marketing Assoc.', sub: '', start: m(2024, 1), end: m(2025, 12) },
    { title: 'Entrepreneurship Club', sub: '', start: m(2024, 1), end: m(2025, 12) }
  ];

  function endOf(r) { return r.end == null ? nowM : r.end; }
  function months(r) { return Math.max(0, endOf(r) - r.start); }
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  /* ---------------- tooltip ---------------- */
  var tip = document.getElementById('tooltip');
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.classList.add('is-on');
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(window.innerWidth - w - 12, Math.max(12, x + 14));
    var top = y - h - 14 < 8 ? y + 18 : y - h - 14;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  function hideTip() { tip.classList.remove('is-on'); }
  function bindTip(el, html) {
    el.addEventListener('mousemove', function (e) { showTip(html, e.clientX, e.clientY); });
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('focus', function () { var r = el.getBoundingClientRect(); showTip(html, r.left + r.width / 2, r.top); });
    el.addEventListener('blur', hideTip);
  }
  window.addEventListener('scroll', hideTip, { passive: true });

  /* ---------------- header bits ---------------- */
  document.getElementById('year').textContent = NOW.getFullYear();
  document.getElementById('issue-date').textContent =
    NOW.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  var yearsClient = Math.floor((nowM - m(2022, 11)) / 12);
  document.getElementById('kpi-years').textContent = yearsClient;
  var arriveMonth = Math.max(1, Math.floor(nowM - m(2026, 10)) + 1);
  document.getElementById('kpi-arrive').textContent = arriveMonth;

  /* ---------------- theme toggle ---------------- */
  var root = document.documentElement;
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ks-theme', next); } catch (e) {}
    drawDonut(false);
  });

  /* ---------------- progress + nav ---------------- */
  var bar = document.getElementById('progress-bar');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    bar.style.width = (p * 100).toFixed(2) + '%';
    var cur = null;
    navLinks.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s && s.getBoundingClientRect().top < 140) cur = a;
    });
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a === cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- ticker: duplicate for seamless loop ---------------- */
  var track = document.querySelector('.ticker__track');
  track.innerHTML += track.innerHTML;

  /* ---------------- count-up ---------------- */
  function countUp(el) {
    var target = parseFloat(el.textContent);
    if (isNaN(target)) return;
    var t0 = null, dur = 1200;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------------- DONUT ---------------- */
  var donutSvg = document.getElementById('donut');
  var donutData = ['hospitality', 'wealth', 'freight'].map(function (k) {
    var total = ROLES.filter(function (r) { return r.ind === k; })
      .reduce(function (s, r) { return s + months(r); }, 0);
    return { key: k, months: total, live: ROLES.some(function (r) { return r.ind === k && r.end == null; }) };
  });
  var donutTotal = donutData.reduce(function (s, d) { return s + d.months; }, 0);

  function arcPath(cx, cy, r0, r1, a0, a1) {
    var large = a1 - a0 > Math.PI ? 1 : 0;
    function pt(r, a) { return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }
    var p0 = pt(r1, a0), p1 = pt(r1, a1), p2 = pt(r0, a1), p3 = pt(r0, a0);
    return 'M' + p0 + 'A' + r1 + ',' + r1 + ' 0 ' + large + ' 1 ' + p1 +
      'L' + p2 + 'A' + r0 + ',' + r0 + ' 0 ' + large + ' 0 ' + p3 + 'Z';
  }
  function drawDonut(animate) {
    donutSvg.querySelectorAll('path').forEach(function (p) { p.remove(); });
    var gap = 0.035, a = 0, minA = 0.09; // min angle keeps tiny slices visible & hoverable
    var sweep = 2 * Math.PI - gap * donutData.length;
    var raw = donutData.map(function (d) { return d.months / donutTotal * sweep; });
    var boost = raw.reduce(function (s, x) { return s + Math.max(0, minA - x); }, 0);
    var big = raw.reduce(function (s, x) { return s + (x > minA ? x : 0); }, 0);
    var angles = raw.map(function (x) { return x < minA ? minA : x - boost * (x / big); });
    donutData.forEach(function (d, i) {
      var a0 = a + gap / 2, a1 = a0 + angles[i];
      a = a1 + gap / 2;
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', arcPath(110, 110, 68, 104, a0, a1));
      p.setAttribute('fill', cssVar(INDUSTRY[d.key].css));
      p.setAttribute('tabindex', '0');
      p.dataset.key = d.key;
      bindTip(p, '<b>' + INDUSTRY[d.key].name + '</b>' + d.months.toFixed(1) + ' months <span>(' +
        Math.round(d.months / donutTotal * 100) + '%' + (d.live ? ', still growing' : '') + ')</span>');
      p.addEventListener('mouseenter', function () { hot(d.key); });
      p.addEventListener('mouseleave', function () { hot(null); });
      donutSvg.appendChild(p);
    });
  }
  function hot(key) {
    donutSvg.querySelectorAll('path').forEach(function (p) {
      p.classList.toggle('is-dim', !!key && p.dataset.key !== key);
      p.classList.toggle('is-hot', p.dataset.key === key);
    });
    document.querySelectorAll('#donut-legend li').forEach(function (li) {
      li.classList.toggle('is-hot', li.dataset.key === key);
    });
  }
  drawDonut();
  var legend = document.getElementById('donut-legend');
  donutData.forEach(function (d) {
    var li = document.createElement('li');
    li.dataset.key = d.key;
    li.innerHTML = '<i class="sw sw--' + d.key + '"></i><span>' + INDUSTRY[d.key].name +
      (d.live ? ' <small>&#9679; live</small>' : '') + '</span><b>' + Math.round(d.months) + ' mo</b>';
    li.addEventListener('mouseenter', function () { hot(d.key); });
    li.addEventListener('mouseleave', function () { hot(null); });
    legend.appendChild(li);
  });
  var donutNum = document.getElementById('donut-total');
  donutNum.textContent = Math.round(donutTotal);

  /* ---------------- GANTT ---------------- */
  var gStart = m(2022, 9), gEnd = nowM + 2;
  var span = gEnd - gStart;
  function pct(x) { return ((x - gStart) / span * 100); }
  var gantt = document.getElementById('gantt');
  var rows = ROLES.slice().sort(function (a, b) { return b.start - a.start; })
    .filter(function (r) { return r.ind !== 'ink'; })
    .concat(ROLES.filter(function (r) { return r.ind === 'ink'; }).map(function (r) {
      return { title: 'CFA Research Challenge', org: 'University of Tampa', ind: 'ink', start: r.start, end: r.end };
    }))
    .concat(CAMPUS.map(function (c) { return { title: c.title, org: c.sub || 'University of Tampa', ind: 'ink', start: c.start, end: c.end }; }));

  // year gridlines
  var firstYear = Math.ceil(gStart / 12) * 12;
  var yearW = 12 / span * 100;
  var yearX = pct(firstYear);

  rows.forEach(function (r) {
    var row = document.createElement('div');
    row.className = 'gantt__row';
    var label = document.createElement('div');
    label.className = 'gantt__label';
    label.innerHTML = r.title + (r.ind !== 'ink' ? '' : '');
    var trk = document.createElement('div');
    trk.className = 'gantt__track';
    trk.style.setProperty('--year-w', yearW + '%');
    trk.style.setProperty('--year-x', yearX + '%');
    var b = document.createElement('span');
    b.className = 'gantt__bar' + (r.ind === 'ink' ? ' gantt__bar--ink' : '') + (r.end == null ? ' gantt__bar--live' : '');
    b.style.left = pct(r.start) + '%';
    b.style.width = Math.max(1.2, pct(endOf(r)) - pct(r.start)) + '%';
    if (r.ind !== 'ink') b.style.background = 'var(' + INDUSTRY[r.ind].css + ')';
    b.tabIndex = 0;
    bindTip(b, '<b>' + r.title + '</b>' + r.org + '<br><span>' + fmt(r.start) + ' – ' +
      (r.end == null ? 'Present' : fmt(r.end)) + ' · ' + Math.round(months(r)) + ' mo</span>');
    trk.appendChild(b);
    row.appendChild(label);
    row.appendChild(trk);
    gantt.appendChild(row);
  });
  // graduation milestone on the CFA row? Put on its own row for clarity
  (function () {
    var row = document.createElement('div');
    row.className = 'gantt__row';
    row.innerHTML = '<div class="gantt__label">BBA Finance <small>(graduated)</small></div>';
    var trk = document.createElement('div');
    trk.className = 'gantt__track';
    trk.style.setProperty('--year-w', yearW + '%');
    trk.style.setProperty('--year-x', yearX + '%');
    var d = document.createElement('span');
    d.className = 'gantt__mile';
    d.style.left = pct(m(2025, 12) + 0.5) + '%';
    d.tabIndex = 0;
    bindTip(d, '<b>Graduated</b>Bachelor of Business in Finance<br><span>The University of Tampa · Dec 2025</span>');
    trk.appendChild(d);
    row.appendChild(trk);
    gantt.appendChild(row);
  })();
  // today line spanning tracks
  var axis = document.getElementById('gantt-axis');
  for (var y = firstYear; y < gEnd; y += 12) {
    if (Math.abs(pct(y) - pct(nowM)) < 6) continue; // keep "today" label clear
    var s = document.createElement('span');
    s.style.left = pct(y) + '%';
    s.textContent = "'" + String(y / 12).slice(2);
    axis.appendChild(s);
  }
  var today = document.createElement('span');
  today.style.left = pct(nowM) + '%';
  today.style.color = 'var(--accent)';
  today.textContent = 'today';
  axis.appendChild(today);
  gantt.querySelectorAll('.gantt__track').forEach(function (t) {
    var line = document.createElement('i');
    line.className = 'gantt__today';
    line.style.left = pct(nowM) + '%';
    t.appendChild(line);
  });

  /* ---------------- data table ---------------- */
  var tbody = document.querySelector('#data-table tbody');
  ROLES.forEach(function (r) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + r.title + '</td><td>' + r.org + '</td><td>' + INDUSTRY[r.ind].name + '</td><td>' +
      fmt(r.start) + '</td><td>' + (r.end == null ? 'Present' : fmt(r.end)) + '</td><td>' + months(r).toFixed(1) + '</td>';
    tbody.appendChild(tr);
  });

  /* ---------------- ROLES list ---------------- */
  var list = document.getElementById('roles');
  ROLES.forEach(function (r, i) {
    var li = document.createElement('li');
    li.className = 'role' + (i === 0 ? ' is-open' : '');
    li.dataset.filter = r.filter || r.ind;
    var when = fmt(r.start) + ' — ' + (r.end == null ? 'Present' : fmt(r.end));
    var id = 'role-body-' + r.id;
    li.innerHTML =
      '<button class="role__btn" type="button" aria-expanded="' + (i === 0) + '" aria-controls="' + id + '">' +
        '<span class="role__when">' + when + '</span>' +
        '<span><span class="role__title">' + r.title + '</span>' +
        '<span class="role__org"><i>' + r.org + '</i>' + (r.loc ? ' · ' + r.loc : '') + '</span></span>' +
        '<span class="role__tag"><i class="sw sw--' + r.ind + '"></i>' + (r.filter === 'leadership' ? 'Leadership' : INDUSTRY[r.ind].name) + '</span>' +
        '<span class="role__plus" aria-hidden="true">+</span>' +
      '</button>' +
      '<div class="role__body" id="' + id + '"><div><ul class="ticks">' +
        r.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
      '</ul></div></div>';
    li.querySelector('.role__btn').addEventListener('click', function () {
      var open = li.classList.toggle('is-open');
      this.setAttribute('aria-expanded', open);
    });
    list.appendChild(li);
  });

  document.querySelectorAll('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter').forEach(function (b) { b.classList.toggle('is-on', b === btn); });
      var f = btn.dataset.filter;
      list.querySelectorAll('.role').forEach(function (li) {
        li.classList.toggle('is-hidden', f !== 'all' && li.dataset.filter !== f);
      });
    });
  });

  /* ---------------- EVIDENCE MATRIX ---------------- */
  var COLS = [
    { id: 'arrive', short: 'Arrive' },
    { id: 'css', short: 'Client Svc' },
    { id: 'intern', short: 'FA Intern' },
    { id: 'barista', short: 'Starbucks' },
    { id: 'cfa', short: 'CFA Team' }
  ];
  var SKILLS = [
    { name: 'Client relationships', ev: {
      arrive: 'Serves as the go-to contact for customers, sharing updates and resolving delays as they happen.',
      css: 'Built and maintained strong client relationships, resulting in increased client satisfaction and retention.',
      intern: 'Observed and took part in client meetings to learn investment strategies and relationship management.',
      barista: 'Delivered high-quality customer service in a fast-paced environment.' } },
    { name: 'Negotiation & deal-making', ev: {
      arrive: 'Negotiates rates with carriers and customers to land deals that work for both sides.' } },
    { name: 'Problem resolution', ev: {
      arrive: 'Resolving delays as they happen.',
      css: 'Responding to inquiries, resolving issues and ensuring a positive experience.',
      barista: 'Effectively resolving customer concerns and ensuring a positive guest experience.' } },
    { name: 'Accurate records & compliance', ev: {
      css: 'Managed client accounts, keeping records accurate, up to date and compliant with company standards.',
      intern: 'Prepared account documentation and supported daily office operations.',
      barista: 'Managed cash transactions and maintained inventory.' } },
    { name: 'Client onboarding', ev: {
      css: 'Assisted in onboarding new clients by guiding them through services, policies and procedures.',
      intern: 'Assisted senior advisor Ashley Johnson with client onboarding.' } },
    { name: 'Research & analysis', ev: {
      intern: 'Assisted with financial planning and portfolio research.',
      cfa: 'Led a team of finance students in company valuation, industry analysis and equity research.' } },
    { name: 'Teamwork & leadership', ev: {
      css: 'Collaborated with internal teams to address client needs, streamline processes and improve service delivery.',
      cfa: 'Led a team of finance students; collaborated with faculty mentors and industry professionals.' } },
    { name: 'Process improvement', ev: {
      css: 'Identified opportunities to enhance the client experience and contributed to process improvements.' } },
    { name: 'Coordination & logistics', ev: {
      arrive: 'Coordinates pickups and deliveries and tracks each load from booking to proof of delivery.',
      intern: 'Supported daily office operations.' } },
    { name: 'Communication & presenting', ev: {
      css: 'Supported clients across multiple communication channels.',
      intern: 'Helped manage social media outreach through the firm’s “Go Social” initiative.',
      barista: 'Developed strong communication skills.',
      cfa: 'Refined analytical and presentation skills with faculty mentors and industry professionals.' } }
  ];
  var matrix = document.getElementById('matrix');
  var quote = document.getElementById('matrix-quote');
  var thead = '<thead><tr><th></th>' + COLS.map(function (c) { return '<th scope="col">' + c.short + '</th>'; }).join('') +
    '<th scope="col">Roles</th></tr></thead>';
  var body = '<tbody>' + SKILLS.map(function (s, si) {
    var n = 0;
    var cells = COLS.map(function (c) {
      if (s.ev[c.id]) {
        n++;
        return '<td><button class="cell cell--on" type="button" data-s="' + si + '" data-c="' + c.id +
          '" aria-label="' + s.name + ' at ' + c.short + '"></button></td>';
      }
      return '<td><span class="cell" aria-hidden="true"></span></td>';
    }).join('');
    return '<tr><th scope="row">' + s.name + '</th>' + cells +
      '<td class="count">' + n + '<span class="count__bar" style="width:' + (n / COLS.length * 100) + '%"></span></td></tr>';
  }).join('') + '</tbody>';
  matrix.innerHTML = thead + body;

  function pick(btn) {
    matrix.querySelectorAll('.cell--on').forEach(function (b) { b.classList.toggle('is-picked', b === btn); });
    var s = SKILLS[+btn.dataset.s];
    var role = ROLES.filter(function (r) { return r.id === btn.dataset.c; })[0];
    quote.innerHTML = '<span class="mono">' + s.name + '</span><p>“' + s.ev[btn.dataset.c] + '”' +
      '<span class="src">' + role.title + ' · ' + role.org + '</span></p>';
  }
  matrix.querySelectorAll('.cell--on').forEach(function (b) {
    b.addEventListener('mouseenter', function () { pick(b); });
    b.addEventListener('focus', function () { pick(b); });
    b.addEventListener('click', function () { pick(b); });
  });

  /* ---------------- TOOLKIT ---------------- */
  var TOOLS = [
    { name: 'Advanced Excel & Data Analysis', glyph: 'fx', lvl: 4, words: 'Advanced',
      text: 'Formulas, pivot tables, VLOOKUP/XLOOKUP and basic data visualization for reporting and insights.' },
    { name: 'Microsoft Office Suite', glyph: 'W', lvl: 3, words: 'Strong working knowledge',
      text: 'Excel, PowerPoint and Word for data analysis, reporting and professional presentations.' },
    { name: 'CRM Systems', glyph: '@', lvl: 3, words: 'Hands-on experience',
      text: 'Tracking client interactions, managing accounts and improving service efficiency.' },
    { name: 'Bloomberg Terminal', glyph: '$', lvl: 3, words: 'Hands-on experience',
      text: 'Financial data analysis, market research and tracking real-time financial information.' },
    { name: 'Research & Analysis', glyph: '?', lvl: 3, words: 'Skilled',
      text: 'Market research, competitive analysis and data-driven evaluations.' },
    { name: 'Financial Analysis', glyph: '%', lvl: 2, words: 'Foundational',
      text: 'Financial statements, budgeting and basic financial modeling concepts.' }
  ];
  var tools = document.getElementById('tools');
  TOOLS.forEach(function (t) {
    var el = document.createElement('article');
    el.className = 'tool reveal';
    var segs = '';
    for (var i = 0; i < 4; i++) segs += '<i class="' + (i < t.lvl ? 'on' : '') + '" style="transition-delay:' + (i * 120 + 300) + 'ms"></i>';
    el.innerHTML = '<span class="tool__glyph" aria-hidden="true">' + t.glyph + '</span><h3>' + t.name + '</h3><p>' + t.text +
      '</p><div class="meter-row"><span class="mono">Her words</span><span class="words">' + t.words + '</span></div>' +
      '<div class="meter" aria-label="' + t.words + '">' + segs + '</div>';
    tools.appendChild(el);
  });

  /* ---------------- FREIGHT DESK ---------------- */
  var STAGES = [
    { short: 'Tender', title: 'A load comes in', text: 'A shipper has freight that needs to move. Kiele captures the details (pickup, delivery, timing and equipment) so nothing gets lost in the handoff.' },
    { short: 'Match', title: 'Find the right truck', text: 'She searches for a carrier with the right equipment heading the right way at the right time. This is the matchmaking that makes brokerage work.' },
    { short: 'Rate', title: 'Strike the deal', text: 'She negotiates a rate that keeps the shipper competitive and the carrier paid fairly, then locks it in so both sides know what to expect.' },
    { short: 'Transit', title: 'Keep it moving', text: 'Once the load is on the road she tracks it, keeps the customer updated and deals with delays or surprises before they become problems.' },
    { short: 'Deliver', title: 'Delivered & documented', text: 'The freight arrives, the paperwork closes out, and both relationships are a little stronger for the next load.' }
  ];
  var road = document.getElementById('road');
  var truck = document.getElementById('truck');
  var stopsG = document.getElementById('stops');
  var stepsEl = document.getElementById('steps');
  var L = road.getTotalLength();
  var stopPts = STAGES.map(function (s, i) {
    var p = road.getPointAtLength(L * (0.04 + i * 0.23));
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'stop');
    g.innerHTML = '<circle cx="' + p.x + '" cy="' + p.y + '" r="9"/><text x="' + p.x + '" y="' + (p.y + (p.y < 80 ? -18 : 30)) + '">' +
      s.short.toUpperCase() + '</text>';
    g.addEventListener('click', function () { go(i, true); });
    stopsG.appendChild(g);
    var b = document.createElement('button');
    b.className = 'step';
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.innerHTML = '<span>0' + (i + 1) + '</span><b>' + s.short + '</b>';
    b.addEventListener('click', function () { go(i, true); });
    stepsEl.appendChild(b);
    return { p: p, len: L * (0.04 + i * 0.23) };
  });
  var cur = -1, timer = null, userTook = false;
  var card = document.getElementById('stage-card');
  function go(i, byUser) {
    if (byUser) { userTook = true; clearInterval(timer); }
    cur = i;
    var pt = stopPts[i].p;
    var ahead = road.getPointAtLength(Math.min(L, stopPts[i].len + 2));
    var ang = Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180 / Math.PI;
    truck.style.transform = 'translate(' + pt.x + 'px,' + (pt.y - 12) + 'px) rotate(' + ang + 'deg)';
    stopsG.querySelectorAll('.stop').forEach(function (g, k) {
      g.classList.toggle('is-on', k === i);
      g.classList.toggle('is-done', k < i);
    });
    stepsEl.querySelectorAll('.step').forEach(function (b, k) {
      b.classList.toggle('is-on', k === i);
      b.setAttribute('aria-selected', k === i);
    });
    document.getElementById('stage-num').textContent = '0' + (i + 1);
    document.getElementById('stage-title').textContent = STAGES[i].title;
    document.getElementById('stage-text').textContent = STAGES[i].text;
    card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap');
  }
  go(0);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- reveal on scroll ---------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('is-in');
      el.querySelectorAll('[data-count]').forEach(countUp);
      if (el.classList.contains('panel--gantt')) gantt.classList.add('is-in');
      if (el.classList.contains('panel--donut')) countUp(donutNum);
      if (el.id === 'desk' && !reduce && !timer && !userTook) {
        timer = setInterval(function () { go((cur + 1) % STAGES.length); }, 3600);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.15 }) : null;

  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 5) * 70 + 'ms';
    if (io) io.observe(el); else el.classList.add('is-in');
  });
  if (!io) gantt.classList.add('is-in');

  /* ---------------- copy email ---------------- */
  var copyBtn = document.getElementById('copy-email');
  copyBtn.addEventListener('click', function () {
    var email = 'kieleswistak05@gmail.com';
    function done() { copyBtn.textContent = 'Copied ✓'; setTimeout(function () { copyBtn.textContent = 'Copy email'; }, 1800); }
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, function () { copyBtn.textContent = email; });
    else copyBtn.textContent = email;
  });
})();
