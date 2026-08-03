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
      backgroundColor: '#F0E8C7',
      color: '#060504'
    }}>
      <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#060504' }}>404 - Page Not Found</h2>
      <p style={{ marginBottom: '24px', opacity: 0.7 }}>Oops! The page you are looking for doesn't exist.</p>
      <Link href="/" style={{
        padding: '12px 24px',
        backgroundColor: '#CF4B13',
        color: '#ffffff',
        borderRadius: '999px',
        textDecoration: 'none',
        fontWeight: '800'
      }}>
        Go Home
      </Link>
    </div>
  );
}
