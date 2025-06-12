import React, { useState, useCallback } from 'react';
import { useAPI } from '../config/api';

// Type definitions for validation results
interface ValidationResult {
  isValid: boolean;
  confidence?: number;
  risk_level: string;
  message: string;
}

interface TriageResult {
  isValid: boolean;
  risk_level: string;
  message: string;
}

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
  
  // Basic client-side validation (replacing Guardrails)
  const validateChat = useCallback(async (message: string) => {
    // Simple validation rules without external API
    const isValid = message.trim().length > 0 && message.trim().length <= 1000;
    const confidence = isValid ? 0.9 : 0.1;
    const risk_level = isValid ? 'low' : 'high';
    
    return {
      isValid,
      confidence,
      risk_level,
      message: isValid ? 'Message is valid' : 'Message is invalid or too long'
    };
  }, []);
  
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
  onValidation: (result: ValidationResult) => void;
}

export const AppointmentValidationComponent: React.FC<AppointmentValidationProps> = ({
  appointmentData,
  onValidation
}) => {
  const [isValidating, setIsValidating] = useState(false);
  
  // Basic appointment validation (replacing Guardrails)
  const validateAppointment = useCallback(async (appointmentData: {
    patient_name: string;
    preferred_date: string;
    reason: string;
    urgency_level: string;
  }) => {
    // Simple validation rules
    const hasRequiredFields = Boolean(appointmentData.patient_name && 
                                     appointmentData.preferred_date && 
                                     appointmentData.reason);
    const isValid = hasRequiredFields;
    const confidence = isValid ? 0.9 : 0.1;
    
    return {
      isValid,
      confidence,
      risk_level: isValid ? 'low' : 'high',
      message: isValid ? 'Appointment data is valid' : 'Missing required appointment information'
    };
  }, []);
  
  const handleValidateAppointment = async () => {
    setIsValidating(true);
    try {
      const result = await validateAppointment(appointmentData);
      onValidation(result);
    } catch (error) {
      console.error('Appointment validation failed:', error);
      onValidation({ 
        isValid: false, 
        confidence: 0,
        risk_level: 'high',
        message: 'Validation failed' 
      });
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
  onTriageResult: (result: TriageResult) => void;
}

export const EmergencyTriageComponent: React.FC<EmergencyTriageProps> = ({
  symptoms,
  severity,
  duration,
  patientAge,
  onTriageResult
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Basic emergency triage (replacing Guardrails)
  const validateEmergency = useCallback(async (emergencyData: {
    symptoms: string;
    severity: string;
    duration: string;
    patient_age: number;
  }) => {
    const emergencyKeywords = ['severe pain', 'bleeding', 'trauma', 'unconscious', 'chest pain'];
    const urgentKeywords = ['pain', 'swelling', 'fever', 'difficulty'];
    
    const hasEmergency = emergencyKeywords.some(keyword => 
      emergencyData.symptoms.toLowerCase().includes(keyword)
    );
    const hasUrgent = urgentKeywords.some(keyword => 
      emergencyData.symptoms.toLowerCase().includes(keyword)
    );
    
    const isValid = true;
    let risk_level: string;
    let message: string;
    
    if (hasEmergency) {
      risk_level = 'high';
      message = 'Emergency conditions detected - seek immediate medical attention';
    } else if (hasUrgent) {
      risk_level = 'medium';
      message = 'Urgent conditions detected - schedule appointment soon';
    } else {
      risk_level = 'low';
      message = 'Routine symptoms - schedule regular appointment';
    }
    
    return { isValid, risk_level, message };
  }, []);
  
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
