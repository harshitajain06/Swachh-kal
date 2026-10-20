export const PRIVACY_VERSION = '1';

/** DRAFT wording for the in-app privacy notice. Must be reviewed by the client's legal adviser before release
 *  (India's DPDP Act 2023 requires verifiable parental consent for under-18s). */
export const PRIVACY_SUMMARY = [
  { icon: '📝', title: 'What we collect', text: 'Name, age, city and country, who you are (student, teacher…), gender, your habits and badges, and how long you spend on stories and facts.' },
  { icon: '🎯', title: 'Why', text: 'To save your progress, send reminders, and help Swachh Kal understand which habits help children most.' },
  { icon: '🚫', title: 'What we never do', text: 'We never show ads, never sell your information, and never share it with strangers.' },
  { icon: '🔔', title: 'Reminders', text: 'With permission we send a few friendly notifications each day. They can be turned off in phone settings.' },
  { icon: '🗑️', title: 'Your choice', text: 'A grown-up can delete the account and all its data any time from Me → Delete my data.' },
];

export const PRIVACY_FULL = [
  'Swachh Kal is a student-led sustainability initiative founded by Mehr Dhawan. This app is designed for children in Delhi NCR.',
  'We collect only what is needed to run the app: the name you choose, age, country and city, the kind of user you are, gender (optional), your habit and badge progress, daily check-ins, the time spent on stories, facts, videos and articles, and a notification token if you allow notifications.',
  'Sign-in is handled by Clerk (email or Google). Progress is stored in our database (MongoDB Atlas). We do not use advertising or third-party tracking.',
  'Reports shown to the Swachh Kal team are aggregated (for example, how many children finished a hero). Only a small group of authorised team members can see individual records.',
  'Children under 18 need a parent or guardian to agree before using the app. A parent or guardian can ask for the account and all its data to be deleted at any time using Me → Delete my data.',
  'If we change this notice we will ask again.',
];
