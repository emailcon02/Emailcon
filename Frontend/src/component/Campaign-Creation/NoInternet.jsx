import React from 'react';

const NoInternet = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>📡</div>
        <h1 style={styles.heading}>You're Offline</h1>
        <p style={styles.text}>
          It looks like your internet connection was lost. Don’t worry, we’re trying to reconnect...
        </p>
        <p style={styles.subtext}>
          Once you're back online, the page will refresh automatically!
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2rem 3rem',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    textAlign: 'center',
    maxWidth: '450px',
    animation: 'fadeIn 1s ease-in-out',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  text: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  subtext: {
    fontSize: '0.9rem',
    color: '#94a3b8',
  },
};

// Optional: add to your global CSS for fade-in
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
*/

export default NoInternet;
