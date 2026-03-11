'use strict';
/**
 * Basic integration tests for server.js
 * Run: node test/server.test.js
 */

const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcryptjs');

// ── helpers ───────────────────────────────────────────────────────────────────
function request(opts, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(opts, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

function post(path, body, token) {
  const payload = JSON.stringify(body);
  const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return request({ hostname: '127.0.0.1', port: 3081, path, method: 'POST', headers }, payload);
}

function get(path, token) {
  const headers = {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return request({ hostname: '127.0.0.1', port: 3081, path, method: 'GET', headers });
}

function put(path, body, token) {
  const payload = JSON.stringify(body);
  const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return request({ hostname: '127.0.0.1', port: 3081, path, method: 'PUT', headers }, payload);
}

// ── test runner ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(desc, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ ${desc}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

// ── setup: inject test env vars ───────────────────────────────────────────────
async function setup() {
  const hash = await bcrypt.hash('testpass123', 10);
  process.env.ADMIN_PASSWORD_HASH = hash;
  process.env.JWT_SECRET           = 'test_secret_xyz_' + Date.now();
  process.env.PORT                 = '3081';

  // Silence server startup log
  const origLog = console.log;
  console.log = () => {};
  require('../server.js');
  console.log = origLog;

  // Wait for server to bind
  await new Promise(r => setTimeout(r, 300));
}

// ── tests ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\nRunning server integration tests...\n');

  // ── Content ───────────────────────────────────────────────────────────────
  console.log('GET /api/content');
  const content = await get('/api/content');
  assert('returns 200',                content.status === 200);
  assert('has stories array',          Array.isArray(content.body.stories));
  assert('has sculptures array',       Array.isArray(content.body.sculptures));
  assert('stories have EN/ES titles',  content.body.stories[0]?.title?.en && content.body.stories[0]?.title?.es);

  // ── Auth ──────────────────────────────────────────────────────────────────
  console.log('\nPOST /api/auth/login');
  const loginOk = await post('/api/auth/login', { password: 'testpass123' });
  assert('correct password → 200',    loginOk.status === 200);
  assert('returns token',             typeof loginOk.body.token === 'string' && loginOk.body.token.length > 10);

  const loginFail = await post('/api/auth/login', { password: 'wrongpassword' });
  assert('wrong password → 401',      loginFail.status === 401);

  const loginNoPass = await post('/api/auth/login', {});
  assert('missing password → 400',    loginNoPass.status === 400);

  const token = loginOk.body.token;

  // ── Protected PUT /api/content ────────────────────────────────────────────
  console.log('\nPUT /api/content (auth)');
  const noAuth = await put('/api/content', { test: true });
  assert('no token → 401',            noAuth.status === 401);

  const badToken = await put('/api/content', { test: true }, 'invalid.token.here');
  assert('bad token → 401',           badToken.status === 401);

  // Read current content, patch hero tagline, then restore
  const original = content.body;
  const patched = { ...original, hero: { tagline: { en: 'Test EN', es: 'Test ES' } } };

  const saveOk = await put('/api/content', patched, token);
  assert('valid token + body → 200',  saveOk.status === 200);
  assert('returns ok:true',           saveOk.body.ok === true);

  const afterSave = await get('/api/content');
  assert('content updated on disk',   afterSave.body.hero?.tagline?.en === 'Test EN');

  // Restore original content
  await put('/api/content', original, token);
  const restored = await get('/api/content');
  assert('content restored',          restored.body.hero?.tagline?.en === original.hero?.tagline?.en);

  // ── Rate limiting ─────────────────────────────────────────────────────────
  console.log('\nRate limit (login)');
  // We've already used some attempts; fire 10 more rapid requests
  const attempts = [];
  for (let i = 0; i < 11; i++) {
    attempts.push(post('/api/auth/login', { password: 'x' }));
  }
  const results = await Promise.all(attempts);
  const tooMany = results.some(r => r.status === 429);
  assert('11 rapid attempts → at least one 429', tooMany);

  // ── Admin panel ───────────────────────────────────────────────────────────
  console.log('\nGET /admin');
  const admin = await get('/admin');
  assert('serves admin HTML',         admin.status === 200);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

setup().then(run).catch(err => {
  console.error('Test setup failed:', err);
  process.exit(1);
});
