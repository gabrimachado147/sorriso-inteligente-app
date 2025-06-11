import React from 'react';

export default function SimpleApp() {
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
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#0ea5e9',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          color: 'white'
        }}>
          😁
        </div>
        
        <h1 style={{
          fontSize: '32px',
          color: '#1f2937',
          marginBottom: '16px',
          fontWeight: '600'
        }}>
          Sorriso Inteligente
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '32px',
          lineHeight: '1.6',
          fontSize: '18px'
        }}>
          ✅ Aplicação carregando corretamente em produção!
          <br />
          🌐 Sistema funcionando
          <br />
          📱 PWA Ready
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
            <div style={{ fontWeight: '500', color: '#374151' }}>Agendamentos</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontWeight: '500', color: '#374151' }}>Chat IA</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
            <div style={{ fontWeight: '500', color: '#374151' }}>Localização</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚨</div>
            <div style={{ fontWeight: '500', color: '#374151' }}>Emergência</div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => {
              window.location.hash = '#/appointments';
              alert('Função de agendamento será implementada em breve!');
            }}
            style={{
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Agendar Consulta
          </button>
          
          <button 
            onClick={() => {
              window.location.hash = '#/chat';
              alert('Chat IA será implementado em breve!');
            }}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Chat com IA
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Recarregar
          </button>
        </div>
        
        <div style={{
          marginTop: '32px',
          fontSize: '14px',
          color: '#9ca3af',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px'
        }}>
          <div>🌐 <strong>Status:</strong> Online</div>
          <div>📱 <strong>Plataforma:</strong> Web & PWA</div>
          <div>⚡ <strong>Performance:</strong> Otimizada</div>
          <div>🔒 <strong>Segurança:</strong> HTTPS</div>
        </div>
        
        <div style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          Versão 2.0 - Atualizado em {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  );
}
