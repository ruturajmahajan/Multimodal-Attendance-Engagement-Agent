// ============================================================
// app.js — MAEA Main Application Logic
// ============================================================

// =========================================================
// SECTION 1: INITIALIZATION
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  updateClock();
  setInterval(updateClock, 1000);

  initAllCharts();
  renderRoster();
  renderSuggestions();
  renderStudentsGrid();
  renderSessionLog();
  renderActivityFeed();
  renderSignalBars();
  renderDashboardSuggestions();
  renderDonutLegend();
  renderPriorityBars();
  renderSuggHistoryList();
  renderTopPerformers();
  renderAtRiskList();
  renderSessionStats();

  // Start live simulation
  setInterval(liveTick, 5000);

  showToast('system', 'MAEA Online', 'Multimodal analysis engine ready · CS301 session loaded');
});

// =========================================================
// SECTION 2: PARTICLE BACKGROUND
// =========================================================

function initParticles() {
  const container = document.getElementById('bgParticles');
  const colors = ['#7C3AED', '#06B6D4', '#10B981', '#8B5CF6'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 10}s;
      --delay: ${-Math.random() * 10}s;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
      opacity: ${0.2 + Math.random() * 0.4};
    `;
    container.appendChild(p);
  }
}

// =========================================================
// SECTION 3: CLOCK & SESSION TIMER
// =========================================================

function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('topbarTime').textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('topbarDate').textContent =
    now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatSessionTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = n => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function toggleSession() {
  AppState.sessionActive = !AppState.sessionActive;
  const btn = document.getElementById('sessionToggleBtn');
  const pill = document.getElementById('sessionPill');
  const pillText = document.getElementById('sessionPillText');
  const placeholder = document.getElementById('noFeedPlaceholder');
  const scanLine = document.getElementById('scanLine');
  const scanStatus = document.querySelector('.status-dot');
  const scanStatusText = document.getElementById('scanStatusText');

  if (AppState.sessionActive) {
    AppState.sessionTimer = setInterval(() => {
      AppState.sessionSeconds++;
      document.getElementById('sidebarSessionTime').textContent = formatSessionTime(AppState.sessionSeconds);
    }, 1000);

    pill.classList.add('active');
    pillText.textContent = 'Session Active';
    btn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`;
    if (placeholder) placeholder.classList.add('hidden');
    if (scanLine) scanLine.classList.add('active');
    if (scanStatus) { scanStatus.className = 'status-dot active'; }
    if (scanStatusText) scanStatusText.textContent = 'Scanning...';

    renderFaceGrid();
    addLogEntry('system', '🟢', 'Session Resumed', 'Multimodal analysis engine reactivated');
    showToast('success', 'Session Active', 'Live analysis and attendance tracking started');
    liveUpdateEngagementChart();
  } else {
    clearInterval(AppState.sessionTimer);
    pill.classList.remove('active');
    pillText.textContent = 'Session Paused';
    btn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>`;
    if (placeholder) placeholder.classList.remove('hidden');
    if (scanLine) scanLine.classList.remove('active');
    if (scanStatus) { scanStatus.className = 'status-dot paused'; }
    if (scanStatusText) scanStatusText.textContent = 'System Ready';

    clearFaceGrid();
    addLogEntry('system', '⏸️', 'Session Paused', 'Analysis paused by instructor');
    showToast('info', 'Session Paused', 'Attendance and engagement tracking paused');
  }
}

// =========================================================
// SECTION 4: NAVIGATION
// =========================================================

function navigateTo(pageId, el) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  // Update breadcrumb
  const labels = {
    dashboard: 'Overview', attendance: 'Attendance', engagement: 'Engagement',
    suggestions: 'AI Suggestions', students: 'Students', session: 'Session Log', reports: 'Reports'
  };
  document.getElementById('pageBreadcrumb').textContent = labels[pageId] || pageId;
  AppState.currentPage = pageId;

  // Lazy-init charts on page visit
  setTimeout(() => {
    if (pageId === 'attendance')  { initAttendanceTimelineChart(); }
    if (pageId === 'engagement')  { initSignalRadarChart(); initEngagementIntervalChart(); renderHeatmap(); updateSignalCards(); }
    if (pageId === 'suggestions') { initSuggCategoryChart(); renderSuggestions(); }
    if (pageId === 'session')     { initEventDistChart(); }
    if (pageId === 'reports')     { initWeeklyAttendanceChart(); initSessionEngagementChart(); }
  }, 50);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 680) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

// =========================================================
// SECTION 5: ROSTER RENDERING
// =========================================================

function renderRoster() {
  const list = document.getElementById('rosterList');
  if (!list) return;
  list.innerHTML = '';
  STUDENTS.forEach(s => {
    const item = document.createElement('div');
    item.className = `roster-item ${AppState.rosterFilter !== 'all' && s.status !== AppState.rosterFilter ? 'hidden' : ''}`;
    item.dataset.status = s.status;
    item.innerHTML = `
      <div class="roster-avatar" style="background: ${s.color}">${s.initials}</div>
      <div class="roster-info">
        <div class="roster-name">${s.name}</div>
        <div class="roster-id">${s.id}</div>
      </div>
      <span class="roster-status-badge status-${s.status}">${capitalize(s.status)}</span>
      <span class="roster-time">${s.entryTime}</span>
    `;
    item.onclick = () => openStudentModal(s);
    list.appendChild(item);
  });
}

function filterRoster(filter, btn) {
  AppState.rosterFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.roster-item').forEach(item => {
    item.classList.toggle('hidden', filter !== 'all' && item.dataset.status !== filter);
  });
}

// =========================================================
// SECTION 6: FACE GRID (CAMERA SIMULATION)
// =========================================================

function renderFaceGrid() {
  const grid = document.getElementById('faceGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const presentStudents = STUDENTS.filter(s => s.status !== 'absent').slice(0, 20);
  presentStudents.forEach(s => {
    const box = document.createElement('div');
    box.className = `face-box ${s.status === 'late' ? 'late' : ''}`;
    box.style.maxWidth = '70px';
    box.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${s.color}" width="20" height="20" opacity="0.7">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
      <div class="face-label">${s.initials}</div>
    `;
    grid.appendChild(box);
  });

  document.getElementById('detectedCount').textContent = `${presentStudents.length} Detected`;
  document.getElementById('confidenceLabel').textContent = `Confidence: ${88 + Math.floor(Math.random()*8)}%`;
}

