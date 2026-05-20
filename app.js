// ════════════════════════════════════════════════════════
// KHARCHA TRACKER — app.js
// ════════════════════════════════════════════════════════

// ── CONSTANTS & HELPERS ──────────────────────────────────
const SK = 'kharcha_v2';
const AUTH_SK = 'kharcha_auth_v1';
const THEME_SK = 'kharcha_theme_v1';

let filter = 'all';
let reportScope = 'month';
let privacyMode = false;
let sessionTimer, sessionTickTimer, sessionWarningAt = 0;

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
function fmt(n) { return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function escH(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function mKey(m, y) { return `${y}-${String(m).padStart(2, '0')}`; }

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return hash.toString(16);
}
function maskName(name) {
    if (!privacyMode) return escH(name);
    return `<span class="privacy-mask">${'●'.repeat(Math.min(8, Math.max(3, name.length)))}</span>`;
}

// ════════════════════════════════════════════════════════
// THEME SYSTEM
// ════════════════════════════════════════════════════════
const THEMES = [
    { id: 'peacock', label: 'Peacock', dot: 'linear-gradient(135deg,#2dd4bf,#0ea5e9)' },
    { id: 'dark', label: 'Dark', dot: 'linear-gradient(135deg,#a3a3a3,#525252)' },
    { id: 'light', label: 'Light', dot: 'linear-gradient(135deg,#0d9488,#0284c7)' },
    { id: 'dracula', label: 'Dracula', dot: 'linear-gradient(135deg,#bd93f9,#50fa7b)' },
    { id: 'sky', label: 'Sky', dot: 'linear-gradient(135deg,#38bdf8,#7dd3fc)' },
    { id: 'forest', label: 'Forest', dot: 'linear-gradient(135deg,#4ade80,#a3e635)' },
    { id: 'desert', label: 'Desert', dot: 'linear-gradient(135deg,#fb923c,#fcd34d)' },
    { id: 'snow', label: 'Snow', dot: 'linear-gradient(135deg,#4f46e5,#818cf8)' },
    { id: 'sunset', label: 'Sunset', dot: 'linear-gradient(135deg,#f472b6,#fb923c)' },
    { id: 'neon', label: 'Neon', dot: 'linear-gradient(135deg,#00ffcc,#aa00ff)' },
    { id: 'rose', label: 'Rose', dot: 'linear-gradient(135deg,#fb7185,#fda4af)' },
    { id: 'ocean', label: 'Ocean', dot: 'linear-gradient(135deg,#22d3ee,#2dd4bf)' },
];

let currentTheme = localStorage.getItem(THEME_SK) || 'peacock';

function applyTheme(id) {
    currentTheme = id;
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem(THEME_SK, id);
    renderThemeDropdown();
}

function renderThemeDropdown() {
    const dd = document.getElementById('theme-dd');
    if (!dd) return;
    dd.innerHTML = `<div class="theme-dropdown-title">🎨 Choose Theme</div>` +
        THEMES.map(t => `
      <div class="theme-option${t.id === currentTheme ? ' active' : ''}" onclick="applyTheme('${t.id}');toggleThemeDD(event)">
        <div class="theme-dot" style="background:${t.dot}"></div>
        ${t.label}${t.id === currentTheme ? ' ✓' : ''}
      </div>
    `).join('');
}

function toggleThemeDD(e) {
    if (e) e.stopPropagation();
    const dd = document.getElementById('theme-dd');
    dd.classList.toggle('open');
    if (dd.classList.contains('open')) renderThemeDropdown();
}

// Close dropdown on outside click
document.addEventListener('click', () => {
    const dd = document.getElementById('theme-dd');
    if (dd) dd.classList.remove('open');
});

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => applyTheme(currentTheme));

// ════════════════════════════════════════════════════════
// APP STATE & STORAGE
// ════════════════════════════════════════════════════════
function defaultTemplate() {
    return [
        { name: 'Grocery', budget: 0, items: [] },
        { name: 'Home Utility', budget: 0, items: [] },
        { name: 'Treat', budget: 0, items: [] },
        { name: 'Personal Care', budget: 0, items: [] },
    ];
}

function makeItem(name, price, platform) {
    return {
        id: uid(), name, platform: platform || 'Zepto', status: 'pending',
        notes: '', qty: 1, boughtDate: '', prices: { mrp: price, actual: price }
    };
}

function defaultMonthData(useTemplate = true, tmplOverride = null) {
    const d = { budget: 15000.00, categories: [], bills: [], emis: [], savings: [] };
    if (useTemplate) {
        const tmpl = tmplOverride || (state.defaultTemplate || defaultTemplate());
        tmpl.forEach(tc => {
            d.categories.push({
                id: uid(), name: tc.name, budget: tc.budget || 0,
                items: (tc.items || []).map(n => makeItem(n, 0))
            });
        });
    }
    return d;
}

function defaultGlobalState() {
    const now = new Date();
    const mk = mKey(now.getMonth(), now.getFullYear());
    const tmpl = defaultTemplate();
    const gs = { currentMonth: mk, platforms: ['Amazon', 'Zepto', 'Swiggy Instamart', 'Blinkit', 'Direct Shop', 'Flipkart', 'JioMart', 'DMart', 'MR.DIY', 'Other'], defaultTemplate: tmpl, months: {} };
    gs.months[mk] = defaultMonthData(true, tmpl);
    gs.months[mk].bills = [
        { id: uid(), name: 'Electricity', amount: 1200, due: '5th', notes: 'DGVCL', status: 'unpaid' },
        { id: uid(), name: 'Internet', amount: 699, due: '10th', notes: 'Jio Fiber', status: 'unpaid' },
    ];
    gs.months[mk].emis = [
        { id: uid(), name: 'Home Loan', amount: 8500, due: '1st', bank: 'SBI', remaining: 180, notes: '', status: 'unpaid' },
    ];
    gs.months[mk].savings = [
        { id: uid(), name: 'Emergency Fund', amount: 3000, bank: 'HDFC', notes: 'Auto-transfer', status: 'done' },
    ];
    return gs;
}

