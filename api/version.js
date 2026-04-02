
module.exports = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      version: '1.0.0', // hardcoded version
      name: 'vectora',
      time: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
