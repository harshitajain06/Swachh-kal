require('dotenv').config();
const { app, connect } = require('./app');
const { startScheduler } = require('./push');

const port = process.env.PORT || 4000;
connect()
  .then(() => {
    app.listen(port, () => console.log(`Swachh Kal API on :${port}`));
    startScheduler();
  })
  .catch((e) => {
    console.error('Mongo connection failed — check MONGODB_URI and Atlas IP allow-list.', e.message);
    process.exit(1);
  });