function loadState() {
    try { const d = localStorage.getItem(SK); return d ? JSON.parse(d) : defaultGlobalState(); }
    catch { return defaultGlobalState(); }
}
function saveState() { localStorage.setItem(SK, JSON.stringify(state)); }

let state = loadState();
if (!state.months[state.currentMonth]) {
    state.months[state.currentMonth] = defaultMonthData(true, state.defaultTemplate || defaultTemplate());
}
function monthData() { return state.months[state.currentMonth] || defaultMonthData(false); }

// ════════════════════════════════════════════════════════
// AUTH STATE
// ════════════════════════════════════════════════════════
function loadAuthState() {
    try { return JSON.parse(localStorage.getItem(AUTH_SK) || '{}'); }
    catch { return {}; }
}
function saveAuthState(a) { localStorage.setItem(AUTH_SK, JSON.stringify(a)); }

let authState = loadAuthState();

function getCurrentUser() {
    if (!authState.currentUser) return null;
    return (authState.users || {})[authState.currentUser] || null;
}

// ════════════════════════════════════════════════════════
// AUTH FUNCTIONS
// ════════════════════════════════════════════════════════
function switchAuthTab(tab) {
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
    document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
    document.getElementById('signup-form').style.display = tab === 'signup' ? 'flex' : 'none';
    document.getElementById('auth-switch-text').innerHTML = tab === 'login'
        ? `Don't have an account? <span onclick="switchAuthTab('signup')">Register here</span>`
        : `Already have an account? <span onclick="switchAuthTab('login')">Login</span>`;
    document.getElementById('login-err').textContent = '';
    document.getElementById('signup-err').textContent = '';
}

function doLogin() {
    const ident = document.getElementById('l-ident').value.trim();
    const pass = document.getElementById('l-pass').value;
    const errEl = document.getElementById('login-err');
    if (!ident || !pass) { errEl.textContent = 'Please fill all fields.'; return; }
    const users = authState.users || {};
    const user = users[ident] || Object.values(users).find(u => u.email === ident);
    if (!user) { errEl.textContent = 'User not found.'; return; }
    if (user.passHash !== simpleHash(pass)) { errEl.textContent = 'Incorrect password.'; return; }
    authState.currentUser = user.username;
    saveAuthState(authState);
    enterApp();
}

function doRegister() {
    const fullName = document.getElementById('r-name').value.trim();
    const username = document.getElementById('r-uname').value.trim().toLowerCase();
    const email = document.getElementById('r-email').value.trim().toLowerCase();
    const mobile = document.getElementById('r-mobile').value.trim();
    const pass = document.getElementById('r-pass').value;
    const pass2 = document.getElementById('r-pass2').value;
    const errEl = document.getElementById('signup-err');
    if (!fullName || !username || !email || !mobile || !pass || !pass2) { errEl.textContent = 'All fields are required.'; return; }
    if (username.length < 3) { errEl.textContent = 'Username must be at least 3 characters.'; return; }
    if (!/^[a-z0-9_]+$/.test(username)) { errEl.textContent = 'Username: only letters, numbers, underscore.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { errEl.textContent = 'Invalid email address.'; return; }
    if (pass.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; return; }
    if (pass !== pass2) { errEl.textContent = 'Passwords do not match.'; return; }
    authState.users = authState.users || {};
    if (authState.users[username]) { errEl.textContent = 'Username already taken.'; return; }
    if (Object.values(authState.users).find(u => u.email === email)) { errEl.textContent = 'Email already registered.'; return; }
    authState.users[username] = { fullName, username, email, mobile, passHash: simpleHash(pass) };
    authState.currentUser = username;
    saveAuthState(authState);
    enterApp();
}

function doLogout() {
    stopSessionTimer();
    authState.currentUser = null;
    saveAuthState(authState);
    document.getElementById('session-overlay').classList.remove('show');
    document.getElementById('session-pass').value = '';
    document.getElementById('session-err').textContent = '';
    document.getElementById('app-screen').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('l-ident').value = '';
    document.getElementById('l-pass').value = '';
    document.getElementById('login-err').textContent = '';
    switchAuthTab('login');
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    filter = 'all'; reportScope = 'month'; privacyMode = false;
    const pb = document.getElementById('privacy-btn');
    if (pb) { pb.textContent = '👁 Privacy'; pb.classList.remove('active'); }
}

function enterApp() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    const user = getCurrentUser();
    if (user) {
        const initials = user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        document.getElementById('user-avatar-top').textContent = initials;
        document.getElementById('user-name-top').textContent = user.fullName.split(' ')[0];
        document.getElementById('profile-info').innerHTML = `
      <div><span style="color:var(--muted)">Full Name:</span> ${escH(user.fullName)}</div>
      <div><span style="color:var(--muted)">Username:</span> @${escH(user.username)}</div>
      <div><span style="color:var(--muted)">Email:</span> ${escH(user.email)}</div>
      <div><span style="color:var(--muted)">Mobile:</span> ${escH(user.mobile)}</div>
    `;
    }
    resetSessionTimer();
    render();
}

(function () {
    if (authState.currentUser && (authState.users || {})[authState.currentUser]) enterApp();
})();

// ════════════════════════════════════════════════════════
// SESSION TIMEOUT
// ════════════════════════════════════════════════════════
function getTimeoutMs() {
    const mins = parseInt(localStorage.getItem('kharcha_timeout') || '5') || 5;
    return mins * 60 * 1000;
}
function resetSessionTimer() {
    if (!getCurrentUser()) return;
    clearTimeout(sessionTimer);
    clearInterval(sessionTickTimer);
    sessionTimer = setTimeout(() => lockSession(), getTimeoutMs());
}
function stopSessionTimer() { clearTimeout(sessionTimer); clearInterval(sessionTickTimer); }

['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(ev => {
    document.addEventListener(ev, () => {
        if (getCurrentUser() && !document.getElementById('session-overlay').classList.contains('show')) {
            resetSessionTimer();
        }
    }, { passive: true });
});

