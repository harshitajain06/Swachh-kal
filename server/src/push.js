const { User } = require('./models');

const EXPO_PUSH = 'https://exp.host/--/api/v2/push/send';
const EXPO_RECEIPTS = 'https://exp.host/--/api/v2/push/getReceipts';

const DAY = 24 * 60 * 60 * 1000;

const COME_BACK = { title: 'Your Hero journey is waiting!', body: 'Come back and continue where you left off.' };

/**
 * Come-back push for children who haven't opened the app in 3+ days, at most once every 4 days.
 * Habit, streak and incomplete-habit reminders are local notifications scheduled by the app itself.
 */
async function sendReminders() {
  const now = Date.now();
  const users = await User.find({
    pushToken: { $exists: true, $ne: null },
    pushTokenInvalid: false,
    lastActiveAt: { $lt: new Date(now - 3 * DAY) },
    $or: [{ lastPushAt: { $exists: false } }, { lastPushAt: { $lt: new Date(now - 4 * DAY) } }],
  }).limit(500);
  if (!users.length) return;

  const messages = users.map((u) => ({ to: u.pushToken, sound: 'default', data: { screen: 'home' }, ...COME_BACK }));
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
