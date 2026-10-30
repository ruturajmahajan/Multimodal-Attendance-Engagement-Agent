// ============================================================
// charts.js — All Chart.js Initializations & Helpers (Light Theme)
// ============================================================

// ---- Chart.js Global Defaults ----
Chart.defaults.color = '#64748B';
Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.06)';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = '#FFFFFF';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(124, 58, 237, 0.2)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.titleColor = '#0F172A';
Chart.defaults.plugins.tooltip.bodyColor = '#475569';
Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 12 };
Chart.defaults.plugins.tooltip.boxPadding = 4;

// ---- Chart Registry ----
const Charts = {};

// ---- Helper: Gradient ----
function makeGradient(ctx, color1, color2, alpha1 = 0.3, alpha2 = 0) {
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0, color1.replace(')', `, ${alpha1})`).replace('rgb(', 'rgba('));
  grad.addColorStop(1, color1.replace(')', `, ${alpha2})`).replace('rgb(', 'rgba('));
  return grad;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---- 1. Engagement Trend Chart ----
function initEngagementTrendChart() {
  const ctx = document.getElementById('engagementTrendChart');
  if (!ctx || Charts.engagementTrend) return;

  const c = ctx.getContext('2d');
  Charts.engagementTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ENGAGEMENT_LABELS,
      datasets: [
        {
          label: 'Engagement',
          data: ENGAGEMENT_DATA,
          borderColor: '#7C3AED',
          backgroundColor: (context) => {
            const chart = context.chart;
            const {ctx: c2, chartArea} = chart;
            if (!chartArea) return 'transparent';
            const grad = c2.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            grad.addColorStop(0, 'rgba(124, 58, 237, 0.22)');
            grad.addColorStop(1, 'rgba(124, 58, 237, 0.01)');
            return grad;
          },
          borderWidth: 2.5, tension: 0.4, fill: true,
          pointBackgroundColor: '#7C3AED', pointRadius: 3, pointHoverRadius: 6,
        },
        {
          label: 'Attention',
          data: ATTENTION_DATA,
          borderColor: '#0891B2',
          backgroundColor: (context) => {
            const chart = context.chart;
            const {ctx: c2, chartArea} = chart;
            if (!chartArea) return 'transparent';
            const grad = c2.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            grad.addColorStop(0, 'rgba(8, 145, 178, 0.15)');
            grad.addColorStop(1, 'rgba(8, 145, 178, 0.01)');
            return grad;
          },
          borderWidth: 2, tension: 0.4, fill: true,
          pointBackgroundColor: '#0891B2', pointRadius: 3, pointHoverRadius: 6,
          borderDash: [6,3],
        },
        {
          label: 'Participation',
          data: PARTICIPATION_DATA,
          borderColor: '#059669',
          backgroundColor: 'transparent',
          borderWidth: 1.5, tension: 0.4, fill: false,
          pointBackgroundColor: '#059669', pointRadius: 2, pointHoverRadius: 5,
          borderDash: [3,3],
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { maxRotation: 0 } },
        y: {
          min: 30, max: 100,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { callback: v => `${v}%` }
        }
      }
    }
  });
}

// ---- 2. Attendance Donut Chart ----
function initAttendanceDonutChart() {
  const ctx = document.getElementById('attendanceDonutChart');
  if (!ctx || Charts.attendanceDonut) return;

  const present = STUDENTS.filter(s => s.status === 'present').length;
  const late    = STUDENTS.filter(s => s.status === 'late').length;
  const absent  = STUDENTS.filter(s => s.status === 'absent').length;

  Charts.attendanceDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Late', 'Absent'],
      datasets: [{
        data: [present, late, absent],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderColor: '#FFFFFF', borderWidth: 3,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw} students`
          }
        }
      }
    }
  });
}

// ---- 3. Attendance Timeline Chart ----
function initAttendanceTimelineChart() {
  const ctx = document.getElementById('attendanceTimelineChart');
  if (!ctx || Charts.attendanceTimeline) return;

  Charts.attendanceTimeline = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['09:00','09:05','09:10','09:15','09:20','09:25','09:30','09:35'],
      datasets: [{
        label: 'Students Entered',
        data: [14, 5, 2, 1, 2, 0, 0, 0],
        backgroundColor: (ctx) => {
          const colors = ['#10B981','#10B981','#F59E0B','#F59E0B','#F59E0B','#EF4444','#EF4444','#EF4444'];
          return colors[ctx.dataIndex] || '#7C3AED';
        },
        borderRadius: 6, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw} students entered` } }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { stepSize: 1 } }
      }
    }
  });
}

