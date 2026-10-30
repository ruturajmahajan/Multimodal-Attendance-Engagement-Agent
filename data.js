// ============================================================
// data.js — MAEA Simulation Data & State
// ============================================================

// ---- Student Roster ----
const STUDENTS = [
  { id: 'S001', name: 'Aisha Patel',      initials: 'AP', color: '#7C3AED', status: 'present', entryTime: '09:02', attendance: 96, engagement: 88, attention: 82, sessions: 24 },
  { id: 'S002', name: 'Marcus Chen',      initials: 'MC', color: '#06B6D4', status: 'present', entryTime: '09:01', attendance: 100,engagement: 91, attention: 88, sessions: 25 },
  { id: 'S003', name: 'Sofia Müller',     initials: 'SM', color: '#10B981', status: 'present', entryTime: '09:05', attendance: 88, engagement: 79, attention: 74, sessions: 22 },
  { id: 'S004', name: 'James Okafor',     initials: 'JO', color: '#F59E0B', status: 'late',    entryTime: '09:18', attendance: 76, engagement: 65, attention: 60, sessions: 19 },
  { id: 'S005', name: 'Yuki Tanaka',      initials: 'YT', color: '#EC4899', status: 'present', entryTime: '09:03', attendance: 92, engagement: 85, attention: 80, sessions: 23 },
  { id: 'S006', name: 'Liam Rodriguez',   initials: 'LR', color: '#8B5CF6', status: 'absent',  entryTime: '--',   attendance: 60, engagement: 55, attention: 50, sessions: 15 },
  { id: 'S007', name: 'Priya Singh',      initials: 'PS', color: '#14B8A6', status: 'present', entryTime: '09:00', attendance: 100,engagement: 94, attention: 90, sessions: 25 },
  { id: 'S008', name: 'Noah Williams',    initials: 'NW', color: '#F97316', status: 'present', entryTime: '09:04', attendance: 84, engagement: 72, attention: 68, sessions: 21 },
  { id: 'S009', name: 'Emma Johnson',     initials: 'EJ', color: '#06B6D4', status: 'late',    entryTime: '09:22', attendance: 72, engagement: 60, attention: 55, sessions: 18 },
  { id: 'S010', name: 'Ali Hassan',       initials: 'AH', color: '#7C3AED', status: 'present', entryTime: '09:01', attendance: 96, engagement: 87, attention: 83, sessions: 24 },
  { id: 'S011', name: 'Sara Johansson',   initials: 'SJ', color: '#10B981', status: 'present', entryTime: '09:03', attendance: 88, engagement: 80, attention: 75, sessions: 22 },
  { id: 'S012', name: 'David Kim',        initials: 'DK', color: '#EF4444', status: 'absent',  entryTime: '--',   attendance: 52, engagement: 48, attention: 42, sessions: 13 },
  { id: 'S013', name: 'Fatima Al-Amin',   initials: 'FA', color: '#8B5CF6', status: 'present', entryTime: '09:02', attendance: 92, engagement: 83, attention: 78, sessions: 23 },
  { id: 'S014', name: 'Carlos Herrera',   initials: 'CH', color: '#F59E0B', status: 'present', entryTime: '09:06', attendance: 80, engagement: 76, attention: 71, sessions: 20 },
  { id: 'S015', name: 'Mei Lin',          initials: 'ML', color: '#14B8A6', status: 'present', entryTime: '09:01', attendance: 100,engagement: 92, attention: 89, sessions: 25 },
  { id: 'S016', name: 'Omar Abdullah',    initials: 'OA', color: '#EC4899', status: 'present', entryTime: '09:04', attendance: 84, engagement: 70, attention: 66, sessions: 21 },
  { id: 'S017', name: 'Anya Kowalski',    initials: 'AK', color: '#7C3AED', status: 'late',    entryTime: '09:25', attendance: 68, engagement: 58, attention: 53, sessions: 17 },
  { id: 'S018', name: 'Rajan Mehta',      initials: 'RM', color: '#06B6D4', status: 'present', entryTime: '09:02', attendance: 96, engagement: 89, attention: 85, sessions: 24 },
  { id: 'S019', name: 'Amelia Foster',    initials: 'AF', color: '#10B981', status: 'present', entryTime: '09:03', attendance: 92, engagement: 82, attention: 77, sessions: 23 },
  { id: 'S020', name: 'Ethan Park',       initials: 'EP', color: '#F97316', status: 'present', entryTime: '09:01', attendance: 100,engagement: 90, attention: 86, sessions: 25 },
  { id: 'S021', name: 'Nadia Ivanova',    initials: 'NI', color: '#8B5CF6', status: 'absent',  entryTime: '--',   attendance: 56, engagement: 50, attention: 45, sessions: 14 },
  { id: 'S022', name: 'Lucas Petit',      initials: 'LP', color: '#F59E0B', status: 'present', entryTime: '09:05', attendance: 84, engagement: 74, attention: 70, sessions: 21 },
  { id: 'S023', name: 'Zara Ahmed',       initials: 'ZA', color: '#14B8A6', status: 'present', entryTime: '09:02', attendance: 96, engagement: 86, attention: 81, sessions: 24 },
  { id: 'S024', name: 'Kevin Nakamura',   initials: 'KN', color: '#EC4899', status: 'present', entryTime: '09:04', attendance: 88, engagement: 77, attention: 73, sessions: 22 },
  { id: 'S025', name: 'Isabel Santos',    initials: 'IS', color: '#7C3AED', status: 'present', entryTime: '09:01', attendance: 100,engagement: 93, attention: 89, sessions: 25 },
  { id: 'S026', name: 'Finn O\'Brien',    initials: 'FO', color: '#06B6D4', status: 'present', entryTime: '09:03', attendance: 92, engagement: 81, attention: 76, sessions: 23 },
  { id: 'S027', name: 'Maya Sharma',      initials: 'MS', color: '#10B981', status: 'present', entryTime: '09:02', attendance: 96, engagement: 88, attention: 84, sessions: 24 },
  { id: 'S028', name: 'Tobias Weber',     initials: 'TW', color: '#EF4444', status: 'present', entryTime: '09:06', attendance: 80, engagement: 69, attention: 64, sessions: 20 },
  { id: 'S029', name: 'Hana Sato',        initials: 'HS', color: '#8B5CF6', status: 'late',    entryTime: '09:20', attendance: 72, engagement: 62, attention: 57, sessions: 18 },
  { id: 'S030', name: 'Ben Osei',         initials: 'BO', color: '#F59E0B', status: 'present', entryTime: '09:01', attendance: 100,engagement: 90, attention: 87, sessions: 25 },
];

