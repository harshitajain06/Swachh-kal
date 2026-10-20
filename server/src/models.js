const mongoose = require('mongoose');

const HabitDone = new mongoose.Schema(
  { habitId: String, at: { type: Date, default: Date.now } },
  { _id: false },
);

const CheckIn = new mongoose.Schema(
  {
    date: String, // YYYY-MM-DD (device local day)
    morningCommitted: { type: Boolean, default: false },
    eveningCompleted: [String], // habit ids reported in the evening
    eveningSaved: { type: Boolean, default: false },
  },
  { _id: false },
);

const Engagement = new mongoose.Schema(
  {
    kind: { type: String, enum: ['story', 'facts', 'video', 'sdg', 'habits', 'booklet', 'app'] },
    refId: String,
    seconds: Number,
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, unique: true, index: true },
    email: String,
    name: String,
    age: Number,
    country: String,
    city: String,
    role: String, // student | teacher | parent | ...
    gender: String,
    pledgedAt: Date,
    completedHabits: [HabitDone],
    checkins: [CheckIn],
    engagement: [Engagement],
    superheroAt: Date,
    pledge365Start: Date,
    review: {
      heroRating: Number,
      journeyRating: Number,
      enjoyed: [String],
      at: Date,
    },
    pushToken: String,
    pushTokenInvalid: { type: Boolean, default: false }, // set when Expo reports DeviceNotRegistered => likely uninstalled
    platform: String,
    installedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
    lastPushAt: Date,
  },
  { timestamps: true },
);

// Anonymous device record: lets us see "downloaded but never signed up".
const DeviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true, index: true },
    platform: String,
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
    clerkId: String,
  },
  { timestamps: true },
);

module.exports = {
  User: mongoose.model('User', UserSchema),
  Device: mongoose.model('Device', DeviceSchema),
};
