import 'dotenv/config';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const sql = postgres(connectionString, {
  prepare: false,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const password = process.env.ADMIN_PASSWORD || 'Cma@2026!Panel';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const passwordHash = await bcrypt.hash(password, 12);

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'admin',
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    )
  `;

  await sql`
    INSERT INTO users (username, password_hash, role)
    VALUES (${username}, ${passwordHash}, 'admin')
    ON CONFLICT (username)
    DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      updated_at = timezone('utc'::text, now())
  `;

  console.log(`Admin user upserted: ${username}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end();
  });