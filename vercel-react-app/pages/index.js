import Head from 'next/head';

export default function Home() {
  return (
    <div style={pageStyle}>
      <Head>
        <title>Enterprise Cloud Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={mainStyle}>
        <h1 style={titleStyle}>Enterprise Cloud Dashboard</h1>
        <p style={textStyle}>This page is rebuilt cleanly to restore your Vercel deployment.</p>
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  margin: 0,
  padding: '2rem',
  backgroundColor: '#f8fafc',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const mainStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
};

const titleStyle = {
  margin: 0,
  fontSize: '2.4rem',
  color: '#0f172a'
};

const textStyle = {
  marginTop: '1rem',
  fontSize: '1.1rem',
  color: '#475569'
};
