const { app, connect } = require('../src/app');

module.exports = async (req, res) => {
  try {
    await connect();
  } catch (e) {
    console.error('Mongo connection failed', e.message);
    return res.status(503).json({ error: 'database_unavailable', detail: String(e.message).slice(0, 220) });
  }
  return app(req, res);
};