function clearFaceGrid() {
  const grid = document.getElementById('faceGrid');
  if (grid) grid.innerHTML = '';
  document.getElementById('detectedCount').textContent = '0 Detected';
  document.getElementById('confidenceLabel').textContent = 'Confidence: --';
}

// =========================================================
// SECTION 7: ATTENDANCE SCAN
// =========================================================

function runAttendanceScan() {
  if (!AppState.sessionActive) {
    showToast('warning', 'Session Not Active', 'Please start a session before running a scan');
    return;
  }

  AppState.scanActive = true;
  const btn = document.getElementById('scanBtn');
  const statusEl = document.querySelector('.status-dot');
  const statusText = document.getElementById('scanStatusText');

  btn.disabled = true;
  btn.textContent = 'Scanning...';
  if (statusEl) { statusEl.className = 'status-dot scanning'; }
  if (statusText) statusText.textContent = 'Deep scan in progress...';

  renderFaceGrid();
  addLogEntry('attendance', '📷', 'Manual Scan Initiated', `Detection threshold: ${document.getElementById('thresholdSlider').value}%`);

  setTimeout(() => {
    AppState.scanActive = false;
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd"/></svg> Run Scan`;
    if (statusEl) { statusEl.className = 'status-dot active'; }
    if (statusText) statusText.textContent = 'Scan Complete';

    const present = STUDENTS.filter(s => s.status === 'present').length;
    const late    = STUDENTS.filter(s => s.status === 'late').length;
    const absent  = STUDENTS.filter(s => s.status === 'absent').length;
    addLogEntry('attendance', '✅', 'Scan Complete', `${present} present · ${late} late · ${absent} absent · Avg confidence: 92%`);
    showToast('success', 'Scan Complete', `${present + late} of ${STUDENTS.length} students identified`);
  }, 2500);
}

function updateThreshold(val) {
  document.getElementById('thresholdLabel').textContent = `${val}%`;
}

// =========================================================
// SECTION 8: AI SUGGESTIONS
// =========================================================