// ---- AI Suggestions ----
const AI_SUGGESTIONS = [
  {
    id: 'sug001',
    title: 'Adjust Session Pacing — Engagement Drop Detected',
    category: 'Pacing & Flow',
    icon: '⏱️',
    iconBg: 'rgba(124,58,237,0.15)',
    priority: 'critical',
    body: 'Classroom engagement has dropped 22% in the last 8 minutes, with 12 students showing reduced head-pose orientation and minimal interaction signals. Consider transitioning to an interactive activity to re-energize the group.',
    context: 'Signal data: Head pose forward ratio dropped from 87% → 65%. Audio participation: 4% (below baseline of 18%). 3 students showing repeated inactivity flags (>5 min idle).',
    dismissed: false,
  },
  {
    id: 'sug002',
    title: 'Introduce Peer-Discussion Break',
    category: 'Interaction Design',
    icon: '💬',
    iconBg: 'rgba(6,182,212,0.15)',
    priority: 'high',
    body: 'A 3–5 minute structured peer discussion would likely improve engagement scores. The current session has been lecture-only for 24 minutes — interaction peaks typically occur after discussion breaks.',
    context: 'Historical pattern: Sessions with peer discussion at 25-min mark show avg. 18% higher retention engagement in subsequent segments.',
    dismissed: false,
  },
  {
    id: 'sug003',
    title: 'Address Back-Row Students',
    category: 'Classroom Management',
    icon: '👁️',
    iconBg: 'rgba(245,158,11,0.15)',
    priority: 'high',
    body: 'Students in positions 4–8 (back rows) are showing consistently lower engagement scores. Direct eye contact or targeted questions toward this group may help. Movement detection indicates potential distraction activity.',
    context: 'Engagement delta: Front-row avg 82% vs back-row avg 54%. Inactivity flags: 4 students flagged 3+ times each.',
    dismissed: false,
  },
  {
    id: 'sug004',
    title: 'Recommend Quick Comprehension Check',
    category: 'Assessment',
    icon: '✅',
    iconBg: 'rgba(16,185,129,0.15)',
    priority: 'medium',
    body: 'A 2-question quick poll or hand-raise check on the last topic (Neural Network Backpropagation) would help gauge comprehension and re-focus attention. Audio signals suggest possible confusion — 3 whispered exchanges detected near the 18-min mark.',
    context: 'Topic: Backpropagation introduced at 09:32. No clarification questions received since introduction.',
    dismissed: false,
  },
  {
    id: 'sug005',
    title: 'Reduce Audio Complexity',
    category: 'Delivery Style',
    icon: '🎙️',
    iconBg: 'rgba(236,72,153,0.15)',
    priority: 'medium',
    body: 'Detected instructor speech rate above baseline (estimated 156 wpm vs recommended 120–130 wpm for complex topics). Consider slowing delivery and increasing pause frequency to allow note-taking and processing time.',
    context: 'Audio analysis: 3 extended information-dense segments detected (>3 min without pauses). Student note-taking movement pattern decreased 40% in the last segment.',
    dismissed: false,
  },
  {
    id: 'sug006',
    title: 'Excellent Session Momentum — Maintain Current Flow',
    category: 'Positive Feedback',
    icon: '🚀',
    iconBg: 'rgba(16,185,129,0.15)',
    priority: 'low',
    body: 'The opening 15 minutes showed exceptional engagement (avg 91%). The hands-on coding demonstration generated 3× baseline audio interaction. This format works very well for this class — consider extending interactive segments.',
    context: 'Peak engagement: 09:08–09:15 (94%). Audio participation during demo: 38% vs 18% baseline.',
    dismissed: false,
  },
];