function lockSession() {
    const overlay = document.getElementById('session-overlay');
    document.getElementById('session-err').textContent = '';
    document.getElementById('session-pass').value = '';
    document.getElementById('session-timer-fill').style.width = '100%';
    const user = getCurrentUser();
    document.getElementById('session-sub-text').textContent =
        `Hi ${user ? user.fullName.split(' ')[0] : ''}! Session locked due to inactivity. Enter password to continue.`;
    overlay.classList.add('show');
    sessionWarningAt = Date.now();
    sessionTickTimer = setInterval(() => {
        const elapsed = Date.now() - sessionWarningAt;
        const remaining = Math.max(0, 120000 - elapsed);
        document.getElementById('session-timer-fill').style.width = (remaining / 120000 * 100) + '%';
        if (remaining <= 0) { clearInterval(sessionTickTimer); doLogout(); }
    }, 1000);
}

function unlockSession() {
    const pass = document.getElementById('session-pass').value;
    const errEl = document.getElementById('session-err');
    const user = getCurrentUser();
    if (!user) { doLogout(); return; }
    if (simpleHash(pass) !== user.passHash) { errEl.textContent = 'Incorrect password. Try again.'; return; }
    clearInterval(sessionTickTimer);
    document.getElementById('session-overlay').classList.remove('show');
    document.getElementById('session-pass').value = '';
    errEl.textContent = '';
    resetSessionTimer();
}

function saveTimeoutSetting() {
    const val = parseInt(document.getElementById('timeout-minutes').value) || 5;
    localStorage.setItem('kharcha_timeout', val);
    resetSessionTimer();
}

// ════════════════════════════════════════════════════════
// PRIVACY MODE
// ════════════════════════════════════════════════════════
function togglePrivacy() {
    privacyMode = !privacyMode;
    const btn = document.getElementById('privacy-btn');
    btn.textContent = privacyMode ? '🙈 Privacy ON' : '👁 Privacy';
    btn.classList.toggle('active', privacyMode);
    renderCategories(); renderBillsPage(); renderReports();
}

// ════════════════════════════════════════════════════════
// MONTH SELECTOR
// ════════════════════════════════════════════════════════
function buildMonthSelectors() {
    const mSel = document.getElementById('month-sel');
    const ySel = document.getElementById('year-sel');
    if (!mSel || !ySel) return;
    mSel.innerHTML = MONTH_NAMES.map((n, i) => `<option value="${i}">${n}</option>`).join('');
    const years = new Set();
    Object.keys(state.months).forEach(k => years.add(parseInt(k.split('-')[0])));
    const now = new Date(); years.add(now.getFullYear()); years.add(now.getFullYear() + 1);
    ySel.innerHTML = [...years].sort().map(y => `<option value="${y}">${y}</option>`).join('');
    const parts = state.currentMonth.split('-');
    mSel.value = parseInt(parts[1]);
    ySel.value = parseInt(parts[0]);
}

function changeMonth() {
    const m = document.getElementById('month-sel').value;
    const y = document.getElementById('year-sel').value;
    const mk = mKey(m, y);
    if (!state.months[mk]) {
        if (!confirm(`Month ${MONTH_NAMES[m]} ${y} doesn't exist yet. Create it?`)) { buildMonthSelectors(); return; }
        state.months[mk] = defaultMonthData(true, state.defaultTemplate || defaultTemplate());
    }
    state.currentMonth = mk; render();
}

function shiftMonth(dir) {
    const parts = state.currentMonth.split('-');
    let m = parseInt(parts[1]), y = parseInt(parts[0]);
    m += dir;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    const mk = mKey(m, y);
    if (!state.months[mk]) {
        if (!confirm(`Create ${MONTH_NAMES[m]} ${y}?`)) return;
        state.months[mk] = defaultMonthData(true, state.defaultTemplate || defaultTemplate());
    }
    state.currentMonth = mk; render();
}

function createNewMonth() {
    const now = new Date();
    document.getElementById('nm-month').value = now.getMonth();
    document.getElementById('nm-year').value = now.getFullYear();
    openModal('new-month-modal');
}

function confirmNewMonth() {
    const m = parseInt(document.getElementById('nm-month').value);
    const y = parseInt(document.getElementById('nm-year').value);
    const copy = document.getElementById('nm-copy').value;
    const mk = mKey(m, y);
    if (state.months[mk]) { if (!confirm(`${MONTH_NAMES[m]} ${y} already exists. Overwrite?`)) return; }
    const tmpl = (copy === 'default') ? (state.defaultTemplate || defaultTemplate()) : null;
    state.months[mk] = defaultMonthData(copy === 'default', tmpl);
    state.currentMonth = mk;
    closeModal('new-month-modal'); render();
}

// ════════════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════════════
function render() {
    saveState();
    buildMonthSelectors();
    renderOverview();
    renderCategories();
    renderBillsPage();
    renderReports();
    renderPlatformChips();
    renderTemplateEditor();
    const storedTimeout = localStorage.getItem('kharcha_timeout') || '5';
    const el = document.getElementById('timeout-minutes');
    if (el) el.value = storedTimeout;
}

