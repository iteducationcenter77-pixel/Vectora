module.exports = async (req, res) => {
  // simple health check for serverless APIs
  res.json({ ok: true });
};
