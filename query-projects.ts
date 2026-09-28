import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Missing env variables', { url, key });
    process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) {
        console.error('Error fetching:', error);
    } else {
        console.log('Projects in DB count:', data?.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

run();
