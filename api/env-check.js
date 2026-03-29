module.exports = async (req, res) => {
  try {
    const keys = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
    const present = {};
    keys.forEach(k => { present[k] = !!process.env[k]; });
    res.json({ ok: true, node: process.version, env: present });
  } catch (e) {
    console.error('env-check error:', e);
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
};