// ---- 4. Signal Radar Chart ----
function initSignalRadarChart() {
  const ctx = document.getElementById('signalRadarChart');
  if (!ctx || Charts.signalRadar) return;

  Charts.signalRadar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Head Pose', 'Movement', 'Audio', 'Attention', 'Participation', 'Inactivity'],
      datasets: [{
        label: 'Current Session',
        data: [76, 42, 18, 62, 34, 72],
        borderColor: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.15)',
        borderWidth: 2, pointBackgroundColor: '#7C3AED', pointRadius: 4,
      }, {
        label: 'Session Average',
        data: [80, 45, 22, 68, 38, 65],
        borderColor: '#0891B2', backgroundColor: 'rgba(8, 145, 178, 0.08)',
        borderWidth: 1.5, pointBackgroundColor: '#0891B2', pointRadius: 3,
        borderDash: [5,3],
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: 'rgba(0, 0, 0, 0.08)' },
          angleLines: { color: 'rgba(0, 0, 0, 0.08)' },
          ticks: { display: false },
          pointLabels: { font: { size: 10 }, color: '#64748B' }
        }
      }
    }
  });
}

// ---- 5. Engagement Interval Chart ----
function initEngagementIntervalChart() {
  const ctx = document.getElementById('engagementIntervalChart');
  if (!ctx || Charts.engagementInterval) return;

  Charts.engagementInterval = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0–10m','10–20m','20–30m','30–40m','40–50m','50–60m'],
      datasets: [
        {
          label: 'Engagement',
          data: [91, 88, 65, 72, 69, 74],
          borderColor: '#7C3AED',
          backgroundColor: (context) => {
            const chart = context.chart;
            const {ctx: c2, chartArea} = chart;
            if (!chartArea) return 'transparent';
            const grad = c2.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            grad.addColorStop(0, 'rgba(124, 58, 237, 0.22)');
            grad.addColorStop(1, 'rgba(124, 58, 237, 0.01)');
            return grad;
          },
          borderWidth: 2.5, tension: 0.4, fill: true,
          pointBackgroundColor: '#7C3AED', pointRadius: 5, pointHoverRadius: 8,
        },
        {
          label: 'Threshold',
          data: [70, 70, 70, 70, 70, 70],
          borderColor: 'rgba(220, 38, 38, 0.65)',
          backgroundColor: 'transparent',
          borderWidth: 1.5, borderDash: [6, 4],
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ctx.dataset.label === 'Threshold' ? ' Attention threshold: 70%' : ` Engagement: ${ctx.raw}%`
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } },
        y: {
          min: 40, max: 100,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { callback: v => `${v}%` }
        }
      }
    }
  });
}

// ---- 6. Suggestion Category Chart ----
function initSuggCategoryChart() {
  const ctx = document.getElementById('suggCategoryChart');
  if (!ctx || Charts.suggCategory) return;

  Charts.suggCategory = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pacing', 'Interaction', 'Management', 'Assessment', 'Delivery', 'Positive'],
      datasets: [{
        data: [25, 20, 18, 15, 12, 10],
        backgroundColor: ['#7C3AED','#0891B2','#F59E0B','#10B981','#EC4899','#8B5CF6'],
        borderColor: '#FFFFFF', borderWidth: 3,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: {
        legend: { display: true, position: 'bottom', labels: { boxWidth: 10, padding: 10, font: { size: 10 }, color: '#475569' } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
      }
    }
  });
}

// ---- 7. Event Distribution Chart (Session Log) ----
function initEventDistChart() {
  const ctx = document.getElementById('eventDistChart');
  if (!ctx || Charts.eventDist) return;

  Charts.eventDist = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Attendance', 'Engagement', 'AI', 'Alert', 'System'],
      datasets: [{
        label: 'Events',
        data: [4, 3, 1, 1, 2],
        backgroundColor: ['#10B981','#7C3AED','#EC4899','#EF4444','#0891B2'],
        borderRadius: 6, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { stepSize: 1 } }
      }
    }
  });
}

