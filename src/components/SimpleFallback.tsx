import React from 'react';

export function SimpleFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Inter, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#0ea5e9',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'white'
        }}>
          😁
        </div>
        
        <h1 style={{
          fontSize: '24px',
          color: '#1f2937',
          marginBottom: '16px',
          fontWeight: '600'
        }}>
          Sorriso Inteligente
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          Bem-vindo ao seu aplicativo odontológico! 
          <br />
          Carregando as funcionalidades...
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#0ea5e9',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Recarregar Aplicação
        </button>
      </div>
    </div>
  );
}

export default SimpleFallback;
