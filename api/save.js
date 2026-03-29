const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  try{
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const body = req.body;
    if(!body) return res.status(400).json({ error: 'missing body' });

    const content = JSON.stringify(body, null, 2);
    const key = 'content/content.json';
    // upload (upsert)
    const { error: upErr } = await supabase.storage.from('content').upload(key, Buffer.from(content), { contentType: 'application/json', upsert: true });
    if(upErr) return res.status(500).json({ error: upErr.message });

    return res.json({ ok:true });
  }catch(e){
    return res.status(500).json({ error: String(e) });
  }
};