// ---- Session Log Events ----
let SESSION_LOG = [
  { time: '09:00', title: 'Session Started', detail: 'CS301 — Machine Learning · Room 204 · 30 students enrolled', type: 'system',  icon: '🟢', tagColor: '#10B981' },
  { time: '09:01', title: 'Attendance Scan Initiated', detail: 'Face detection model loaded · Threshold: 75%', type: 'system', icon: '📷', tagColor: '#06B6D4' },
  { time: '09:02', title: '21 Students Detected', detail: 'Initial scan complete · Confidence avg: 94%', type: 'attendance', icon: '👥', tagColor: '#10B981' },
  { time: '09:05', title: 'Late Arrivals Detected', detail: 'S004 James Okafor — entered room · 5 min late', type: 'attendance', icon: '⏰', tagColor: '#F59E0B' },
  { time: '09:08', title: 'High Engagement Peak', detail: 'Class engagement reached 94% — coding demo segment', type: 'engagement', icon: '📈', tagColor: '#7C3AED' },
  { time: '09:15', title: 'AI Suggestion Generated', detail: 'Peer-discussion break recommended based on 24-min lecture window', type: 'ai', icon: '🤖', tagColor: '#EC4899' },
  { time: '09:18', title: 'Engagement Decline Detected', detail: 'Avg engagement dropped from 89% → 71% · 8-min window', type: 'engagement', icon: '📉', tagColor: '#F59E0B' },
  { time: '09:22', title: 'Inactivity Alert', detail: '4 students flagged for >5 min inactivity · Positions 5–8', type: 'alert', icon: '⚠️', tagColor: '#EF4444' },
  { time: '09:25', title: 'Audio Interaction Spike', detail: 'Q&A segment · 34% participation rate detected', type: 'engagement', icon: '🎙️', tagColor: '#06B6D4' },
  { time: '09:30', title: 'Attendance Rescan', detail: '24 present · 3 late · 3 absent · All confirmed', type: 'attendance', icon: '✅', tagColor: '#10B981' },
];

