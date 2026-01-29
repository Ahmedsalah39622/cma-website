export const dynamic = 'force-dynamic';

export default function DebugPage() {
    const databaseUrlPresent = !!process.env.DATABASE_URL;
    const env = process.env.NODE_ENV;

    // We don't show the actual URL for security, just confirmation
    const urlMasked = databaseUrlPresent
        ? process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':****@')
        : 'NULL';

    return (
        <div style={{ padding: '2rem', background: '#0a0a14', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
            <h1>CMA Connection Diagnostics</h1>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ marginTop: '2rem', fontSize: '1.2rem' }}>
                <p>Environment: <span style={{ color: '#FFD700' }}>{env}</span></p>
                <p>DATABASE_URL detected: {databaseUrlPresent ? <span style={{ color: '#00FF00' }}>YES ✅</span> : <span style={{ color: '#FF4444' }}>NO ❌</span>}</p>
                <p style={{ opacity: 0.5 }}>URL (Masked): {urlMasked}</p>
            </div>

            {!databaseUrlPresent && (
                <div style={{ marginTop: '2rem', background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '10px', border: '1px solid #FF4444' }}>
                    <h2 style={{ color: '#FF4444' }}>Action Required</h2>
                    <p>Go to Vercel Settings &gt; Environment Variables and add <strong>DATABASE_URL</strong>.</p>
                </div>
            )}

            <div style={{ marginTop: '4rem', opacity: 0.3 }}>
                <p>Note: This page is only for debugging and will be removed after the fix.</p>
            </div>
        </div>
    );
}
