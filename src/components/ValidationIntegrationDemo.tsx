import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';
import { useAPI } from '../config/api';
import { ChatValidationComponent, AppointmentValidationComponent, EmergencyTriageComponent } from '../components/ValidationComponents';

// Type definitions for validation results
interface ValidationResultItem {
  type: string;
  timestamp: string;
  isValid: boolean;
  confidence?: number;
  risk_level: string;
  message: string;
  input: unknown;
}

interface ValidationDemoProps {
  className?: string;
}

export const ValidationIntegrationDemo: React.FC<ValidationDemoProps> = ({ className }) => {
  const pwa = usePWA();
  const api = useAPI();
  
  const [chatMessage, setChatMessage] = useState('');
  const [appointmentData, setAppointmentData] = useState<{
    patient_name: string;
    preferred_date: string;
    reason: string;
    urgency_level: string;
  }>({
    patient_name: '',
    preferred_date: '',
    reason: '',
    urgency_level: 'low'
  });
  const [emergencyData, setEmergencyData] = useState({
    symptoms: '',
    severity: 'mild',
    duration: '',
    patient_age: 30
  });
  
  const [validationResults, setValidationResults] = useState<ValidationResultItem[]>([]);
  const [apiHealth, setApiHealth] = useState<{ status: string; message: string } | null>(null);

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await api.checkHealth();
        setApiHealth(health);
      } catch (error) {
        setApiHealth({ status: 'error', message: 'API unavailable' });
        console.error('Health check failed:', error);
      }
    };
    
    checkHealth();
  }, [api]);

  // Auto-sync validation queue when coming online
  useEffect(() => {
    if (pwa.isOnline && pwa.validationQueue.length > 0) {
      pwa.processValidationQueue();
    }
  }, [pwa.isOnline, pwa.validationQueue.length, pwa]);

  const handleChatValidation = async (isValid: boolean, confidence: number, message: string) => {
    const result: ValidationResultItem = {
      type: 'chat',
      timestamp: new Date().toISOString(),
      isValid,
      confidence,
      risk_level: isValid ? 'low' : 'high',
      message,
      input: chatMessage
    };
    
    setValidationResults(prev => [...prev, result]);
    
    // Add to offline queue if API fails
    if (!isValid && !pwa.isOnline) {
      await pwa.addToValidationQueue('chat', { message: chatMessage });
    }
  };

  const handleAppointmentValidation = async (result: { isValid: boolean; confidence?: number; risk_level: string; message: string }) => {
    const validationResult: ValidationResultItem = {
      type: 'appointment',
      timestamp: new Date().toISOString(),
      isValid: result.isValid,
      confidence: result.confidence,
      risk_level: result.risk_level,
      message: result.message,
      input: appointmentData
    };
    
    setValidationResults(prev => [...prev, validationResult]);
    
    // Add to offline queue if needed
    if (!result.isValid && !pwa.isOnline) {
      await pwa.addToValidationQueue('appointment', appointmentData);
    }
  };

  const handleEmergencyTriage = async (result: { isValid: boolean; risk_level: string; message: string }) => {
    const triageResult: ValidationResultItem = {
      type: 'emergency',
      timestamp: new Date().toISOString(),
      isValid: result.isValid,
      risk_level: result.risk_level,
      message: result.message,
      input: emergencyData
    };
    
    setValidationResults(prev => [...prev, triageResult]);
    
    // Critical: Always queue emergency validations for review
    if (result.risk_level === 'high' || !pwa.isOnline) {
      await pwa.addToValidationQueue('emergency', emergencyData);
    }
  };

  const queueStatus = pwa.getValidationQueueStatus();

  return (
    <div className={`validation-integration-demo ${className}`}>
      {/* API Status Header */}
      <div className="api-status-header">
        <div className={`status-indicator ${apiHealth?.status === 'healthy' ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          <span>API Status: {apiHealth?.status || 'Checking...'}</span>
        </div>
        
        <div className={`pwa-status ${pwa.isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          <span>{pwa.isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* PWA Metrics Dashboard */}
      <div className="pwa-metrics">
        <h3>📊 PWA Status</h3>
        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Storage Usage</span>
            <span className="metric-value">{pwa.storageUsage.percentage.toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Background Sync</span>
            <span className={`metric-value ${pwa.backgroundSyncStatus}`}>
              {pwa.backgroundSyncStatus}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Validation Queue</span>
            <span className="metric-value">
              {queueStatus.pending}P / {queueStatus.processing}R / {queueStatus.failed}F
            </span>
          </div>
        </div>
      </div>

      {/* Chat Validation Section */}
      <div className="validation-section">
        <h3>💬 Chat Message Validation</h3>
        <div className="input-group">
          <textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Enter a chat message to validate..."
            className="chat-input"
            rows={3}
          />
          <ChatValidationComponent
            onValidation={handleChatValidation}
            autoValidate={true}
            disabled={!apiHealth || apiHealth.status !== 'healthy'}
          />
        </div>
      </div>

      {/* Appointment Validation Section */}
      <div className="validation-section">
        <h3>📅 Appointment Request Validation</h3>
        <div className="appointment-form">
          <input
            type="text"
            value={appointmentData.patient_name}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, patient_name: e.target.value }))}
            placeholder="Patient Name"
            className="form-input"
          />
          <input
            type="date"
            value={appointmentData.preferred_date}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, preferred_date: e.target.value }))}
            className="form-input"
          />
          <input
            type="text"
            value={appointmentData.reason}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Reason for appointment"
            className="form-input"
          />
          <select
            value={appointmentData.urgency_level}
            onChange={(e) => setAppointmentData(prev => ({ ...prev, urgency_level: e.target.value }))}
            className="form-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <AppointmentValidationComponent
            appointmentData={appointmentData}
            onValidation={handleAppointmentValidation}
          />
        </div>
      </div>

      {/* Emergency Triage Section */}
      <div className="validation-section emergency">
        <h3>🚨 Emergency Triage Assessment</h3>
        <div className="emergency-form">
          <textarea
            value={emergencyData.symptoms}
            onChange={(e) => setEmergencyData(prev => ({ ...prev, symptoms: e.target.value }))}
            placeholder="Describe symptoms..."
            className="form-textarea"
            rows={3}
          />
          <select
            value={emergencyData.severity}
            onChange={(e) => setEmergencyData(prev => ({ ...prev, severity: e.target.value }))}
            className="form-select"
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
            <option value="critical">Critical</option>
          </select>
          <input
            type="text"
            value={emergencyData.duration}
            onChange={(e) => setEmergencyData(prev => ({ ...prev, duration: e.target.value }))}
            placeholder="Duration (e.g., 2 hours, 3 days)"
            className="form-input"
          />
          <input
            type="number"
            value={emergencyData.patient_age}
            onChange={(e) => setEmergencyData(prev => ({ ...prev, patient_age: parseInt(e.target.value) }))}
            placeholder="Patient Age"
            className="form-input"
            min="0"
            max="120"
          />
          
          <EmergencyTriageComponent
            symptoms={emergencyData.symptoms}
            severity={emergencyData.severity}
            duration={emergencyData.duration}
            patientAge={emergencyData.patient_age}
            onTriageResult={handleEmergencyTriage}
          />
        </div>
      </div>

      {/* Validation Results */}
      <div className="validation-results">
        <h3>📋 Validation Results</h3>
        {validationResults.length === 0 ? (
          <p className="no-results">No validations performed yet.</p>
        ) : (
          <div className="results-list">
            {validationResults.slice(-5).reverse().map((result, index) => (
              <div key={index} className={`result-item ${result.isValid ? 'valid' : 'invalid'}`}>
                <div className="result-header">
                  <span className="result-type">{result.type.toUpperCase()}</span>
                  <span className="result-timestamp">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`result-status ${result.isValid ? 'valid' : 'invalid'}`}>
                    {result.isValid ? '✅ Valid' : '⚠️ Review Required'}
                  </span>
                </div>
                <div className="result-details">
                  {result.confidence && (
                    <div>Confidence: {Math.round(result.confidence * 100)}%</div>
                  )}
                  {result.risk_level && (
                    <div>Risk Level: <span className={`risk-${result.risk_level}`}>{result.risk_level}</span></div>
                  )}
                  <div className="result-message">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offline Queue Management */}
      {pwa.validationQueue.length > 0 && (
        <div className="offline-queue">
          <h3>🔄 Offline Validation Queue</h3>
          <div className="queue-controls">
            <button 
              onClick={() => pwa.processValidationQueue()}
              disabled={!pwa.isOnline}
              className="btn-process-queue"
            >
              Process Queue ({pwa.validationQueue.length})
            </button>
            <button 
              onClick={() => pwa.clearValidationQueue()}
              className="btn-clear-queue"
            >
              Clear Queue
            </button>
          </div>
          
          <div className="queue-items">
            {pwa.validationQueue.map((item) => (
              <div key={item.id} className={`queue-item ${item.status}`}>
                <span className="item-type">{item.type}</span>
                <span className="item-status">{item.status}</span>
                <span className="item-time">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                {item.retryCount > 0 && (
                  <span className="retry-count">Retries: {item.retryCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          onClick={() => pwa.syncOfflineData()}
          disabled={!pwa.isOnline}
          className="btn-sync"
        >
          🔄 Manual Sync
        </button>
        <button 
          onClick={() => pwa.getStorageUsage()}
          className="btn-storage"
        >
          📊 Update Storage Info
        </button>
        <button 
          onClick={() => pwa.checkForUpdates()}
          className="btn-update"
        >
          🔍 Check for Updates
        </button>
      </div>
    </div>
  );
};

export default ValidationIntegrationDemo;
