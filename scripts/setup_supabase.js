const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function run(){
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY){
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  // create buckets
  const buckets = [
    { name: 'uploads', public: true },
    { name: 'content', public: true }
  ];

  for(const b of buckets){
    try{
      const { error } = await supabase.storage.createBucket(b.name, { public: b.public });
      if(error){
        if(error.message && error.message.includes('already exists')){
          console.log(`Bucket '${b.name}' already exists`);
        } else {
          console.error(`Failed to create bucket '${b.name}':`, error.message||error);
        }
      } else {
        console.log(`Created bucket '${b.name}' (public=${b.public})`);
      }
    }catch(e){
      console.error(`Error creating bucket ${b.name}:`, e.message || e);
    }
  }

  // upload content.json into content bucket
  try{
    const contentPath = path.join(__dirname, '..', 'content.json');
    if(!fs.existsSync(contentPath)){
      console.error('content.json not found in project root. Skipping upload.');
      return;
    }
    const content = fs.readFileSync(contentPath);
    const key = 'content.json';
    const { error: upErr } = await supabase.storage.from('content').upload(key, content, { contentType: 'application/json', upsert: true });
    if(upErr){
      console.error('Failed to upload content.json:', upErr.message||upErr);
    } else {
      console.log('Uploaded content.json to content bucket');
    }
  }catch(e){
    console.error('Error uploading content.json:', e.message||e);
  }

  // report a public URL example for uploads (no specific file yet)
  try{
    // list files in content bucket
    const { data: listData, error: listErr } = await supabase.storage.from('content').list();
    if(listErr){
      console.log('Could not list content bucket files:', listErr.message||listErr);
    } else {
      console.log('Content bucket files:', listData.map(f=>f.name));
    }
  }catch(e){console.log('List error', e.message||e)}

  console.log('Setup complete. Remember to remove the service role key from any public place and rotate keys if needed.');
}

run();