function renderSuggestions() {
  const container = document.getElementById('suggestionsContainer');
  if (!container) return;
  container.innerHTML = '';

  const active = AI_SUGGESTIONS.filter(s => !s.dismissed);
  active.forEach(s => {
    const card = document.createElement('div');
    card.className = 'suggestion-card';
    card.id = `sugg-${s.id}`;
    card.innerHTML = `
      <div class="suggestion-card-header">
        <div class="sugg-type-icon" style="background: ${s.iconBg}">${s.icon}</div>
        <div class="sugg-header-text">
          <div class="sugg-title">${s.title}</div>
          <div class="sugg-category">${s.category}</div>
        </div>
        <span class="sugg-priority-badge priority-${s.priority}">${capitalize(s.priority)}</span>
      </div>
      <div class="sugg-body">${s.body}</div>
      <div class="sugg-context">📊 ${s.context}</div>
      <div class="sugg-actions">
        <button class="sugg-action-btn sugg-action-dismiss" onclick="dismissSuggestion('${s.id}')">Dismiss</button>
        <button class="sugg-action-btn sugg-action-apply" onclick="applySuggestion('${s.id}')">Apply Suggestion</button>
      </div>
    `;
    container.appendChild(card);
  });

  if (active.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-muted);">
      <div style="font-size:2rem; margin-bottom:12px">✅</div>
      <div style="font-weight:600; color:var(--text-secondary)">No active suggestions</div>
      <div style="font-size:0.78rem; margin-top:6px">All recommendations reviewed · Session dynamics stable</div>
    </div>`;
  }
}

function renderDashboardSuggestions() {
  const container = document.getElementById('dashboardSuggestions');
  if (!container) return;
  container.innerHTML = '';
  AI_SUGGESTIONS.slice(0, 3).forEach(s => {
    const item = document.createElement('div');
    item.className = 'suggestion-mini';
    item.onclick = () => navigateTo('suggestions', document.querySelector('[data-page=suggestions]'));
    item.innerHTML = `
      <div class="sugg-mini-icon" style="background: ${s.iconBg}">${s.icon}</div>
      <div>
        <div class="sugg-mini-title">${s.title.split('—')[0].trim()}</div>
        <div class="sugg-mini-text">${s.body.substring(0, 70)}...</div>
      </div>
    `;
    container.appendChild(item);
  });
}

function dismissSuggestion(id) {
  const sug = AI_SUGGESTIONS.find(s => s.id === id);
  if (sug) sug.dismissed = true;
  const card = document.getElementById(`sugg-${id}`);
  if (card) { card.style.opacity = '0'; card.style.transform = 'translateX(20px)'; setTimeout(() => renderSuggestions(), 300); }
  showToast('info', 'Suggestion Dismissed', 'Recommendation marked as reviewed');
}

function applySuggestion(id) {
  const sug = AI_SUGGESTIONS.find(s => s.id === id);
  if (sug) { sug.dismissed = true; }
  addLogEntry('ai', '🤖', `Applied: ${sug ? sug.title.split('—')[0].trim() : 'AI Suggestion'}`, 'Instructor action logged');
  const card = document.getElementById(`sugg-${id}`);
  if (card) { card.style.border = '1px solid rgba(16,185,129,0.5)'; card.style.background = 'rgba(16,185,129,0.05)'; setTimeout(() => renderSuggestions(), 500); }
  showToast('success', 'Suggestion Applied', 'Teaching adjustment logged to session record');
}

function refreshSuggestions() {
  AI_SUGGESTIONS.forEach(s => { s.dismissed = false; });
  document.getElementById('aiConfidenceVal').textContent = `${85 + Math.floor(Math.random()*10)}%`;
  renderSuggestions();
  showToast('info', 'Suggestions Refreshed', 'AI engine re-analyzed current session dynamics');
}

function renderPriorityBars() {
  const container = document.getElementById('priorityBars');
  if (!container) return;
  const priorities = [
    { label: 'Critical', count: 1, max: 6, color: '#EF4444' },
    { label: 'High',     count: 2, max: 6, color: '#F59E0B' },
    { label: 'Medium',   count: 2, max: 6, color: '#06B6D4' },
    { label: 'Low',      count: 1, max: 6, color: '#10B981' },
  ];
  container.innerHTML = priorities.map(p => `
    <div class="pbar-item">
      <div class="pbar-label"><span>${p.label}</span><span>${p.count}</span></div>
      <div class="pbar-track"><div class="pbar-fill" style="width:${(p.count/p.max)*100}%; background:${p.color}"></div></div>
    </div>
  `).join('');
}

function renderSuggHistoryList() {
  const container = document.getElementById('suggHistoryList');
  if (!container) return;
  container.innerHTML = SUGGESTION_HISTORY.map(h => `
    <div class="history-item">
      <div class="hist-time">${h.time}</div>
      ${h.text}
    </div>
  `).join('');
}

// =========================================================
// SECTION 9: STUDENTS GRID
// =========================================================

function renderStudentsGrid() {
  const grid = document.getElementById('studentsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  STUDENTS.forEach(s => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.dataset.name = s.name.toLowerCase();
    card.dataset.engagement = s.engagement;
    card.dataset.attendance = s.attendance;
    card.onclick = () => openStudentModal(s);
    card.innerHTML = `
      <div class="student-card-header">
        <div class="student-avatar" style="background: linear-gradient(135deg, ${s.color}, ${shiftColor(s.color)})">
          ${s.initials}
          <div class="student-avatar-status" style="background: ${{present:'#10B981',late:'#F59E0B',absent:'#EF4444'}[s.status]}"></div>
        </div>
        <div>
          <div class="student-name">${s.name}</div>
          <div class="student-id">${s.id}</div>
          <div class="student-status" style="color:${{present:'#10B981',late:'#F59E0B',absent:'#EF4444'}[s.status]}">${capitalize(s.status)}</div>
        </div>
      </div>
      <div class="student-metrics">
        <div class="metric-block">
          <div class="metric-val" style="color:${engColor(s.engagement)}">${s.engagement}%</div>
          <div class="metric-lbl">Engagement</div>
        </div>
        <div class="metric-block">
          <div class="metric-val" style="color:${engColor(s.attention)}">${s.attention}%</div>
          <div class="metric-lbl">Attention</div>
        </div>
        <div class="metric-block">
          <div class="metric-val" style="color:${engColor(s.attendance)}">${s.attendance}%</div>
          <div class="metric-lbl">Attendance</div>
        </div>
      </div>
      <div class="engagement-bar-track">
        <div class="engagement-bar-fill" style="width:${s.engagement}%"></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterStudents(query) {
  document.querySelectorAll('.student-card').forEach(card => {
    card.style.display = card.dataset.name.includes(query.toLowerCase()) ? '' : 'none';
  });
}

function sortStudentList() {
  const val = document.getElementById('sortStudents').value;
  const grid = document.getElementById('studentsGrid');
  const cards = Array.from(grid.querySelectorAll('.student-card'));
  cards.sort((a, b) => {
    if (val === 'name') return a.dataset.name.localeCompare(b.dataset.name);
    if (val === 'engagement') return parseFloat(b.dataset.engagement) - parseFloat(a.dataset.engagement);
    if (val === 'attendance') return parseFloat(b.dataset.attendance) - parseFloat(a.dataset.attendance);
    return 0;
  });
  cards.forEach(c => grid.appendChild(c));
}

// =========================================================
// SECTION 10: STUDENT MODAL
// =========================================================

function openStudentModal(s) {
  const modal = document.getElementById('studentModal');
  const content = document.getElementById('modalContent');

  const trend = generateEngagementSeries(6, parseInt(s.id.slice(1)));
  const trendStr = trend.map(v => {
    const bar = '█'.repeat(Math.round(v/10));
    return `<span style="color:${engColor(v)}">${v}%</span>`;
  }).join(' → ');

  content.innerHTML = `
    <div class="modal-student-header">
      <div class="modal-avatar" style="background: linear-gradient(135deg, ${s.color}, ${shiftColor(s.color)})">${s.initials}</div>
      <div>
        <div class="modal-name">${s.name}</div>
        <div class="modal-sub">${s.id} · CS301 — Machine Learning · <span style="color:${{present:'#10B981',late:'#F59E0B',absent:'#EF4444'}[s.status]}">${capitalize(s.status)}</span></div>
        <div class="modal-sub" style="margin-top:4px">Entry: ${s.entryTime} · ${s.sessions} sessions attended</div>
      </div>
    </div>
    <div class="modal-stats-grid">
      <div class="modal-stat">
        <div class="modal-stat-val" style="color:${engColor(s.engagement)}">${s.engagement}%</div>
        <div class="modal-stat-lbl">Avg Engagement</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-val" style="color:${engColor(s.attention)}">${s.attention}%</div>
        <div class="modal-stat-lbl">Avg Attention</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-val" style="color:${engColor(s.attendance)}">${s.attendance}%</div>
        <div class="modal-stat-lbl">Attendance Rate</div>
      </div>
    </div>
    <div class="modal-section-title">Session Engagement Trend</div>
    <div style="background:var(--bg-surface);border-radius:var(--radius-md);padding:12px;font-family:'JetBrains Mono',monospace;font-size:0.75rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      ${trendStr}
    </div>
    <div class="modal-section-title">Behavioral Indicators</div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${renderModalBar('Head Pose Forward', Math.round(s.attention * 1.05))}
      ${renderModalBar('Interaction Rate', Math.round(s.engagement * 0.25))}
      ${renderModalBar('Inactivity Flags', Math.round((100 - s.engagement) * 0.4))}
    </div>
    <div class="modal-section-title">AI Assessment</div>
    <div style="background:var(--bg-surface);border-radius:var(--radius-md);padding:12px;font-size:0.8rem;color:var(--text-secondary);line-height:1.6;border-left:3px solid var(--accent-violet);">
      ${getStudentAIAssessment(s)}
    </div>
  `;

  modal.classList.add('open');
}

function renderModalBar(label, value) {
  const v = Math.min(100, Math.max(0, value));
  return `
    <div>
      <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px">
        <span>${label}</span><span style="color:${engColor(v)};font-weight:600">${v}%</span>
      </div>
      <div style="height:5px;background:#E2E8F0;border-radius:999px;overflow:hidden">
        <div style="height:100%;width:${v}%;background:var(--gradient-primary);border-radius:999px;transition:width 0.8s ease"></div>
      </div>
    </div>
  `;
}

function getStudentAIAssessment(s) {
  if (s.engagement >= 85) return `🟢 <strong>${s.name}</strong> demonstrates consistently high engagement and attention. Active participation signals detected across multiple sessions. No intervention recommended — maintain current teaching approach for this student.`;
  if (s.engagement >= 70) return `🟡 <strong>${s.name}</strong> shows moderate engagement with room for improvement. Consider targeted questions or group work assignments to boost involvement. Attendance is satisfactory.`;
  return `🔴 <strong>${s.name}</strong> shows below-average engagement and attention patterns. Frequent inactivity flags detected. Immediate instructor attention recommended — consider one-on-one check-in or study support referral.`;
}

function closeModal(event) {
  if (event.target === document.getElementById('studentModal')) closeStudentModal();
}

function closeStudentModal() {
  document.getElementById('studentModal').classList.remove('open');
}

// =========================================================
// SECTION 11: SESSION LOG
// =========================================================

function renderSessionLog() {
  const timeline = document.getElementById('logTimeline');
  if (!timeline) return;
  timeline.innerHTML = '';
  [...SESSION_LOG].reverse().forEach(entry => {
    const el = document.createElement('div');
    el.className = 'log-entry';
    el.innerHTML = `
      <div class="log-entry-left">
        <span class="log-time">${entry.time}</span>
        <div class="log-dot-line"></div>
      </div>
      <div class="log-icon" style="background: ${hexToRgba2(entry.tagColor, 0.15)}">${entry.icon}</div>
      <div class="log-entry-body">
        <div class="log-title">${entry.title}</div>
        <div class="log-detail">${entry.detail}</div>
        <span class="log-tag" style="background:${hexToRgba2(entry.tagColor, 0.15)};color:${entry.tagColor}">${capitalize(entry.type)}</span>
      </div>
    `;
    timeline.appendChild(el);
  });
}

function addLogEntry(type, icon, title, detail) {
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const colors = { system:'#06B6D4', attendance:'#10B981', engagement:'#7C3AED', ai:'#EC4899', alert:'#EF4444' };
  SESSION_LOG.push({ time, title, detail, type, icon, tagColor: colors[type] || '#8892B0' });
  if (AppState.currentPage === 'session') renderSessionLog();
  addActivityFeedItem(icon, title, time);
}

function clearLog() {
  SESSION_LOG = SESSION_LOG.slice(-2);
  renderSessionLog();
  showToast('info', 'Log Cleared', 'Session event log has been cleared');
}

function renderSessionStats() {
  const container = document.getElementById('sessionStatsList');
  if (!container) return;
  const present = STUDENTS.filter(s => s.status === 'present').length;
  const late    = STUDENTS.filter(s => s.status === 'late').length;
  const absent  = STUDENTS.filter(s => s.status === 'absent').length;
  container.innerHTML = `
    <div class="stat-row"><span>Total Events</span><strong>${SESSION_LOG.length}</strong></div>
    <div class="stat-row"><span>Attendance Events</span><strong>${SESSION_LOG.filter(e=>e.type==='attendance').length}</strong></div>
    <div class="stat-row"><span>Engagement Events</span><strong>${SESSION_LOG.filter(e=>e.type==='engagement').length}</strong></div>
    <div class="stat-row"><span>AI Suggestions</span><strong>${SESSION_LOG.filter(e=>e.type==='ai').length}</strong></div>
    <div class="stat-row"><span>Alerts</span><strong>${SESSION_LOG.filter(e=>e.type==='alert').length}</strong></div>
    <div class="stat-row"><span>Students Present</span><strong>${present}</strong></div>
    <div class="stat-row"><span>Late</span><strong style="color:var(--accent-amber)">${late}</strong></div>
    <div class="stat-row"><span>Absent</span><strong style="color:var(--accent-red)">${absent}</strong></div>
  `;
}

// =========================================================
// SECTION 12: ACTIVITY FEED
// =========================================================

let feedItems = [];

function renderActivityFeed() {
  const feed = document.getElementById('activityFeed');
  if (!feed) return;

  const items = [
    { dot: '#10B981', text: 'Aisha Patel marked present · Confidence 97%', time: '09:02' },
    { dot: '#7C3AED', text: 'Engagement peak detected · 94% class attention', time: '09:08' },
    { dot: '#F59E0B', text: 'James Okafor entered late · 18 min delay', time: '09:18' },
    { dot: '#EC4899', text: 'AI suggestion generated · Pacing adjustment', time: '09:15' },
    { dot: '#EF4444', text: 'Inactivity alert · 4 students flagged', time: '09:22' },
    { dot: '#06B6D4', text: 'Audio spike · Q&A interaction detected', time: '09:25' },
  ];

  feed.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'activity-item';
    el.innerHTML = `
      <div class="feed-dot" style="background:${item.dot}"></div>
      <div class="feed-text">${item.text}</div>
      <div class="feed-time">${item.time}</div>
    `;
    feed.appendChild(el);
  });
}

