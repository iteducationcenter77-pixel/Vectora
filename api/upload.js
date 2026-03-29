const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  try{
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { filename, data } = req.body || {};
    if(!filename || !data) return res.status(400).json({ error: 'filename and data required' });

    // data is expected to be a data URL: data:<type>;base64,<payload>
    const m = data.match(/^data:(.+);base64,(.*)$/);
    if(!m) return res.status(400).json({ error: 'invalid data URL' });
    const contentType = m[1];
    const b64 = m[2];
    const buffer = Buffer.from(b64, 'base64');

    const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g,'_')}`;
    const { error: upErr } = await supabase.storage.from('uploads').upload(key, buffer, { contentType, upsert: false });
    if(upErr) return res.status(500).json({ error: upErr.message });

    const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(key);
    return res.json({ url: publicData.publicUrl });
  }catch(e){
    return res.status(500).json({ error: String(e) });
  }
};
