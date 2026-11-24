require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { clerkMiddleware, getAuth, clerkClient } = require('@clerk/express');
const { User, Device, HubRequest } = require('./models');
const { sendReminders } = require('./push');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  if (process.env.LOG_REQUESTS) res.on('finish', () => console.log(req.method, req.url, res.statusCode));
  next();
});
app.use(clerkMiddleware());

const DAY = 24 * 60 * 60 * 1000;
const admins = (process.env.ADMIN_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);

const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => {
  console.error(e);
  res.status(500).json({ error: 'server_error' });
});

function requireUser(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'unauthenticated' });
  req.userId = userId;
  next();
}

async function loadUser(req, res, next) {
  let user = await User.findOne({ clerkId: req.userId });
  if (!user) {
    let email;
    try {
      const cu = await clerkClient.users.getUser(req.userId);
      email = cu.emailAddresses[0]?.emailAddress;
    } catch {}
    user = await User.create({ clerkId: req.userId, email });
  }
  user.lastActiveAt = new Date();
  req.user = user;
  next();
}

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));
const auth = [requireUser, loadUser]; // Express 5 forwards async errors itself

app.get('/health', (_req, res) => res.json({ ok: true }));

// Anonymous install ping (downloaded-but-never-signed-up analytics).
app.post('/api/device', wrap(async (req, res) => {
  const { deviceId, platform } = req.body || {};
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' });
  const { userId } = getAuth(req);
  await Device.updateOne(
    { deviceId },
    { $set: { platform, lastSeenAt: new Date(), ...(userId ? { clerkId: userId } : {}) }, $setOnInsert: { firstSeenAt: new Date() } },
    { upsert: true },
  );
  res.json({ ok: true });
}));

app.get('/api/me', auth, wrap(async (req, res) => {
  await req.user.save();
  res.json(req.user);
}));

app.put('/api/me', auth, wrap(async (req, res) => {
  Object.assign(req.user, pick(req.body, ['name', 'age', 'country', 'city', 'role', 'gender', 'school', 'platform', 'consentVersion', 'guardianConsent']));
  if (typeof req.user.school === 'string') req.user.school = req.user.school.trim().slice(0, 60);
  await req.user.save();
  res.json(req.user);
}));

app.post('/api/consent', auth, wrap(async (req, res) => {
  req.user.consentAt = new Date();
  req.user.consentVersion = String(req.body.version || '1');
  req.user.guardianConsent = !!req.body.guardian;
  await req.user.save();
  res.json({ ok: true });
}));

// Right to erasure: removes the child's data here and the Clerk account.
app.delete('/api/me', auth, wrap(async (req, res) => {
  await User.deleteOne({ clerkId: req.userId });
  await Device.deleteMany({ clerkId: req.userId });
  await HubRequest.deleteMany({ clerkId: req.userId });
  try {
    await clerkClient.users.deleteUser(req.userId);
  } catch (e) {
    console.error('clerk delete failed', e.message);
  }
  res.json({ ok: true });
}));

app.post('/api/pledge', auth, wrap(async (req, res) => {
  if (!req.user.pledgedAt) req.user.pledgedAt = new Date();
  await req.user.save();
  res.json(req.user);
}));

app.post('/api/habits', auth, wrap(async (req, res) => {
  const { habitId, done } = req.body || {};
  if (typeof habitId !== 'string') return res.status(400).json({ error: 'habitId required' });
  const has = req.user.completedHabits.some((h) => h.habitId === habitId);
  if (done && !has) req.user.completedHabits.push({ habitId, at: new Date() });
  if (!done && has) req.user.completedHabits = req.user.completedHabits.filter((h) => h.habitId !== habitId);
  if (req.body.superhero && !req.user.superheroAt) req.user.superheroAt = new Date();
  await req.user.save();
  res.json(req.user);
}));

app.post('/api/checkins', auth, wrap(async (req, res) => {
  const { date, morningCommitted, eveningCompleted, eveningSaved } = req.body || {};
  if (!date) return res.status(400).json({ error: 'date required' });
  let c = req.user.checkins.find((x) => x.date === date);
  if (!c) {
    req.user.checkins.push({ date });
    c = req.user.checkins[req.user.checkins.length - 1];
  }
  if (morningCommitted !== undefined) c.morningCommitted = !!morningCommitted;
  if (Array.isArray(eveningCompleted)) c.eveningCompleted = eveningCompleted.slice(0, 40);
  if (eveningSaved !== undefined) c.eveningSaved = !!eveningSaved;
  await req.user.save();
  res.json({ ok: true });
}));

// Time-spent tracking for stories, facts, videos, SDG reads.
app.post('/api/engagement', auth, wrap(async (req, res) => {
  const { kind, refId, seconds } = req.body || {};
  if (!kind || !(seconds > 0)) return res.status(400).json({ error: 'kind and seconds required' });
  req.user.engagement.push({ kind, refId, seconds: Math.min(Math.round(seconds), 3600) });
  if (req.user.engagement.length > 2000) req.user.engagement = req.user.engagement.slice(-2000);
  await req.user.save();
  res.json({ ok: true });
}));

app.post('/api/review', auth, wrap(async (req, res) => {
  req.user.review = { ...pick(req.body, ['heroRating', 'journeyRating', 'enjoyed']), at: new Date() };
  await req.user.save();
  res.json({ ok: true });
}));

app.post('/api/pledge365', auth, wrap(async (req, res) => {
  if (!req.user.pledge365Start) req.user.pledge365Start = new Date();
  await req.user.save();
  res.json({ start: req.user.pledge365Start });
}));

app.post('/api/push-token', auth, wrap(async (req, res) => {
  req.user.pushToken = req.body.token;
  req.user.pushTokenInvalid = false;
  await req.user.save();
  res.json({ ok: true });
}));