function renderOverview() {
    const md = monthData();
    const spent = md.categories.flatMap(c => c.items)
        .filter(i => i.status === 'bought')
        .reduce((s, i) => s + (i.prices.actual || 0) * (i.qty || 1), 0);
    const budget = md.budget || 0;
    const billsTotal = md.bills.reduce((s, b) => s + (b.amount || 0), 0);
    const emiTotal = md.emis.reduce((s, e) => s + (e.amount || 0), 0);
    const savingsTotal = md.savings.reduce((s, sv) => s + (sv.amount || 0), 0);
    const totalOut = spent + billsTotal + emiTotal + savingsTotal;
    const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
    document.getElementById('ov-grid').innerHTML = `
    <div class="ov-card budget">
      <div class="ov-label">Shopping Budget</div>
      <div class="ov-value">₹${fmt(budget)}</div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${pct > 90 ? 'var(--rose)' : 'linear-gradient(90deg,var(--accent),var(--accent-alt))'}"></div></div>
      <div class="ov-sub">${pct.toFixed(1)}% used · ₹${fmt(budget - spent)} left</div>
    </div>
    <div class="ov-card spent">
      <div class="ov-label">Shopping Spent</div>
      <div class="ov-value">₹${fmt(spent)}</div>
      <div class="ov-sub">${md.categories.flatMap(c => c.items).filter(i => i.status === 'bought').length} items bought</div>
    </div>
    <div class="ov-card bills">
      <div class="ov-label">Bills Total</div>
      <div class="ov-value">₹${fmt(billsTotal)}</div>
      <div class="ov-sub">${md.bills.filter(b => b.status === 'paid').length}/${md.bills.length} paid</div>
    </div>
    <div class="ov-card emi">
      <div class="ov-label">EMI Total</div>
      <div class="ov-value">₹${fmt(emiTotal)}</div>
      <div class="ov-sub">${md.emis.filter(e => e.status === 'paid').length}/${md.emis.length} paid</div>
    </div>
    <div class="ov-card saved">
      <div class="ov-label">Savings</div>
      <div class="ov-value">₹${fmt(savingsTotal)}</div>
      <div class="ov-sub">${md.savings.filter(s => s.status === 'done').length}/${md.savings.length} transferred</div>
    </div>
    <div class="ov-card net">
      <div class="ov-label">Total Outflow</div>
      <div class="ov-value">₹${fmt(totalOut)}</div>
      <div class="ov-sub">Shopping + Bills + EMI + Savings</div>
    </div>
  `;
}

function catSpent(cat) {
    return cat.items.filter(i => i.status === 'bought').reduce((s, i) => s + (i.prices.actual || 0) * (i.qty || 1), 0);
}

function renderCatBudgetBar(cat) {
    const budget = cat.budget || 0;
    if (!budget) return '';
    const spent = catSpent(cat);
    const left = budget - spent;
    const over = spent > budget ? spent - budget : 0;
    const pct = Math.min(100, (spent / budget) * 100);
    const isOver = spent > budget;
    const barColor = isOver ? 'var(--rose)' : pct > 80 ? 'var(--gold)' : 'linear-gradient(90deg,var(--accent),var(--accent-alt))';
    return `
    <div class="cat-budget-bar">
      <div class="cat-budget-nums">
        <div class="cat-bnum"><span class="cat-bnum-label">Budget</span><span class="cat-bnum-val v-budget">₹${fmt(budget)}</span></div>
        <div class="cat-bnum"><span class="cat-bnum-label">Spent</span><span class="cat-bnum-val v-spent">₹${fmt(spent)}</span></div>
        <div class="cat-bnum"><span class="cat-bnum-label">${isOver ? 'Over!' : 'Remaining'}</span><span class="cat-bnum-val ${isOver ? 'v-over' : left === 0 ? 'v-zero' : 'v-left'}">₹${fmt(isOver ? over : left)}</span></div>
      </div>
      <div class="cat-prog-track"><div class="cat-prog-fill" style="width:${pct}%;background:${barColor}"></div></div>
    </div>`;
}

function renderCategories() {
    const md = monthData();
    const cont = document.getElementById('cat-container');
    if (!cont) return;
    cont.innerHTML = '';
    md.categories.forEach(cat => {
        const items = cat.items.filter(i => filter === 'all' || i.status === filter);
        const total = cat.items.reduce((s, i) => s + (i.prices.actual || 0) * (i.qty || 1), 0);
        const bought = cat.items.filter(i => i.status === 'bought').length;
        const el = document.createElement('div'); el.className = 'cat-card';
        el.innerHTML = `
      <div class="cat-header">
        <div class="cat-title">${escH(cat.name)}
          <span class="cat-badge">${bought}/${cat.items.length} · ₹${privacyMode ? '****' : fmt(total)}</span>
        </div>
        <div class="cat-actions">
          <button class="icon-btn" onclick="openEditCat('${cat.id}')">✎</button>
          <button class="icon-btn" onclick="openAddItem('${cat.id}')">+ Item</button>
          <button class="icon-btn danger" onclick="deleteCat('${cat.id}')">✕</button>
        </div>
      </div>
      ${renderCatBudgetBar(cat)}
      <div class="items-list">
        ${items.length === 0 ? '<div class="empty">No items.</div>' : items.map(i => renderItemRow(cat.id, i)).join('')}
      </div>
      <div class="add-item-bar">
        <input type="text" placeholder="Quick add item name..." id="quick-${cat.id}" onkeydown="if(event.key==='Enter')quickAdd('${cat.id}')">
        <input type="number" placeholder="₹ price" id="qprice-${cat.id}" style="width:80px" onkeydown="if(event.key==='Enter')quickAdd('${cat.id}')">
        <button class="btn primary" style="font-size:10px;padding:5px 10px" onclick="quickAdd('${cat.id}')">Add</button>
      </div>
    `;
        cont.appendChild(el);
    });
}

function renderItemRow(catId, item) {
    const statusIcon = item.status === 'bought' ? '✓' : item.status === 'cancelled' ? '✗' : '';
    const nextStatus = item.status === 'pending' ? 'bought' : item.status === 'bought' ? 'cancelled' : 'pending';
    const qty = item.qty || 1;
    const actualTotal = (item.prices.actual || 0) * qty;
    const mrpLine = (item.prices.mrp && item.prices.mrp !== item.prices.actual) ? `<div class="iprice-mrp">MRP ₹${privacyMode ? '****' : fmt(item.prices.mrp)}</div>` : '';
    const qtyB = qty > 1 ? `<span class="qty-badge">×${qty}</span>` : '';
    const dateT = item.boughtDate ? `<span class="date-tag">📅${item.boughtDate}</span>` : '';
    const displayName = maskName(item.name);
    const displayPrice = privacyMode ? '<span class="privacy-mask">●●●●</span>' : `₹${fmt(actualTotal)}`;
    const displayPriceEa = privacyMode ? '' : `<div style="font-size:9px;color:var(--muted)">₹${fmt(item.prices.actual)} ea</div>`;
    return `<div class="item-row ${item.status}">
    <button class="status-btn ${item.status}" onclick="cycleStatus('${catId}','${item.id}','${nextStatus}')">${statusIcon}</button>
    <div class="item-info" onclick="openEditItem('${catId}','${item.id}')">
      <span class="iname">${displayName}${qtyB}</span>
      <span class="imeta">${escH(item.platform || '')}${item.notes ? ' · ' + escH(item.notes) : ''}${dateT}</span>
    </div>
    <div class="item-price">
      <div class="iprice-actual">${displayPrice}</div>
      ${qty > 1 ? displayPriceEa : ''}
      ${mrpLine}
    </div>
    <div class="item-actions">
      <button class="mini-btn" onclick="openEditItem('${catId}','${item.id}')">✎</button>
      <button class="mini-btn del" onclick="deleteItem('${catId}','${item.id}')">🗑</button>
    </div>
  </div>`;
}

