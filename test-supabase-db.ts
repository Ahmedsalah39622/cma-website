import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import postgres from 'postgres';

async function testConnection() {
    const url = process.env.DATABASE_URL;
    console.log('Testing URL:', url); // Be careful not to leak password in logs if possible, but for now we need debug

    if (!url) {
        console.error('No DATABASE_URL found');
        return;
    }

    try {
        const sql = postgres(url);
        const result = await sql`SELECT NOW() as time`;
        console.log('✅ Connected! DB Time:', result[0].time);
        await sql.end();
    } catch (e) {
        console.error('❌ Connection Failed:', e);
    }
}

testConnection();
