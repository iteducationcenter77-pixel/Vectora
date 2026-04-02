const pkg = require('../package.json');

module.exports = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      version: pkg.version || '0.0.0',
      name: pkg.name || 'vectora',
      time: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