// Vercel Cron (daily). Vercel sends `Authorization: Bearer $CRON_SECRET`.
app.get('/api/cron/reminders', wrap(async (req, res) => {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  await connect();
  await sendReminders();
  res.json({ ok: true });
}));

// ---- Admin (privacy: only listed Clerk ids; aggregate by default, PII only on explicit /users) ----
function requireAdmin(req, res, next) {
  if (!admins.includes(req.userId)) return res.status(403).json({ error: 'forbidden' });
  next();
}

app.get('/api/admin/summary', requireUser, requireAdmin, wrap(async (_req, res) => {
  const now = Date.now();
  const [users, devices, anonymousDevices, uninstalledSuspected, inactive7, inactive3, superheroes, avg] = await Promise.all([
    User.countDocuments(),
    Device.countDocuments(),
    Device.countDocuments({ clerkId: { $exists: false } }),
    User.countDocuments({ pushTokenInvalid: true }),
    User.countDocuments({ lastActiveAt: { $lt: new Date(now - 7 * DAY) } }),
    User.countDocuments({ lastActiveAt: { $lt: new Date(now - 3 * DAY) } }),
    User.countDocuments({ superheroAt: { $exists: true } }),
    User.aggregate([{ $match: { 'review.heroRating': { $exists: true } } }, { $group: { _id: null, avg: { $avg: '$review.heroRating' }, n: { $sum: 1 } } }]),
  ]);
  res.json({
    installsRecorded: devices,
    downloadedNeverSignedUp: anonymousDevices, // item 22
    signedUpUsers: users,
    consented: await User.countDocuments({ consentAt: { $exists: true } }),
    suspectedUninstalls: uninstalledSuspected, // item 21 (push token reported DeviceNotRegistered)
    inactive3Days: inactive3,
    inactive7Days: inactive7,
    superheroes,
    reviews: avg[0] || { avg: null, n: 0 },
  });
}));

app.get('/api/admin/users', requireUser, requireAdmin, wrap(async (_req, res) => {
  const users = await User.find({}, 'name email city country role gender age lastActiveAt superheroAt pledgedAt').sort({ createdAt: -1 }).limit(500);
  res.json(users);
}));


// ---- Action Hub ----
const REQUEST_KINDS = ['blue-bin', 'dustbin', 'leaking-tap', 'tree-guard', 'other'];
const MIN_LEADERBOARD_GROUP = 5; // a school only appears once 5+ children share it, so no child can be singled out

app.post('/api/hub/requests', auth, wrap(async (req, res) => {
  const { kind, locality, note } = req.body || {};
  if (!REQUEST_KINDS.includes(kind) || typeof locality !== 'string' || !locality.trim()) return res.status(400).json({ error: 'kind and locality required' });
  const today = await HubRequest.countDocuments({ clerkId: req.userId, createdAt: { $gte: new Date(Date.now() - DAY) } });
  if (today >= 5) return res.status(429).json({ error: 'too_many_requests' });
  await HubRequest.create({ clerkId: req.userId, kind, locality: locality.trim().slice(0, 80), note: String(note || '').trim().slice(0, 300), city: req.user.city });
  res.json({ ok: true });
}));

app.get('/api/hub/requests/mine', auth, wrap(async (req, res) => {
  res.json(await HubRequest.find({ clerkId: req.userId }, 'kind locality status createdAt').sort({ createdAt: -1 }).limit(20));
}));

// Aggregate only: school name, number of children and habits per child. Never individual names.
app.get('/api/leaderboard', auth, wrap(async (req, res) => {
  const rows = await User.aggregate([
    { $match: { school: { $exists: true, $nin: [null, ''] }, consentAt: { $exists: true } } },
    { $group: { _id: { $toLower: { $trim: { input: '$school' } } }, school: { $first: '$school' }, members: { $sum: 1 }, habits: { $sum: { $size: { $ifNull: ['$completedHabits', []] } } } } },
    { $match: { members: { $gte: MIN_LEADERBOARD_GROUP } } },
    { $addFields: { perChild: { $round: [{ $divide: ['$habits', '$members'] }, 1] } } },
    { $sort: { perChild: -1, members: -1 } },
    { $limit: 20 },
  ]);
  const mine = (req.user.school || '').trim().toLowerCase();
  const rank = mine ? rows.findIndex((r) => r._id === mine) : -1;
  const mineCount = mine ? await User.countDocuments({ school: new RegExp(`^\\s*${mine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i') }) : 0;
  res.json({
    minGroup: MIN_LEADERBOARD_GROUP,
    board: rows.map((r, i) => ({ rank: i + 1, school: r.school, members: r.members, perChild: r.perChild })),
    mine: mine ? { school: req.user.school, rank: rank >= 0 ? rank + 1 : null, members: mineCount } : null,
  });
}));

app.get('/api/admin/requests', requireUser, requireAdmin, wrap(async (_req, res) => {
  res.json(await HubRequest.find({}, 'kind locality note city status createdAt').sort({ createdAt: -1 }).limit(500));
}));

app.patch('/api/admin/requests/:id', requireUser, requireAdmin, wrap(async (req, res) => {
  if (!['new', 'forwarded', 'done'].includes(req.body?.status)) return res.status(400).json({ error: 'bad status' });
  await HubRequest.updateOne({ _id: req.params.id }, { status: req.body.status });
  res.json({ ok: true });
}));

// Cached connection: serverless invocations reuse it while the instance is warm.
let conn = null;
function connect() {
  if (!conn) conn = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  return conn;
}

// Last-resort error handler (JSON, no stack traces).
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

module.exports = { app, connect };
