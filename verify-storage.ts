import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyStorage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error('❌ Missing Supabase Env Vars');
        console.log('URL:', url);
        console.log('KEY:', key ? 'FOUND' : 'MISSING');
        process.exit(1);
    }

    const supabase = createClient(url, key);

    console.log('Testing Supabase Storage Connection...');

    // 1. List Buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Failed to list buckets:', listError.message);
    } else {
        console.log('✅ Buckets found:', buckets.length);
        buckets.forEach(b => console.log(` - ${b.name} (public: ${b.public})`));

        const portfolioExists = buckets.find(b => b.name === 'portfolio');
        if (!portfolioExists) {
            console.error('❌ "portfolio" bucket is MISSING!');
        } else {
            console.log('✅ "portfolio" bucket exists.');
        }
    }

    // 2. Try a test upload to 'portfolio'
    console.log('\nAttempting test upload to "portfolio"...');
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload('test-connection.txt', 'Connection Test', { upsert: true });

    if (uploadError) {
        console.error('❌ Upload Failed:', uploadError.message);
        console.error('Details:', uploadError);
    } else {
        console.log('✅ Upload Successful!', uploadData);
        // Clean up
        await supabase.storage.from('portfolio').remove(['test-connection.txt']);
    }
}

verifyStorage();
