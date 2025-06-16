import { createRoot } from 'react-dom/client'
import './index.css'

// Simple debug component
function DebugApp() {
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
          ✅ Aplicação carregando corretamente!
          <br />
          🌐 Sistema funcionando
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => {
              // Try to import and load the full app
              import('./App').then(AppModule => {
                const App = AppModule.default;
                const container = document.getElementById('root')!;
                const root = createRoot(container);
                root.render(<App />);
              }).catch(error => {
                console.error('Failed to load main app:', error);
                alert('Erro ao carregar aplicação principal. Verifique o console.');
              });
            }}
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
            Carregar App Completo
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
          marginTop: '20px',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          Debug Mode - {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Try to render the debug app first
try {
  const container = document.getElementById('root')!
  const root = createRoot(container)
  root.render(<DebugApp />)
  console.log('✅ Debug app loaded successfully')
} catch (error) {
  console.error('❌ Failed to load debug app:', error)
  // Fallback to basic HTML
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
      <h1>🚨 Erro de Carregamento</h1>
      <p>A aplicação não conseguiu carregar. Verifique o console para mais detalhes.</p>
      <button onclick="location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Recarregar Página
      </button>
    </div>
  `;
}
