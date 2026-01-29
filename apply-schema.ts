import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

async function applySchema() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('No DATABASE_URL found');
        return;
    }

    try {
        const sql = postgres(url);

        // Read the generated SQL file
        const migrationPath = path.join(process.cwd(), 'drizzle', '0000_calm_kinsey_walden.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Applying schema to database...');

        // Split by statement-breakpoint if needed, but postgres.js can handle some multiple statements 
        // depending on the driver. Standard way is to execute the whole block if it's a script.
        // Actually, drizzle-kit migrations use --> statement-breakpoint
        const statements = migrationSql.split('--> statement-breakpoint');

        for (const statement of statements) {
            const trimmed = statement.trim();
            if (trimmed) {
                try {
                    // Try to make it IF NOT EXISTS if it's a CREATE TABLE
                    let safeStatement = trimmed;
                    if (trimmed.toUpperCase().startsWith('CREATE TABLE')) {
                        safeStatement = trimmed.replace(/CREATE TABLE/i, 'CREATE TABLE IF NOT EXISTS');
                    }
                    await sql.unsafe(safeStatement);
                } catch (err: any) {
                    if (err.code === '42P07') {
                        console.log(`Table already exists, skipping...`);
                    } else {
                        console.error(`Error executing statement:`, err.message);
                    }
                }
            }
        }

        console.log('✅ Schema applied successfully!');
        await sql.end();
    } catch (e) {
        console.error('❌ Schema application failed:', e);
    }
}

applySchema();
