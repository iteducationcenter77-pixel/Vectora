const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  if(!SUPABASE_URL || !SUPABASE_ANON_KEY) return res.status(500).json({ error: 'Supabase not configured' });

  try{
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    // try to download content.json from 'content' bucket
    const { data, error } = await supabase.storage.from('content').download('content.json');
    if(error) return res.status(404).json({ error: 'content not found' });
    const text = await data.text();
    res.setHeader('Content-Type','application/json');
    res.send(text);
  }catch(e){
    return res.status(500).json({ error: String(e) });
  }
};
