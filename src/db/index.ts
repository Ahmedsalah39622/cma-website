import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const queryClient = process.env.DATABASE_URL;

if (!queryClient) {
    if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL: DATABASE_URL is missing in production!');
    } else {
        console.warn('DATABASE_URL is missing. Database operations will fail.');
    }
}

// Disable prefetch as it is not supported for "Transaction" pool mode 
// Only initialize if we have a connection string to avoid localhost connection attempts
const client = queryClient
    ? postgres(queryClient, { prepare: false })
    : null;

// export const db = drizzle(client, { schema });
// We use a proxy to avoid crashing every fetch and provide a silent fallback
const createRecursiveProxy = (name: string): any => {
    const proxy: any = new Proxy(() => { }, {
        get(target, prop) {
            if (prop === 'then') return undefined; // Not a promise
            if (prop === 'rows') return [];
            return createRecursiveProxy(`${name}.${String(prop)}`);
        },
        apply(target, thisArg, args) {
            // Common patterns
            const path = name.toLowerCase();
            if (path.includes('findfirst')) return Promise.resolve(null);
            if (path.includes('select') || path.includes('from') || path.includes('where') || path.includes('orderby')) {
                const chain = createRecursiveProxy(name);
                // If we await it, return an empty array
                (chain as any).then = (resolve: any) => resolve([]);
                return chain;
            }
            return createRecursiveProxy(name);
        }
    });
    return proxy;
};

export const db: any = client
    ? drizzle(client, { schema })
    : createRecursiveProxy('db_mock');