function renderBillsPage() {
    const md = monthData();
    renderTracks('bills-container', md.bills, 'bill', 'var(--gold)');
    renderTracks('emi-container', md.emis, 'emi', 'var(--indigo)');
    renderTracks('savings-container', md.savings, 'saving', 'var(--emerald)');
}

function renderTracks(containerId, items, type, color) {
    const cont = document.getElementById(containerId);
    if (!cont) return;
    cont.innerHTML = '';
    if (!items || items.length === 0) { cont.innerHTML = '<div class="empty">Nothing added yet.</div>'; return; }
    items.forEach(item => {
        const statusLabel = type === 'saving' ? (item.status === 'done' ? 'Transferred' : 'Pending') : (item.status === 'paid' ? 'Paid' : 'Unpaid');
        const statusClass = type === 'saving' ? (item.status === 'done' ? 'done' : 'unpaid') : (item.status === 'paid' ? 'paid' : 'unpaid');
        const nextStatus = type === 'saving' ? (item.status === 'done' ? 'pending' : 'done') : (item.status === 'paid' ? 'unpaid' : 'paid');
        const metaLine = [
            item.due ? `Due: ${escH(item.due)}` : '',
            item.bank ? `${escH(item.bank)}` : '',
            item.remaining ? `${item.remaining} EMIs left` : '',
            item.notes ? escH(item.notes) : ''
        ].filter(Boolean).join(' · ');
        const el = document.createElement('div'); el.className = 'track-card';
        el.innerHTML = `
      <div class="track-header">
        <div>
          <div class="track-name" style="color:${color}">${privacyMode ? '<span class="privacy-mask">●●●●●●</span>' : escH(item.name)}</div>
          ${metaLine ? `<div class="track-meta">${metaLine}</div>` : ''}
        </div>
        <div class="track-amount" style="color:${color}">${privacyMode ? '₹ ●●●●' : `₹${fmt(item.amount)}`}</div>
      </div>
      <div class="track-body">
        <button class="track-status ${statusClass}" onclick="toggleTrackStatus('${type}','${item.id}','${nextStatus}')">${statusLabel}</button>
        <div class="track-actions">
          <button class="mini-btn" onclick="openEditTrack('${type}','${item.id}')">✎</button>
          <button class="mini-btn del" onclick="deleteTrack('${type}','${item.id}')">🗑</button>
        </div>
      </div>
    `;
        cont.appendChild(el);
    });
}

