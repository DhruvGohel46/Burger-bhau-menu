import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#0f0f0f',
      color: '#ffffff'
    }}>
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>404 - Page Not Found</h2>
      <p style={{ marginBottom: '24px', opacity: 0.7 }}>Oops! The page you are looking for doesn't exist.</p>
      <Link href="/" style={{
        padding: '12px 24px',
        backgroundColor: '#ff8c00',
        color: '#101010',
        borderRadius: '999px',
        textDecoration: 'none',
        fontWeight: '800'
      }}>
        Go Home
      </Link>
    </div>
  );
}
