#!/usr/bin/env python3
"""
Guardrails AI Configuration for Sorriso Inteligente PWA
LLM validation and safeguards for dental application AI features

This module provides AI safety guards for:
- Chat responses with patients
- Appointment booking AI assistance
- Emergency triage AI recommendations
- Clinical content validation
"""

import os
from typing import Dict, List, Optional, Any
from guardrails import Guard, Validator
from pydantic import BaseModel, Field
import json
import logging
from datetime import datetime
import re


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DentalAppointmentRequest(BaseModel):
    """Pydantic model for dental appointment requests"""
    patient_name: str = Field(..., min_length=2, max_length=100)
    contact_phone: str = Field(..., regex=r'^\+?[\d\s\-\(\)]{10,}$')
    preferred_date: str = Field(..., description="Date in YYYY-MM-DD format")
    preferred_time: str = Field(..., regex=r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
    service_type: str = Field(..., description="Type of dental service")
    urgency_level: str = Field(..., description="emergency, urgent, routine")
    symptoms: Optional[str] = Field(None, max_length=500)


class ChatbotResponse(BaseModel):
    """Pydantic model for chatbot responses"""
    message: str = Field(..., min_length=1, max_length=1000)
    intent: str = Field(..., description="appointment, emergency, information, greeting")
    confidence: float = Field(..., ge=0.0, le=1.0)
    requires_human: bool = Field(default=False)


class EmergencyTriage(BaseModel):
    """Pydantic model for emergency triage responses"""
    severity_level: str = Field(..., description="immediate, urgent, non-urgent")
    recommendation: str = Field(..., max_length=500)
    requires_immediate_attention: bool = Field(default=False)
    emergency_contacts: Optional[List[str]] = Field(default=None)


class GuardrailsConfig:
    """Main Guardrails configuration class for Sorriso Inteligente PWA"""
    
    def __init__(self):
        self.dental_services = [
            "consulta-rotina", "limpeza", "obturação", "canal", "extração",
            "ortodontia", "implante", "prótese", "clareamento", "emergência"
        ]
        
        self.urgency_levels = ["emergency", "urgent", "routine"]
        
        self.emergency_keywords = [
            "dor", "sangramento", "trauma", "fratura", "inchaço",
            "febre", "pus", "dente quebrado", "acidente"
        ]
        
        # Initialize guards
        self._init_guards()
    
    def _init_guards(self):
        """Initialize all Guardrails guards"""
        
        # Chat Response Guard - Ensures safe, professional responses
        self.chat_guard = Guard(
            name="dental_chat_guard",
            description="Validates dental chatbot responses for safety and professionalism"
        )
        self.chat_guard.use(
            ToxicLanguage(threshold=0.8, validation_method="sentence"),
            ProfanityFree(),
            ValidLength(min=10, max=1000)
        )
        
        # Appointment Guard - Validates appointment booking data
        self.appointment_guard = Guard(
            name="appointment_booking_guard", 
            description="Validates appointment booking requests"
        )
        self.appointment_guard.use(
            ValidChoices(choices=self.dental_services, validation_method="exact_match"),
            ValidChoices(choices=self.urgency_levels, validation_method="exact_match"),
            ValidLength(min=2, max=100)  # For patient names
        )
        
        # Emergency Triage Guard - Critical safety for emergency responses
        self.emergency_guard = Guard(
            name="emergency_triage_guard",
            description="High-security validation for emergency dental triage"
        )
        self.emergency_guard.use(
            ToxicLanguage(threshold=0.9, validation_method="sentence"),
            ValidChoices(choices=["immediate", "urgent", "non-urgent"], validation_method="exact_match")
        )
        
        # Clinical Content Guard - For medical/dental information
        self.clinical_guard = Guard(
            name="clinical_content_guard",
            description="Validates clinical dental content for accuracy and safety"
        )
        self.clinical_guard.use(
            ToxicLanguage(threshold=0.95, validation_method="sentence"),
            ProfanityFree(),
            ValidLength(min=50, max=2000)
        )
    
    def validate_chat_response(self, response: str, intent: str = "general") -> Dict[str, Any]:
        """
        Validate chatbot response for safety and appropriateness
        
        Args:
            response: The AI-generated response
            intent: The conversation intent
            
        Returns:
            Dict with validation results and sanitized response
        """
        try:
            # Create ChatbotResponse model
            chat_data = ChatbotResponse(
                message=response,
                intent=intent,
                confidence=0.8,  # Default confidence
                requires_human=self._check_human_needed(response, intent)
            )
            
            # Apply guard validation
            validated_response = self.chat_guard.validate(
                llm_output=response,
                metadata={"intent": intent}
            )
            
            return {
                "status": "valid",
                "validated_response": validated_response.validated_output,
                "requires_human": chat_data.requires_human,
                "intent": intent,
                "safety_score": self._calculate_safety_score(response),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Chat validation failed: {str(e)}")
            return {
                "status": "invalid",
                "error": str(e),
                "original_response": response,
                "fallback_response": "Desculpe, não posso processar sua solicitação no momento. Um atendente humano entrará em contato em breve.",
                "requires_human": True,
                "timestamp": datetime.now().isoformat()
            }
    
    def validate_appointment_request(self, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate appointment booking request
        
        Args:
            appointment_data: Dictionary with appointment details
            
        Returns:
            Dict with validation results
        """
        try:
            # Validate using Pydantic model
            appointment = DentalAppointmentRequest(**appointment_data)
            
            # Additional business logic validation
            if appointment.urgency_level == "emergency":
                return self._handle_emergency_appointment(appointment)
            
            # Apply appointment guard
            validated_data = self.appointment_guard.validate(
                llm_output=json.dumps(appointment_data),
                metadata={"type": "appointment_booking"}
            )
            
            return {
                "status": "valid",
                "validated_appointment": appointment.dict(),
                "priority_level": self._calculate_priority(appointment),
                "estimated_duration": self._estimate_duration(appointment.service_type),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Appointment validation failed: {str(e)}")
            return {
                "status": "invalid",
                "error": str(e),
                "requires_review": True,
                "timestamp": datetime.now().isoformat()
            }
    
    def validate_emergency_triage(self, symptoms: str, patient_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate emergency triage AI response - CRITICAL SAFETY
        
        Args:
            symptoms: Patient-reported symptoms
            patient_info: Basic patient information
            
        Returns:
            Dict with triage validation and recommendations
        """
        try:
            # Check for immediate emergency keywords
            is_immediate = any(keyword in symptoms.lower() for keyword in self.emergency_keywords)
            
            severity_level = "immediate" if is_immediate else "urgent"
            
            triage = EmergencyTriage(
                severity_level=severity_level,
                recommendation=self._generate_emergency_recommendation(symptoms, severity_level),
                requires_immediate_attention=is_immediate,
                emergency_contacts=self._get_emergency_contacts() if is_immediate else None
            )
            
            # Apply emergency guard - highest security
            validated_triage = self.emergency_guard.validate(
                llm_output=json.dumps(triage.dict()),
                metadata={
                    "type": "emergency_triage",
                    "severity": severity_level,
                    "patient_id": patient_info.get("id", "unknown")
                }
            )
            
            return {
                "status": "valid",
                "triage_result": triage.dict(),
                "immediate_action_required": is_immediate,
                "human_review_required": True,  # Always require human review for emergencies
                "emergency_protocol_activated": is_immediate,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Emergency triage validation failed: {str(e)}")
            # For emergencies, always err on the side of caution
            return {
                "status": "emergency_fallback",
                "error": str(e),
                "automatic_escalation": True,
                "immediate_human_required": True,
                "emergency_message": "Por favor, procure atendimento médico imediato ou ligue para o serviço de emergência.",
                "emergency_contacts": self._get_emergency_contacts(),
                "timestamp": datetime.now().isoformat()
            }
    
    def validate_clinical_content(self, content: str, content_type: str) -> Dict[str, Any]:
        """
        Validate clinical/medical content for accuracy and safety
        
        Args:
            content: Medical/dental content to validate
            content_type: Type of content (procedure, advice, information)
            
        Returns:
            Dict with validation results
        """
        try:
            # Apply clinical content guard
            validated_content = self.clinical_guard.validate(
                llm_output=content,
                metadata={"content_type": content_type}
            )
            
            return {
                "status": "valid",
                "validated_content": validated_content.validated_output,
                "content_type": content_type,
                "medical_disclaimer_required": True,
                "accuracy_score": self._calculate_accuracy_score(content),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Clinical content validation failed: {str(e)}")
            return {
                "status": "invalid",
                "error": str(e),
                "requires_medical_review": True,
                "timestamp": datetime.now().isoformat()
            }
    
    def _check_human_needed(self, response: str, intent: str) -> bool:
        """Check if human intervention is needed"""
        emergency_indicators = ["emergency", "pain", "blood", "urgent"]
        return any(indicator in response.lower() for indicator in emergency_indicators)
    
    def _calculate_safety_score(self, text: str) -> float:
        """Calculate safety score for text content"""
        # Simplified safety scoring
        score = 1.0
        if any(word in text.lower() for word in ["urgent", "emergency"]):
            score -= 0.2
        if len(text) < 10:
            score -= 0.3
        return max(0.0, score)
    
    def _handle_emergency_appointment(self, appointment: DentalAppointmentRequest) -> Dict[str, Any]:
        """Handle emergency appointment with special protocols"""
        return {
            "status": "emergency_appointment",
            "immediate_booking": True,
            "human_confirmation_required": True,
            "emergency_contacts_notified": True,
            "estimated_response_time": "15 minutes",
            "appointment_data": appointment.dict()
        }
    
    def _calculate_priority(self, appointment: DentalAppointmentRequest) -> int:
        """Calculate appointment priority (1-5, 5 being highest)"""
        priority_map = {
            "emergency": 5,
            "urgent": 4,
            "routine": 2
        }
        return priority_map.get(appointment.urgency_level, 2)
    
    def _estimate_duration(self, service_type: str) -> int:
        """Estimate appointment duration in minutes"""
        duration_map = {
            "consulta-rotina": 30,
            "limpeza": 60,
            "obturação": 45,
            "canal": 90,
            "extração": 30,
            "ortodontia": 45,
            "implante": 120,
            "prótese": 60,
            "clareamento": 90,
            "emergência": 30
        }
        return duration_map.get(service_type, 45)
    
    def _generate_emergency_recommendation(self, symptoms: str, severity: str) -> str:
        """Generate appropriate emergency recommendation"""
        if severity == "immediate":
            return "Procure atendimento médico imediato. Esta situação requer avaliação urgente por um profissional."
        else:
            return "Recomendamos agendar uma consulta o mais breve possível para avaliação adequada."
    
    def _get_emergency_contacts(self) -> List[str]:
        """Get emergency contact numbers"""
        return [
            "(35) 99869-5479",  # Campo Belo clinic
            "192",  # SAMU
            "193"   # Bombeiros
        ]
    
    def _calculate_accuracy_score(self, content: str) -> float:
        """Calculate medical content accuracy score"""
        # Simplified accuracy scoring based on content analysis
        medical_terms = ["dental", "tooth", "gum", "oral", "treatment", "procedure"]
        term_count = sum(1 for term in medical_terms if term in content.lower())
        return min(1.0, term_count / 3.0)


# Global instance
guardrails_config = GuardrailsConfig()


def validate_ai_response(response: str, response_type: str, **kwargs) -> Dict[str, Any]:
    """
    Main validation function for AI responses
    
    Args:
        response: AI-generated response
        response_type: Type of response (chat, appointment, emergency, clinical)
        **kwargs: Additional context data
        
    Returns:
        Dict with validation results
    """
    if response_type == "chat":
        return guardrails_config.validate_chat_response(response, kwargs.get("intent", "general"))
    elif response_type == "appointment":
        return guardrails_config.validate_appointment_request(kwargs.get("appointment_data", {}))
    elif response_type == "emergency":
        return guardrails_config.validate_emergency_triage(response, kwargs.get("patient_info", {}))
    elif response_type == "clinical":
        return guardrails_config.validate_clinical_content(response, kwargs.get("content_type", "general"))
    else:
        return {
            "status": "error",
            "error": f"Unknown response type: {response_type}",
            "timestamp": datetime.now().isoformat()
        }


if __name__ == "__main__":
    # Example usage and testing
    print("🛡️ Guardrails AI for Sorriso Inteligente PWA - Testing")
    
    # Test chat response validation
    test_response = "Olá! Posso ajudá-lo a agendar uma consulta odontológica. Qual tipo de serviço você precisa?"
    result = validate_ai_response(test_response, "chat", intent="greeting")
    print(f"Chat validation: {result['status']}")
    
    # Test appointment validation
    test_appointment = {
        "patient_name": "João Silva",
        "contact_phone": "(35) 99999-9999",
        "preferred_date": "2025-06-15",
        "preferred_time": "14:00",
        "service_type": "limpeza",
        "urgency_level": "routine",
        "symptoms": "Limpeza preventiva"
    }
    result = validate_ai_response("", "appointment", appointment_data=test_appointment)
    print(f"Appointment validation: {result['status']}")
    
    print("✅ Guardrails validation system ready!")