function renderReports() {
    const cont = document.getElementById('reports-content');
    if (!cont) return;
    let allItems = [];
    if (reportScope === 'month') {
        const md = monthData();
        md.categories.forEach(cat => {
            cat.items.filter(i => i.status === 'bought').forEach(i => { allItems.push({ ...i, month: state.currentMonth }); });
        });
    } else {
        Object.entries(state.months).forEach(([mk, md]) => {
            md.categories.forEach(cat => {
                cat.items.filter(i => i.status === 'bought').forEach(i => { allItems.push({ ...i, month: mk }); });
            });
        });
    }
    const freqMap = {};
    allItems.forEach(i => {
        const k = i.name.toLowerCase().trim();
        freqMap[k] = (freqMap[k] || { name: i.name, count: 0, totalSpent: 0 });
        freqMap[k].count += (i.qty || 1);
        freqMap[k].totalSpent += (i.prices.actual || 0) * (i.qty || 1);
    });
    const byFreq = Object.values(freqMap).sort((a, b) => b.count - a.count).slice(0, 10);
    const maxFreq = byFreq[0]?.count || 1;
    const bySpend = Object.values(freqMap).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
    const maxSpend = bySpend[0]?.totalSpent || 1;
    const priceMap = {};
    allItems.forEach(i => {
        const k = i.name.toLowerCase().trim();
        if (!priceMap[k] || i.prices.actual > priceMap[k].price) { priceMap[k] = { name: i.name, price: i.prices.actual || 0 }; }
    });
    const byPrice = Object.values(priceMap).sort((a, b) => b.price - a.price).slice(0, 10);
    const maxPrice = byPrice[0]?.price || 1;
    const crossMap = {};
    Object.entries(state.months).forEach(([mk, md]) => {
        md.categories.forEach(cat => {
            cat.items.filter(i => i.status === 'bought').forEach(i => {
                const k = i.name.toLowerCase().trim();
                crossMap[k] = crossMap[k] || { name: i.name, months: new Set() };
                crossMap[k].months.add(mk);
            });
        });
    });
    const crossItems = Object.values(crossMap).filter(x => x.months.size >= 2).sort((a, b) => b.months.size - a.months.size).slice(0, 10);

    function rankEl(i) {
        if (i === 0) return '<span class="rank-num gold-rank">1</span>';
        if (i === 1) return '<span class="rank-num silver-rank">2</span>';
        if (i === 2) return '<span class="rank-num bronze-rank">3</span>';
        return `<span class="rank-num">${i + 1}</span>`;
    }
    function rName(name) { return privacyMode ? '<span class="privacy-mask">●●●●●●</span>' : escH(name); }

    cont.innerHTML = `
    <div class="report-section">
      <div class="section-title" style="font-size:15px">🔁 Top 10 — Most Bought (by qty)</div>
      ${allItems.length === 0 ? '<div class="empty">No bought items in this scope.</div>' : `
      <table class="report-table">
        <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Total Spent</th><th>Bar</th></tr></thead>
        <tbody>${byFreq.map((r, i) => `<tr>
          <td>${rankEl(i)}</td><td>${rName(r.name)}</td>
          <td style="color:var(--accent)">${r.count}</td>
          <td style="color:var(--gold)">${privacyMode ? '●●●●' : `₹${fmt(r.totalSpent)}`}</td>
          <td><div class="bar-cell"><div class="mini-bar" style="width:${Math.round((r.count / maxFreq) * 100)}px;background:var(--accent)"></div></div></td>
        </tr>`).join('')}</tbody>
      </table>`}
    </div>
    <div class="report-section">
      <div class="section-title" style="font-size:15px">💸 Top 10 — Highest Total Spend</div>
      ${allItems.length === 0 ? '<div class="empty">No data.</div>' : `
      <table class="report-table">
        <thead><tr><th>#</th><th>Item</th><th>Total Spent</th><th>Qty</th><th>Bar</th></tr></thead>
        <tbody>${bySpend.map((r, i) => `<tr>
          <td>${rankEl(i)}</td><td>${rName(r.name)}</td>
          <td style="color:var(--rose)">${privacyMode ? '●●●●' : `₹${fmt(r.totalSpent)}`}</td>
          <td style="color:var(--muted)">${r.count}</td>
          <td><div class="bar-cell"><div class="mini-bar" style="width:${Math.round((r.totalSpent / maxSpend) * 100)}px;background:var(--rose)"></div></div></td>
        </tr>`).join('')}</tbody>
      </table>`}
    </div>
    <div class="report-section">
      <div class="section-title" style="font-size:15px">💎 Top 10 — Highest Unit Price</div>
      ${allItems.length === 0 ? '<div class="empty">No data.</div>' : `
      <table class="report-table">
        <thead><tr><th>#</th><th>Item</th><th>Unit Price</th><th>Bar</th></tr></thead>
        <tbody>${byPrice.map((r, i) => `<tr>
          <td>${rankEl(i)}</td><td>${rName(r.name)}</td>
          <td style="color:var(--gold)">${privacyMode ? '●●●●' : `₹${fmt(r.price)}`}</td>
          <td><div class="bar-cell"><div class="mini-bar" style="width:${Math.round((r.price / maxPrice) * 100)}px;background:var(--gold)"></div></div></td>
        </tr>`).join('')}</tbody>
      </table>`}
    </div>
    ${reportScope === 'all' ? `
    <div class="report-section">
      <div class="section-title" style="font-size:15px">📅 Items Bought Across Multiple Months</div>
      ${crossItems.length === 0 ? '<div class="empty">No recurring items found.</div>' : `
      <div class="cross-month-list">${crossItems.map(r => `
        <div class="cross-item">
          <div class="cross-item-name">${rName(r.name)}</div>
          <div class="cross-item-months">${[...r.months].sort().map(mk => {
        const [y, m] = mk.split('-');
        return `<span class="month-chip">${SHORT_MONTHS[parseInt(m)]} ${y}</span>`;
    }).join('')}</div>
        </div>
      `).join('')}</div>`}
    </div>`: ''}
  `;
}

// ════════════════════════════════════════════════════════
// ACTIONS — SHOPPING
// ════════════════════════════════════════════════════════
function showToast(title, msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-msg').textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 4000);
}

function cycleStatus(catId, itemId, next) {
    const md = monthData();
    const cat = md.categories.find(c => c.id === catId);
    const item = cat?.items.find(i => i.id === itemId);
    if (!item) return;
    item.status = next;
    if (next === 'bought' && !item.boughtDate) item.boughtDate = new Date().toISOString().slice(0, 10);
    render();
    if (next === 'bought' && cat && cat.budget > 0) {
        const spent = catSpent(cat);
        if (spent > cat.budget) {
            const over = spent - cat.budget;
            showToast(`${cat.name}: Budget Exceeded!`, `Budget ₹${fmt(cat.budget)} · Spent ₹${fmt(spent)} · Over by ₹${fmt(over)}`);
        }
    }
}

function quickAdd(catId) {
    const nameEl = document.getElementById(`quick-${catId}`);
    const priceEl = document.getElementById(`qprice-${catId}`);
    const name = (nameEl?.value || '').trim();
    if (!name) return;
    const price = parseFloat(priceEl?.value) || 0;
    const md = monthData();
    const cat = md.categories.find(c => c.id === catId);
    if (cat) { cat.items.push(makeItem(name, price)); render(); }
}

function openAddItem(catId) {
    document.getElementById('ei-cat').value = catId;
    document.getElementById('ei-item').value = '';
    document.getElementById('item-modal-title').textContent = 'Add Item';
    document.getElementById('ei-name').value = '';
    document.getElementById('ei-notes').value = '';
    document.getElementById('ei-qty').value = '1';
    document.getElementById('ei-date').value = '';
    document.getElementById('ei-mrp').value = '';
    document.getElementById('ei-actual').value = '';
    renderPlatformSelect();
    openModal('add-item-modal');
}

function openEditItem(catId, itemId) {
    const item = monthData().categories.find(c => c.id === catId)?.items.find(i => i.id === itemId);
    if (!item) return;
    document.getElementById('ei-cat').value = catId;
    document.getElementById('ei-item').value = itemId;
    document.getElementById('item-modal-title').textContent = 'Edit Item';
    document.getElementById('ei-name').value = item.name;
    document.getElementById('ei-notes').value = item.notes || '';
    document.getElementById('ei-qty').value = item.qty || 1;
    document.getElementById('ei-date').value = item.boughtDate || '';
    document.getElementById('ei-mrp').value = item.prices.mrp || '';
    document.getElementById('ei-actual').value = item.prices.actual || '';
    renderPlatformSelect(item.platform);
    openModal('add-item-modal');
}

