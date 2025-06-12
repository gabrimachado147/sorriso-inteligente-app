import React from 'react';

const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ 
          color: '#0ea5e9', 
          marginBottom: '20px',
          fontSize: '32px'
        }}>
          🦷 Sorriso Inteligente
        </h1>
        <p style={{ 
          color: '#64748b', 
          marginBottom: '30px',
          fontSize: '18px'
        }}>
          Aplicação carregada com sucesso!
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginTop: '20px'
        }}>
          <button style={{
            padding: '15px 20px',
            backgroundColor: '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            ✅ React OK
          </button>
          <button style={{
            padding: '15px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            🎯 Vite OK
          </button>
          <button style={{
            padding: '15px 20px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            📱 PWA Ready
          </button>
          <button style={{
            padding: '15px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            🚀 Deploy OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestApp;
