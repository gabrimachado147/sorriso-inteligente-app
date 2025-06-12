import React, { useState, useCallback } from 'react';
import { useGuardrailsAPI } from '../config/api';

interface ChatValidationProps {
  onValidation: (isValid: boolean, confidence: number, message: string) => void;
  autoValidate?: boolean;
  disabled?: boolean;
}

export const ChatValidationComponent: React.FC<ChatValidationProps> = ({
  onValidation,
  autoValidate = true,
  disabled = false
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<{
    isValid: boolean;
    confidence: number;
    risk_level: string;
    message: string;
  } | null>(null);
  
  const { validateChat } = useGuardrailsAPI();
  
  const handleValidation = useCallback(async (message: string) => {
    if (!message.trim() || disabled) return;
    
    setIsValidating(true);
    try {
      const result = await validateChat(message);
      setLastValidation(result);
      onValidation(result.isValid, result.confidence, result.message);
    } catch (error) {
      console.error('Chat validation failed:', error);
      onValidation(false, 0, 'Validation service unavailable');
    } finally {
      setIsValidating(false);
    }
  }, [validateChat, onValidation, disabled]);
  
  return (
    <div className="chat-validation-wrapper">
      {isValidating && (
        <div className="validation-indicator">
          <div className="spinner" />
          <span>Validating message...</span>
        </div>
      )}
      
      {lastValidation && (
        <div className={`validation-result ${lastValidation.isValid ? 'valid' : 'invalid'}`}>
          <div className="validation-badge">
            {lastValidation.isValid ? '✅' : '⚠️'}
            <span>
              {lastValidation.isValid ? 'Safe' : 'Review Required'} 
              ({Math.round(lastValidation.confidence * 100)}% confidence)
            </span>
          </div>
          
          {!lastValidation.isValid && (
            <div className="validation-message">
              <strong>Risk Level:</strong> {lastValidation.risk_level}<br />
              <strong>Recommendation:</strong> {lastValidation.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface AppointmentValidationProps {
  appointmentData: {
    patient_name: string;
    preferred_date: string;
    reason: string;
    urgency_level: string;
  };
  onValidation: (result: any) => void;
}

export const AppointmentValidationComponent: React.FC<AppointmentValidationProps> = ({
  appointmentData,
  onValidation
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const { validateAppointment } = useGuardrailsAPI();
  
  const handleValidateAppointment = async () => {
    setIsValidating(true);
    try {
      const result = await validateAppointment(appointmentData);
      onValidation(result);
    } catch (error) {
      console.error('Appointment validation failed:', error);
      onValidation({ isValid: false, message: 'Validation failed' });
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <div className="appointment-validation">
      <button 
        onClick={handleValidateAppointment}
        disabled={isValidating}
        className="validate-btn"
      >
        {isValidating ? 'Validating...' : 'Validate Appointment'}
      </button>
    </div>
  );
};

interface EmergencyTriageProps {
  symptoms: string;
  severity: string;
  duration: string;
  patientAge: number;
  onTriageResult: (result: any) => void;
}

export const EmergencyTriageComponent: React.FC<EmergencyTriageProps> = ({
  symptoms,
  severity,
  duration,
  patientAge,
  onTriageResult
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { validateEmergency } = useGuardrailsAPI();
  
  const handleEmergencyTriage = async () => {
    setIsProcessing(true);
    try {
      const result = await validateEmergency({
        symptoms,
        severity,
        duration,
        patient_age: patientAge
      });
      onTriageResult(result);
    } catch (error) {
      console.error('Emergency triage failed:', error);
      onTriageResult({ 
        isValid: false, 
        risk_level: 'unknown',
        message: 'Triage service unavailable - please seek immediate medical attention' 
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="emergency-triage">
      <div className="triage-warning">
        <strong>⚕️ Emergency Triage Assessment</strong>
        <p>This is an AI-assisted preliminary assessment. Always seek professional medical help for emergencies.</p>
      </div>
      
      <button 
        onClick={handleEmergencyTriage}
        disabled={isProcessing}
        className="triage-btn emergency"
      >
        {isProcessing ? 'Processing...' : 'Get Triage Assessment'}
      </button>
    </div>
  );
};

// Validation status hook for real-time feedback
export const useValidationStatus = () => {
  const [validationQueue, setValidationQueue] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  
  const addToQueue = (validationType: string) => {
    setValidationQueue(prev => [...prev, validationType]);
  };
  
  const removeFromQueue = (validationType: string) => {
    setValidationQueue(prev => prev.filter(item => item !== validationType));
  };
  
  return {
    validationQueue,
    isConnected,
    addToQueue,
    removeFromQueue,
    queueLength: validationQueue.length
  };
};