// ---- 8. Weekly Attendance Chart ----
function initWeeklyAttendanceChart() {
  const ctx = document.getElementById('weeklyAttendanceChart');
  if (!ctx || Charts.weeklyAttendance) return;

  Charts.weeklyAttendance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: WEEKLY_LABELS,
      datasets: [
        { label: 'Present', data: WEEKLY_PRESENT, backgroundColor: '#10B981', borderRadius: 4, stack: 'a' },
        { label: 'Late',    data: WEEKLY_LATE,    backgroundColor: '#F59E0B', borderRadius: 4, stack: 'a' },
        { label: 'Absent',  data: WEEKLY_ABSENT,  backgroundColor: '#EF4444', borderRadius: 4, stack: 'a' },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 14, color: '#475569' } } },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, grid: { color: 'rgba(0, 0, 0, 0.05)' }, max: 32 }
      }
    }
  });
}

// ---- 9. Session Engagement Chart ----
function initSessionEngagementChart() {
  const ctx = document.getElementById('sessionEngagementChart');
  if (!ctx || Charts.sessionEngagement) return;

  Charts.sessionEngagement = new Chart(ctx, {
    type: 'line',
    data: {
      labels: SESSION_LABELS,
      datasets: [{
        label: 'Avg Engagement',
        data: SESSION_ENG_DATA,
        borderColor: '#7C3AED',
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx: c2, chartArea} = chart;
          if (!chartArea) return 'transparent';
          const grad = c2.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, 'rgba(124, 58, 237, 0.22)');
          grad.addColorStop(1, 'rgba(124, 58, 237, 0.01)');
          return grad;
        },
        borderWidth: 2.5, tension: 0.4, fill: true,
        pointBackgroundColor: ['#7C3AED','#7C3AED','#7C3AED','#7C3AED','#7C3AED','#10B981'],
        pointRadius: [3,3,3,3,3,6],
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } },
        y: { min: 55, max: 100, grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { callback: v => `${v}%` } }
      }
    }
  });
}

// ---- Gauge Helper (Half-donut arc) ----
function drawGauge(canvasId, value, color1 = '#7C3AED', color2 = '#0891B2') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = H * 0.9;
  const r = Math.min(W, H * 2) * 0.38;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value arc
  const valAngle = startAngle + (value / 100) * Math.PI;
  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, valAngle);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// ---- Initialize All Charts ----
function initAllCharts() {
  initEngagementTrendChart();
  initAttendanceDonutChart();
  initAttendanceTimelineChart();
  initSignalRadarChart();
  initEngagementIntervalChart();
  initSuggCategoryChart();
  initEventDistChart();
  initWeeklyAttendanceChart();
  initSessionEngagementChart();

  // Gauges
  drawGauge('headPoseGauge',   SIGNALS.headPose.value,   '#7C3AED', '#A78BFA');
  drawGauge('movementGauge',   SIGNALS.movement.value,   '#0891B2', '#67E8F9');
  drawGauge('inactivityGauge', SIGNALS.inactivity.value, '#F59E0B', '#FCD34D');
  drawGauge('audioGauge',      SIGNALS.audio.value,      '#10B981', '#6EE7B7');
}

// ---- Live Update: Engagement Trend ----
function liveUpdateEngagementChart() {
  if (!Charts.engagementTrend) return;
  const chart = Charts.engagementTrend;
  const datasets = chart.data.datasets;

  // Shift and append new simulated values
  datasets.forEach((ds, i) => {
    ds.data.push(Math.max(40, Math.min(98, ds.data[ds.data.length-1] + (Math.random()-0.48)*10)));
    if (ds.data.length > 15) ds.data.shift();
  });

  const now = new Date();
  chart.data.labels.push(`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`);
  if (chart.data.labels.length > 15) chart.data.labels.shift();

  chart.update('none');
}

// ---- Update Engagement View ----
function updateEngagementView() {
  if (Charts.engagementInterval) Charts.engagementInterval.update();
}
