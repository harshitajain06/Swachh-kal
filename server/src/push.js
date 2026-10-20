const { User } = require('./models');

const EXPO_PUSH = 'https://exp.host/--/api/v2/push/send';
const EXPO_RECEIPTS = 'https://exp.host/--/api/v2/push/getReceipts';

const DAY = 24 * 60 * 60 * 1000;

const HERO_BY_INDEX = [
  { id: 'dharti', emoji: '🌱', title: 'Dharti needs you!', body: 'Have you completed your plant-care habit today?' },
  { id: 'jal', emoji: '💧', title: 'Jal is waiting!', body: "You're just one habit away from completing today's challenge." },
];

function pickMessage(user, now) {
  const idle = now - new Date(user.lastActiveAt).getTime();
  if (idle > 3 * DAY) {
    return { title: '👋 Your Hero journey is waiting!', body: 'Come back and continue where you left off.' };
  }
  const days = new Set((user.completedHabits || []).map((h) => new Date(h.at).toDateString()));
  if (days.size >= 3 && idle < DAY) {
    return { title: '🔥 3-day streak!', body: "Keep going — you're one step closer to your next badge!" };
  }
  const h = HERO_BY_INDEX[Math.floor(Math.random() * HERO_BY_INDEX.length)];
  return { title: `${h.emoji} ${h.title}`, body: h.body };
}

/** Runs hourly. Sends at most one push per user per ~20h. */
async function sendReminders() {
  const now = Date.now();
  const users = await User.find({
    pushToken: { $exists: true, $ne: null },
    pushTokenInvalid: false,
    $or: [{ lastPushAt: { $exists: false } }, { lastPushAt: { $lt: new Date(now - 20 * 60 * 60 * 1000) } }],
  }).limit(500);
  if (!users.length) return;

  const messages = users.map((u) => ({ to: u.pushToken, sound: 'default', data: { screen: 'home' }, ...pickMessage(u, now) }));
  const res = await fetch(EXPO_PUSH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(messages),
  });
  const json = await res.json();
  const tickets = json.data || [];
  const receiptMap = {};
  await Promise.all(
    tickets.map(async (t, i) => {
      const u = users[i];
      if (t.status === 'ok') {
        receiptMap[t.id] = u._id;
        u.lastPushAt = new Date();
        await u.save();
      } else if (t.details && t.details.error === 'DeviceNotRegistered') {
        // Strongest signal the app was uninstalled.
        u.pushTokenInvalid = true;
        await u.save();
      }
    }),
  );
  setTimeout(() => checkReceipts(receiptMap).catch(console.error), 15 * 60 * 1000);
}

async function checkReceipts(receiptMap) {
  const ids = Object.keys(receiptMap);
  if (!ids.length) return;
  const res = await fetch(EXPO_RECEIPTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  const { data = {} } = await res.json();
  for (const [id, r] of Object.entries(data)) {
    if (r.status === 'error' && r.details && r.details.error === 'DeviceNotRegistered') {
      await User.updateOne({ _id: receiptMap[id] }, { pushTokenInvalid: true });
    }
  }
}

function startScheduler() {
  setInterval(() => sendReminders().catch(console.error), 60 * 60 * 1000);
}

module.exports = { startScheduler, sendReminders };