function addActivityFeedItem(icon, text, time) {
  const feed = document.getElementById('activityFeed');
  if (!feed) return;
  const el = document.createElement('div');
  el.className = 'activity-item';
  el.innerHTML = `
    <div class="feed-dot" style="background:#7C3AED"></div>
    <div class="feed-text">${icon} ${text}</div>
    <div class="feed-time">${time}</div>
  `;
  feed.insertBefore(el, feed.firstChild);
  if (feed.children.length > 10) feed.removeChild(feed.lastChild);
}

// =========================================================
// SECTION 13: SIGNAL BARS
// =========================================================

function renderSignalBars() {
  const container = document.getElementById('signalBars');
  if (!container) return;
  const signals = [
    { label: 'Head Pose', value: SIGNALS.headPose.value,   color: '#7C3AED' },
    { label: 'Movement',  value: SIGNALS.movement.value,   color: '#06B6D4' },
    { label: 'Audio',     value: SIGNALS.audio.value,      color: '#10B981' },
    { label: 'Attention', value: SIGNALS.headPose.value - 14, color: '#EC4899' },
    { label: 'Inactivity',value: SIGNALS.inactivity.value, color: '#F59E0B' },
  ];
  container.innerHTML = signals.map(s => `
    <div class="signal-bar-item">
      <div class="signal-bar-label">
        <span>${s.label}</span><span style="color:${s.color}">${s.value}%</span>
      </div>
      <div class="signal-bar-track">
        <div class="signal-bar-fill" style="width:${s.value}%; background:linear-gradient(90deg, ${s.color}88, ${s.color})"></div>
      </div>
    </div>
  `).join('');
}

