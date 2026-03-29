const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Client } = require('pg');

const sqlPath = path.join(__dirname, '..', 'migrations', 'create_tables.sql');
if (!fs.existsSync(sqlPath)) {
  console.error('Migration SQL file not found:', sqlPath);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Please set DATABASE_URL in your environment (Supabase DB connection string).');
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to database — running migration...');
    await client.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