function saveItem() {
    const catId = document.getElementById('ei-cat').value;
    const itemId = document.getElementById('ei-item').value;
    const name = document.getElementById('ei-name').value.trim();
    if (!name) { alert('Name required'); return; }
    const platform = document.getElementById('ei-platform').value;
    const notes = document.getElementById('ei-notes').value.trim();
    const qty = parseInt(document.getElementById('ei-qty').value) || 1;
    const boughtDate = document.getElementById('ei-date').value;
    const prices = { mrp: parseFloat(document.getElementById('ei-mrp').value) || 0, actual: parseFloat(document.getElementById('ei-actual').value) || 0 };
    const md = monthData();
    const cat = md.categories.find(c => c.id === catId);
    if (!cat) return;
    if (itemId) {
        const item = cat.items.find(i => i.id === itemId);
        if (item) Object.assign(item, { name, platform, notes, qty, boughtDate, prices });
    } else {
        cat.items.push({ id: uid(), name, platform, notes, status: 'pending', qty, boughtDate, prices });
    }
    closeModal('add-item-modal'); render();
}

function deleteItem(catId, itemId) {
    if (!confirm('Delete item?')) return;
    const md = monthData();
    const cat = md.categories.find(c => c.id === catId);
    if (cat) cat.items = cat.items.filter(i => i.id !== itemId);
    render();
}

function openEditCat(catId) {
    const cat = monthData().categories.find(c => c.id === catId);
    if (!cat) return;
    document.getElementById('cat-modal-title').textContent = 'Edit Category';
    document.getElementById('edit-cat-id-modal').value = catId;
    document.getElementById('cat-name-input').value = cat.name;
    document.getElementById('cat-budget-input').value = cat.budget || 0;
    openModal('add-category-modal');
}

function saveCategory() {
    const name = document.getElementById('cat-name-input').value.trim();
    if (!name) { alert('Name required'); return; }
    const budget = parseFloat(document.getElementById('cat-budget-input').value) || 0;
    const editId = document.getElementById('edit-cat-id-modal').value;
    const md = monthData();
    if (editId) {
        const cat = md.categories.find(c => c.id === editId);
        if (cat) { cat.name = name; cat.budget = budget; }
    } else {
        md.categories.push({ id: uid(), name, budget, items: [] });
    }
    document.getElementById('cat-name-input').value = '';
    closeModal('add-category-modal'); render();
}

function deleteCat(catId) {
    const md = monthData();
    const cat = md.categories.find(c => c.id === catId);
    if (!confirm(`Delete "${cat?.name}"?`)) return;
    md.categories = md.categories.filter(c => c.id !== catId);
    render();
}

function saveBudget() {
    const val = parseFloat(document.getElementById('budget-inp').value);
    if (isNaN(val)) { alert('Invalid'); return; }
    monthData().budget = val;
    closeModal('budget-modal'); render();
}

// ════════════════════════════════════════════════════════
// ACTIONS — BILLS / EMI / SAVINGS
// ════════════════════════════════════════════════════════
function openTrackModal(type) {
    document.getElementById('et-type').value = type;
    document.getElementById('et-id').value = '';
    document.getElementById('et-name').value = '';
    document.getElementById('et-amount').value = '';
    document.getElementById('et-due').value = '';
    document.getElementById('et-bank').value = '';
    document.getElementById('et-notes').value = '';
    document.getElementById('et-remaining').value = '';
    const titles = { bill: 'Add Utility Bill', emi: 'Add EMI', saving: 'Add Saving / Transfer' };
    document.getElementById('track-modal-title').textContent = titles[type] || 'Add';
    document.getElementById('et-emi-extra').style.display = type === 'emi' ? 'block' : 'none';
    document.getElementById('et-due-group').style.display = type === 'saving' ? 'none' : 'block';
    openModal('track-modal');
}

function openEditTrack(type, id) {
    const md = monthData();
    const arr = type === 'bill' ? md.bills : type === 'emi' ? md.emis : md.savings;
    const item = arr.find(x => x.id === id);
    if (!item) return;
    document.getElementById('et-type').value = type;
    document.getElementById('et-id').value = id;
    document.getElementById('et-name').value = item.name || '';
    document.getElementById('et-amount').value = item.amount || '';
    document.getElementById('et-due').value = item.due || '';
    document.getElementById('et-bank').value = item.bank || '';
    document.getElementById('et-notes').value = item.notes || '';
    document.getElementById('et-remaining').value = item.remaining || '';
    const titles = { bill: 'Edit Utility Bill', emi: 'Edit EMI', saving: 'Edit Saving' };
    document.getElementById('track-modal-title').textContent = titles[type] || 'Edit';
    document.getElementById('et-emi-extra').style.display = type === 'emi' ? 'block' : 'none';
    document.getElementById('et-due-group').style.display = type === 'saving' ? 'none' : 'block';
    openModal('track-modal');
}

function saveTrack() {
    const type = document.getElementById('et-type').value;
    const id = document.getElementById('et-id').value;
    const name = document.getElementById('et-name').value.trim();
    if (!name) { alert('Name required'); return; }
    const amount = parseFloat(document.getElementById('et-amount').value) || 0;
    const due = document.getElementById('et-due').value.trim();
    const bank = document.getElementById('et-bank').value.trim();
    const notes = document.getElementById('et-notes').value.trim();
    const remaining = parseInt(document.getElementById('et-remaining').value) || 0;
    const md = monthData();
    const arr = type === 'bill' ? md.bills : type === 'emi' ? md.emis : md.savings;
    const defStatus = type === 'saving' ? 'pending' : 'unpaid';
    if (id) {
        const item = arr.find(x => x.id === id);
        if (item) Object.assign(item, { name, amount, due, bank, notes, remaining });
    } else {
        const obj = { id: uid(), name, amount, due, bank, notes, status: defStatus };
        if (type === 'emi') obj.remaining = remaining;
        arr.push(obj);
    }
    closeModal('track-modal'); render();
}

function toggleTrackStatus(type, id, next) {
    const md = monthData();
    const arr = type === 'bill' ? md.bills : type === 'emi' ? md.emis : md.savings;
    const item = arr.find(x => x.id === id);
    if (item) { item.status = next; render(); }
}