// =========================================================
// SECTION 14: DONUT LEGEND
// =========================================================

function renderDonutLegend() {
  const present = STUDENTS.filter(s => s.status === 'present').length;
  const late    = STUDENTS.filter(s => s.status === 'late').length;
  const absent  = STUDENTS.filter(s => s.status === 'absent').length;
  const dlP = document.getElementById('dlPresent');
  const dlL = document.getElementById('dlLate');
  const dlA = document.getElementById('dlAbsent');
  if (dlP) dlP.textContent = present;
  if (dlL) dlL.textContent = late;
  if (dlA) dlA.textContent = absent;
}

// =========================================================
// SECTION 15: ENGAGEMENT HEATMAP
// =========================================================

function renderHeatmap() {
  const container = document.getElementById('heatmapContainer');
  if (!container) return;

  let html = '<table class="heatmap-table"><thead><tr><th>Student</th>';
  HEATMAP_SEGMENTS.forEach(seg => { html += `<th>${seg}</th>`; });
  html += '</tr></thead><tbody>';

  HEATMAP_STUDENTS.forEach((student, si) => {
    html += `<tr><td style="text-align:left;color:var(--text-secondary);font-weight:500;padding:4px 8px;white-space:nowrap">${student}</td>`;
    HEATMAP_DATA[si].forEach(val => {
      const bg = heatColor(val);
      html += `<td style="background:${bg};border-radius:4px" title="${val}%">${val}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

function heatColor(val) {
  if (val >= 85) return 'rgba(16,185,129,0.7)';
  if (val >= 70) return 'rgba(16,185,129,0.45)';
  if (val >= 55) return 'rgba(245,158,11,0.55)';
  if (val >= 40) return 'rgba(239,68,68,0.45)';
  return 'rgba(239,68,68,0.7)';
}

// =========================================================
// SECTION 16: SIGNAL CARDS (ENGAGEMENT PAGE)
// =========================================================

function updateSignalCards() {
  const sigs = [
    { id: 'headPose',   val: SIGNALS.headPose.value,   gaugeId: 'headPoseGauge',   valId: 'headPoseVal',   statusId: 'headPoseStatus',   c1: '#7C3AED', c2: '#A78BFA' },
    { id: 'movement',   val: SIGNALS.movement.value,   gaugeId: 'movementGauge',   valId: 'movementVal',   statusId: 'movementStatus',   c1: '#06B6D4', c2: '#67E8F9' },
    { id: 'inactivity', val: SIGNALS.inactivity.value, gaugeId: 'inactivityGauge', valId: 'inactivityVal', statusId: 'inactivityStatus', c1: '#F59E0B', c2: '#FCD34D' },
    { id: 'audio',      val: SIGNALS.audio.value,      gaugeId: 'audioGauge',      valId: 'audioVal',      statusId: 'audioStatus',      c1: '#10B981', c2: '#6EE7B7' },
  ];

  sigs.forEach(s => {
    const valEl    = document.getElementById(s.valId);
    const statusEl = document.getElementById(s.statusId);
    if (valEl) valEl.textContent = `${s.val}%`;
    if (statusEl) {
      const status = s.val >= 70 ? 'Good' : s.val >= 45 ? 'Moderate' : 'Low';
      statusEl.textContent = status;
      statusEl.style.color = s.val >= 70 ? '#10B981' : s.val >= 45 ? '#F59E0B' : '#EF4444';
    }
    drawGauge(s.gaugeId, s.val, s.c1, s.c2);
  });
}

// =========================================================
// SECTION 17: REPORTS PAGE
// =========================================================

function renderTopPerformers() {
  const container = document.getElementById('topPerformersList');
  if (!container) return;
  const sorted = [...STUDENTS].sort((a,b) => b.engagement - a.engagement).slice(0,5);
  container.innerHTML = sorted.map((s, i) => `
    <div class="performer-item">
      <span class="performer-rank">${i+1}</span>
      <div class="roster-avatar" style="width:24px;height:24px;font-size:0.6rem;background:${s.color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;flex-shrink:0">${s.initials}</div>
      <span class="performer-name">${s.name}</span>
      <span class="performer-score" style="color:${engColor(s.engagement)}">${s.engagement}%</span>
    </div>
  `).join('');
}

function renderAtRiskList() {
  const container = document.getElementById('atRiskList');
  if (!container) return;
  const atRisk = STUDENTS.filter(s => s.engagement < 65 || s.attendance < 70).slice(0, 5);
  container.innerHTML = atRisk.map(s => `
    <div class="at-risk-item">
      <span class="risk-icon">⚠️</span>
      <span class="risk-name">${s.name}</span>
      <span class="risk-score">Eng: ${s.engagement}% · Att: ${s.attendance}%</span>
    </div>
  `).join('');
}

function generateFullReport() {
  showToast('success', 'Report Generated', 'Session analytics report ready for download');
  setTimeout(() => {
    addLogEntry('system', '📄', 'Report Generated', 'Full session analytics report exported');
  }, 500);
}

// =========================================================
// SECTION 18: LIVE SIMULATION TICK
// =========================================================

function liveTick() {
  if (!AppState.sessionActive) return;

  // Randomly fluctuate signals
  SIGNALS.headPose.value   = clamp(SIGNALS.headPose.value   + rand(-5, 6), 40, 98);
  SIGNALS.movement.value   = clamp(SIGNALS.movement.value   + rand(-4, 5), 20, 80);
  SIGNALS.inactivity.value = clamp(SIGNALS.inactivity.value + rand(-3, 4), 5,  50);
  SIGNALS.audio.value      = clamp(SIGNALS.audio.value      + rand(-4, 5), 5,  45);

  // Update KPI cards
  const engVal = Math.round((SIGNALS.headPose.value + SIGNALS.audio.value * 1.5) / 2);
  const attVal = SIGNALS.headPose.value;
  document.getElementById('kpiEngagement').innerHTML = `${engVal}<span class="kpi-unit">%</span>`;
  document.getElementById('kpiAttention').innerHTML  = `${attVal}<span class="kpi-unit">%</span>`;
  document.getElementById('kpiAudio').innerHTML      = `${SIGNALS.audio.value}<span class="kpi-unit">%</span>`;

  // Update charts
  liveUpdateEngagementChart();
  renderSignalBars();

  if (AppState.currentPage === 'engagement') updateSignalCards();

  // Randomly generate activity events
  if (Math.random() < 0.3) {
    const events = [
      { type: 'engagement', icon: '📊', title: 'Engagement Update', detail: `Class avg: ${engVal}% · Signal fusion complete` },
      { type: 'attendance',  icon: '👁️', title: 'Presence Scan', detail: `${STUDENTS.filter(s=>s.status==='present').length} students active in frame` },
      { type: 'ai',          icon: '🤖', title: 'AI Analysis', detail: 'Session dynamics re-evaluated · Suggestions updated' },
    ];
    const ev = events[Math.floor(Math.random() * events.length)];
    addLogEntry(ev.type, ev.icon, ev.title, ev.detail);
    if (AppState.currentPage === 'session') { renderSessionLog(); renderSessionStats(); }
  }
}

// =========================================================
// SECTION 19: TOAST NOTIFICATIONS
// =========================================================

function showToast(type, title, message) {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌', system: '🤖' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// =========================================================
// SECTION 20: EXPORT
// =========================================================

function exportReport() {
  const data = STUDENTS.map(s => `${s.id},${s.name},${s.status},${s.entryTime},${s.engagement}%,${s.attention}%,${s.attendance}%`).join('\n');
  const csv = `ID,Name,Status,Entry Time,Engagement,Attention,Attendance\n${data}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `maea_attendance_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('success', 'Export Complete', 'Attendance CSV downloaded successfully');
}

function generateAttendanceReport() { exportReport(); }

// =========================================================
// SECTION 21: UTILITY FUNCTIONS
// =========================================================

function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }

function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function engColor(val) {
  if (val >= 80) return '#10B981';
  if (val >= 60) return '#F59E0B';
  return '#EF4444';
}

function shiftColor(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgb(${Math.min(255,r+40)},${Math.min(255,g+20)},${Math.min(255,b+60)})`;
}

function hexToRgba2(color, alpha) {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1,3),16);
    const g = parseInt(color.slice(3,5),16);
    const b = parseInt(color.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}
