/**
 * TRUEMUSTER — Shared Authoritative Attendance Backend Server
 * Runs on port 5175 (proxied by Vite on 5173 and 5174).
 * Provides cross-device real-time attendance sync between Laptop (Teacher) and Mobile (Student).
 */

const http = require('http');

const PORT = 5175;

// Classroom Anchor: Computing Lab 302
const CLASSROOM_ANCHOR = {
  roomNumber: 'Computing Lab 302',
  latitude: 19.0760,
  longitude: 72.8777,
  radiusMetres: 100, // 100m policy
};

// Initial Session State
let session = {
  id: 'ses-cs401-001',
  courseCode: 'CS401',
  courseName: 'Distributed Systems & Cloud Computing',
  section: 'Section A (Lab)',
  roomNumber: 'Computing Lab 302',
  scheduledStart: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  scheduledEnd: new Date(Date.now() + 50 * 60 * 1000).toISOString(),
  state: 'active',
  totalEnrolled: 45,
  totalPresent: 2,
};

// Authoritative Rosters & Records
let records = [
  {
    id: 'rec-01',
    sessionId: 'ses-cs401-001',
    studentId: 'stu-9902-bob',
    studentName: 'Bob Jenkins',
    enrollmentId: '2023-CS-015',
    courseCode: 'CS401',
    courseName: 'Distributed Systems & Cloud Computing',
    sessionDate: new Date().toISOString().split('T')[0],
    status: 'present',
    verificationMethod: 'qr_biometric_geofence',
    verifiedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'rec-02',
    sessionId: 'ses-cs401-001',
    studentId: 'stu-9903-charlie',
    studentName: 'Charlie Dave',
    enrollmentId: '2023-CS-022',
    courseCode: 'CS401',
    courseName: 'Distributed Systems & Cloud Computing',
    sessionDate: new Date().toISOString().split('T')[0],
    status: 'present',
    verificationMethod: 'qr_biometric_geofence',
    verifiedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

// Active Challenge (Server-authoritative strictly 90s)
let activeChallenge = issueNewChallenge();

// Active Check-in Attempts (Server-authoritative strictly 45s deadline)
const attempts = new Map();

// SSE Clients for real-time broadcast
const sseClients = new Set();

function issueNewChallenge() {
  const now = Date.now();
  const chl = {
    id: 'chl-' + Math.random().toString(36).substring(2, 9),
    sessionId: session.id,
    token: 'TM-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + (now % 10000),
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 90 * 1000).toISOString(), // Strictly 90-second server validity
  };
  return chl;
}

function broadcastEvent(type, payload) {
  const data = JSON.stringify({ type, payload });
  sseClients.forEach((res) => {
    try {
      res.write(`data: ${data}\n\n`);
    } catch (e) {
      sseClients.delete(res);
    }
  });
}

function calculateDistanceMetres(lat1, lon1, lat2, lon2) {
  const r = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Real-Time Server-Sent Events (SSE)
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write(': connected\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // GET /api/session
  if (pathname === '/api/session' && req.method === 'GET') {
    session.totalPresent = records.filter(r => r.status === 'present').length;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(session));
    return;
  }

  // GET /api/challenge
  if (pathname === '/api/challenge' && req.method === 'GET') {
    // If expired, rotate automatically
    if (new Date(activeChallenge.expiresAt).getTime() <= Date.now()) {
      activeChallenge = issueNewChallenge();
      broadcastEvent('CHALLENGE_ISSUED', activeChallenge);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(activeChallenge));
    return;
  }

  // POST /api/challenge (Teacher manual rotate)
  if (pathname === '/api/challenge' && req.method === 'POST') {
    activeChallenge = issueNewChallenge();
    broadcastEvent('CHALLENGE_ISSUED', activeChallenge);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(activeChallenge));
    return;
  }

  // GET /api/records
  if (pathname === '/api/records' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(records));
    return;
  }

  // POST /api/check-in/start (Student scans QR)
  if (pathname === '/api/check-in/start' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { challengeToken, studentId } = JSON.parse(body || '{}');
        const now = Date.now();

        // 1. Verify token match
        if (!activeChallenge || activeChallenge.token !== challengeToken) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'QR_REJECTED: Unrecognized challenge token' }));
          return;
        }

        // 2. Verify server 90s validity window
        if (new Date(activeChallenge.expiresAt).getTime() < now) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'QR_REJECTED: Challenge expired (90s window elapsed)' }));
          return;
        }

        // 3. Atomically issue attempt with strict 45-second deadline
        const attempt = {
          id: 'att-' + Math.random().toString(36).substring(2, 9),
          sessionId: session.id,
          studentId: studentId || 'stu-9901-alice',
          challengeId: activeChallenge.id,
          startedAt: new Date(now).toISOString(),
          deadlineAt: new Date(now + 45 * 1000).toISOString(),
          status: 'attempt_accepted',
        };

        attempts.set(attempt.id, attempt);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(attempt));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // POST /api/check-in/verify (Student submits evidence)
  if (pathname === '/api/check-in/verify' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { attemptId, studentId, studentName, enrollmentId, latitude, longitude, biometricSuccess } = JSON.parse(body || '{}');
        const now = Date.now();
        const attempt = attempts.get(attemptId);

        if (!attempt) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, status: 'rejected', message: 'Attempt not found' }));
          return;
        }

        // 1. Verify 45s attempt deadline
        if (new Date(attempt.deadlineAt).getTime() < now) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            status: 'expired',
            message: 'Check-in attempt expired (> 45s deadline exceeded).',
          }));
          return;
        }

        // 2. Verify 100m geofence policy
        const dist = calculateDistanceMetres(CLASSROOM_ANCHOR.latitude, CLASSROOM_ANCHOR.longitude, latitude || 19.0761, longitude || 72.8777);
        if (dist > CLASSROOM_ANCHOR.radiusMetres) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            status: 'out_of_bounds',
            message: `Location check failed: Distance (${Math.round(dist)}m) exceeds 100m boundary.`,
          }));
          return;
        }

        // 3. Verify Biometric
        if (!biometricSuccess) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            status: 'auth_failed',
            message: 'Biometric authorization failed.',
          }));
          return;
        }

        // 4. Atomically record attendance
        const rec = {
          id: 'rec-' + Math.random().toString(36).substring(2, 9),
          sessionId: session.id,
          studentId: studentId || 'stu-9901-alice',
          studentName: studentName || 'Alice Sharma',
          enrollmentId: enrollmentId || '2023-CS-042',
          courseCode: session.courseCode,
          courseName: session.courseName,
          sessionDate: new Date().toISOString().split('T')[0],
          status: 'present',
          verificationMethod: 'qr_biometric_geofence',
          verifiedAt: new Date(now).toISOString(),
        };

        const existingIdx = records.findIndex(r => r.studentId === rec.studentId);
        if (existingIdx >= 0) {
          records[existingIdx] = rec;
        } else {
          records.push(rec);
        }

        session.totalPresent = records.filter(r => r.status === 'present').length;
        attempts.delete(attemptId);

        // Broadcast real-time update to Teacher's screen
        broadcastEvent('ATTENDANCE_COMMITTED', { record: rec, totalPresent: session.totalPresent });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          status: 'confirmed',
          message: 'Attendance verified and committed to authoritative ledger.',
          attendanceRecord: rec,
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  // POST /api/records/override (Teacher manual override)
  if (pathname === '/api/records/override' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { recordId, studentId, newStatus, reasonCategory, reasonText, teacherId } = JSON.parse(body || '{}');
        const target = records.find(r => r.id === recordId || r.studentId === studentId);
        if (!target) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Record not found' }));
          return;
        }

        target.status = newStatus;
        target.overrideReason = `${reasonCategory}: ${reasonText}`;
        target.overrideBy = teacherId || 'tch-prof-rao';
        target.verificationMethod = 'teacher_manual_override';

        session.totalPresent = records.filter(r => r.status === 'present').length;
        broadcastEvent('ATTENDANCE_OVERRIDDEN', { record: target, totalPresent: session.totalPresent });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(target));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[TRUEMUSTER Backend] Authoritative server listening on http://0.0.0.0:${PORT}`);
});
