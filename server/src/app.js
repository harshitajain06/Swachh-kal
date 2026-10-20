require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { clerkMiddleware, getAuth, clerkClient } = require('@clerk/express');
const { User, Device } = require('./models');
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
  Object.assign(req.user, pick(req.body, ['name', 'age', 'country', 'city', 'role', 'gender', 'platform', 'consentVersion', 'guardianConsent']));
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