function deleteTrack(type, id) {
    if (!confirm('Delete?')) return;
    const md = monthData();
    if (type === 'bill') md.bills = md.bills.filter(x => x.id !== id);
    else if (type === 'emi') md.emis = md.emis.filter(x => x.id !== id);
    else md.savings = md.savings.filter(x => x.id !== id);
    render();
}

// ════════════════════════════════════════════════════════
// PLATFORMS
// ════════════════════════════════════════════════════════
function renderPlatformSelect(selected) {
    const sel = document.getElementById('ei-platform');
    if (!sel) return;
    sel.innerHTML = state.platforms.map(p => `<option value="${escH(p)}"${p === selected ? ' selected' : ''}>${escH(p)}</option>`).join('');
}
function renderPlatformChips() {
    const area = document.getElementById('platform-chips');
    if (!area) return;
    area.innerHTML = state.platforms.map(p => `
    <span class="chip">${escH(p)} <span class="x" onclick="deletePlatform('${escH(p)}')">✕</span></span>
  `).join('');
}
function addPlatform() {
    const inp = document.getElementById('new-plat');
    const val = (inp?.value || '').trim();
    if (!val || state.platforms.includes(val)) return;
    state.platforms.push(val); inp.value = ''; render();
}
function deletePlatform(p) {
    if (state.platforms.length <= 1) { alert('Keep at least one.'); return; }
    state.platforms = state.platforms.filter(x => x !== p); render();
}

// ════════════════════════════════════════════════════════
// TEMPLATE EDITOR
// ════════════════════════════════════════════════════════
function renderTemplateEditor() {
    const cont = document.getElementById('template-editor');
    if (!cont) return;
    const tmpl = state.defaultTemplate || [];
    cont.innerHTML = tmpl.map((cat, ci) => `
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;margin-bottom:10px;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid var(--border);gap:8px;flex-wrap:wrap">
        <span style="font-size:13px;font-weight:600;color:var(--accent)">${escH(cat.name)}</span>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:5px">
            <span style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Budget ₹</span>
            <input type="number" value="${cat.budget || 0}" min="0" placeholder="0 = no limit"
              style="width:110px;background:var(--bg2);border:1px solid var(--border2);color:var(--text);border-radius:5px;padding:4px 8px;font-family:'JetBrains Mono',monospace;font-size:11px;outline:none"
              onchange="updateTmplBudget(${ci},this.value)" title="0 = no limit">
          </div>
          <button class="mini-btn del" onclick="deleteTmplCat(${ci})">✕ Remove</button>
        </div>
      </div>
      <div style="padding:8px 12px">
        ${cat.items.length === 0 ? '<div style="font-size:10px;color:var(--muted);padding:4px 0">No default items.</div>' : ''}
        ${cat.items.map((item, ii) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.05)">
            <span style="font-size:11px;color:var(--text2)">${escH(item)}</span>
            <button class="mini-btn del" onclick="deleteTmplItem(${ci},${ii})">✕</button>
          </div>
        `).join('')}
        <div style="display:flex;gap:6px;margin-top:8px">
          <input type="text" id="ti-${ci}" placeholder="Add default item..." style="flex:1;background:var(--bg2);border:1px solid var(--border);color:var(--text);border-radius:5px;padding:5px 8px;font-family:'JetBrains Mono',monospace;font-size:11px;outline:none" onkeydown="if(event.key==='Enter')addTmplItem(${ci})">
          <button class="btn" style="font-size:10px;padding:4px 9px" onclick="addTmplItem(${ci})">+ Item</button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateTmplBudget(ci, val) { state.defaultTemplate[ci].budget = parseFloat(val) || 0; saveState(); }
function addTemplateCategory() {
    const inp = document.getElementById('tmpl-cat-name');
    const budgetInp = document.getElementById('tmpl-cat-budget');
    const name = (inp?.value || '').trim();
    if (!name) return;
    const budget = parseFloat(budgetInp?.value) || 0;
    state.defaultTemplate = state.defaultTemplate || [];
    state.defaultTemplate.push({ name, budget, items: [] });
    inp.value = ''; if (budgetInp) budgetInp.value = '0';
    render();
}
function deleteTmplCat(ci) { state.defaultTemplate.splice(ci, 1); render(); }
function addTmplItem(ci) {
    const inp = document.getElementById(`ti-${ci}`);
    const val = (inp?.value || '').trim();
    if (!val) return;
    state.defaultTemplate[ci].items.push(val); inp.value = ''; render();
}
function deleteTmplItem(ci, ii) { state.defaultTemplate[ci].items.splice(ii, 1); render(); }

// ════════════════════════════════════════════════════════
// MODALS / NAV
// ════════════════════════════════════════════════════════
function openModal(id) {
    document.getElementById(id)?.classList.add('open');
    if (id === 'budget-modal') document.getElementById('budget-inp').value = monthData().budget || '';
}
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(el => el.addEventListener('click', e => {
    if (e.target === el) el.classList.remove('open');
}));

function showPage(name, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('page-' + name)?.classList.add('active');
    el?.classList.add('active');
    if (name === 'reports') renderReports();
}

function setFilter(f, el) {
    filter = f;
    document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
    el?.classList.add('active');
    renderCategories();
}

function setReportScope(s, el) {
    reportScope = s;
    document.querySelectorAll('#page-reports .ftab').forEach(t => t.classList.remove('active'));
    el?.classList.add('active');
    renderReports();
}

// ════════════════════════════════════════════════════════
// EXPORT / IMPORT
// ════════════════════════════════════════════════════════
function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `kharcha_backup_${state.currentMonth}.json`; a.click();
}

function importData() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json';
    inp.onchange = e => {
        const file = e.target.files[0]; if (!file) return;
        const r = new FileReader();
        r.onload = ev => {
            try {
                const d = JSON.parse(ev.target.result);
                if (!d.months) throw new Error('invalid');
                state = d; render(); alert('Imported!');
            } catch { alert('Invalid file.'); }
        };
        r.readAsText(file);
    };
    inp.click();
}