// ---- Engagement Time Series ----
function generateEngagementSeries(points = 12, seed = 1) {
  let rng = seed;
  const lcg = () => { rng = (rng * 1664525 + 1013904223) & 0xffffffff; return Math.abs(rng) / 0x7fffffff; };
  const arr = [];
  let val = 65 + lcg() * 15;
  for (let i = 0; i < points; i++) {
    val = Math.max(40, Math.min(98, val + (lcg() - 0.48) * 12));
    arr.push(Math.round(val));
  }
  return arr;
}

const ENGAGEMENT_LABELS = ['09:00','09:05','09:10','09:15','09:20','09:25','09:30','09:35','09:40','09:45','09:50','09:55'];
const ENGAGEMENT_DATA   = generateEngagementSeries(12, 42);
const ATTENTION_DATA    = generateEngagementSeries(12, 77);
const PARTICIPATION_DATA= generateEngagementSeries(12, 13);

// ---- Weekly Attendance ----
const WEEKLY_LABELS     = ['Mon','Tue','Wed','Thu','Fri'];
const WEEKLY_PRESENT    = [28, 25, 29, 24, 27];
const WEEKLY_LATE       = [1,  3,  1,  3,  2];
const WEEKLY_ABSENT     = [1,  2,  0,  3,  1];

// ---- Per-Session Engagement ----
const SESSION_LABELS    = ['S-18','S-19','S-20','S-21','S-22','Current'];
const SESSION_ENG_DATA  = [68, 72, 75, 70, 78, 74];

// ---- Heatmap data: students × time-segments ----
const HEATMAP_STUDENTS = ['Aisha P', 'Marcus C', 'Sofia M', 'James O', 'Yuki T', 'Priya S', 'Noah W', 'Emma J'];
const HEATMAP_SEGMENTS = ['09:00','09:10','09:20','09:30','09:40','09:50'];
const HEATMAP_DATA = [
  [92, 88, 70, 82, 78, 85],
  [95, 91, 88, 90, 86, 89],
  [78, 82, 68, 74, 62, 70],
  [55, 60, 45, 58, 52, 48],
  [88, 84, 79, 81, 77, 83],
  [96, 93, 90, 94, 91, 95],
  [72, 68, 60, 65, 58, 63],
  [50, 55, 42, 48, 40, 45],
];

// ---- Behavioral Signals ----
let SIGNALS = {
  headPose:   { value: 76, label: 'Head Pose', unit: '%', status: 'Good' },
  movement:   { value: 42, label: 'Movement',  unit: '%', status: 'Moderate' },
  inactivity: { value: 28, label: 'Inactivity',unit: '%', status: 'Low' },
  audio:      { value: 18, label: 'Audio',     unit: '%', status: 'Moderate' },
};

// ---- Suggestion History ----
const SUGGESTION_HISTORY = [
  { time: '09:15', text: 'Introduce interactive activity to restore engagement' },
  { time: '09:08', text: 'Excellent pacing detected — maintain current format' },
  { time: '08:55', text: 'Pre-session: Audio check recommended before class start' },
  { time: '08:40', text: 'Previous session: Back-row engagement below threshold' },
];

// ---- App State ----
const AppState = {
  sessionActive: false,
  sessionSeconds: 0,
  sessionTimer: null,
  currentPage: 'dashboard',
  scanActive: false,
  rosterFilter: 'all',
};
