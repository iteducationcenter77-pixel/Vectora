const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  try{
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const body = req.body || {};
    const { name, email, phone, service, message } = body;
    if(!name || !email || !message) return res.status(400).json({ error: 'name, email, and message are required' });

    const record = { name, email, phone: phone||'', service: service||'', message, created_at: new Date().toISOString() };
    const { error } = await supabase.from('contacts').insert([record]);
    if(error) {
      console.error('Supabase insert error (contacts):', error);
      return res.status(500).json({ error: error.message || error });
    }
    return res.json({ ok: true });
  }catch(e){
    console.error('Unhandled contact error:', e);
    return res.status(500).json({ error: e.message || String(e), stack: e.stack });
  }
};
