#!/usr/bin/env python3
"""
Guardrails AI Configuration for Sorriso Inteligente PWA - Version 2
LLM validation and safeguards for dental application AI features

This module provides AI safety guards for:
- Chat responses with patients
- Appointment booking AI assistance
- Emergency triage AI recommendations
- Clinical content validation

Updated for Guardrails AI 0.6.6
"""

import os
import re
import json
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field, validator
from guardrails import Guard
from guardrails.validators import Validator, PassResult, FailResult
from typing import Union

ValidationResult = Union[PassResult, FailResult]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Custom Validators for Dental Application
class DentalSafetyValidator(Validator):
    """Custom validator for dental content safety"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.profanity_words = [
            "merda", "porra", "caralho", "buceta", "puta", "viado", 
            "cu", "fdp", "desgraça", "idiota", "burro", "estúpido"
        ]
        self.emergency_keywords = [
            "dor", "sangramento", "trauma", "fratura", "inchaço",
            "febre", "pus", "dente quebrado", "acidente", "emergência"
        ]
    
    def validate(self, value: Any, metadata: Dict = None) -> ValidationResult:
        """Validate content for safety and appropriateness"""
        if not isinstance(value, str):
            return FailResult(error_message="Input must be a string")
        
        content = value.lower()
        
        # Check for profanity
        for word in self.profanity_words:
            if word in content:
                return FailResult(error_message=f"Content contains inappropriate language: {word}")
        
        # Check content length
        if len(value.strip()) < 5:
            return FailResult(error_message="Content too short")
        
        if len(value) > 2000:
            return FailResult(error_message="Content too long")
        
        return PassResult()


class DentalChoiceValidator(Validator):
    """Custom validator for dental service choices"""
    
    def __init__(self, choices: List[str], **kwargs):
        super().__init__(**kwargs)
        self.choices = [choice.lower() for choice in choices]
    
    def validate(self, value: Any, metadata: Dict = None) -> ValidationResult:
        """Validate that value is in allowed choices"""
        if not isinstance(value, str):
            return FailResult(error_message="Input must be a string")
        
        if value.lower() not in self.choices:
            return FailResult(
                error_message=f"Invalid choice '{value}'. Must be one of: {', '.join(self.choices)}"
            )
        
        return PassResult()


class EmergencyValidator(Validator):
    """High-security validator for emergency content"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.danger_keywords = [
            "suicídio", "morte", "matar", "morrer", "acabar com tudo",
            "não aguento mais", "quero morrer"
        ]
        self.immediate_keywords = [
            "sangramento intenso", "trauma facial", "dente arrancado",
            "não consigo respirar", "desmaiei", "perdi consciência"
        ]
    
    def validate(self, value: Any, metadata: Dict = None) -> ValidationResult:
        """Validate emergency content with maximum safety"""
        if not isinstance(value, str):
            return FailResult(error_message="Input must be a string")
        
        content = value.lower()
        
        # Check for danger keywords that require immediate human intervention
        for keyword in self.danger_keywords:
            if keyword in content:
                return FailResult(
                    error_message=f"CRITICAL: Content requires immediate human intervention - {keyword}"
                )
        
        # Flag immediate emergency keywords
        for keyword in self.immediate_keywords:
            if keyword in content:
                metadata = metadata or {}
                metadata["immediate_attention"] = True
                metadata["emergency_keyword"] = keyword
        
        return PassResult()


# Pydantic Models
class DentalAppointmentRequest(BaseModel):
    """Pydantic model for dental appointment requests"""
    patient_name: str = Field(..., min_length=2, max_length=100)
    contact_phone: str = Field(..., pattern=r'^\(\d{2}\)\s\d{4,5}-\d{4}$')
    preferred_date: str = Field(..., description="Date in YYYY-MM-DD format")
    preferred_time: str = Field(..., pattern=r'^\d{2}:\d{2}$')
    service_type: str
    urgency_level: str
    symptoms: Optional[str] = Field(None, max_length=500)
    
    @validator('service_type')
    def validate_service_type(cls, v):
        allowed_services = [
            "consulta-rotina", "limpeza", "obturação", "canal", "extração",
            "ortodontia", "implante", "prótese", "clareamento", "emergência"
        ]
        if v.lower() not in allowed_services:
            raise ValueError(f"Invalid service type. Must be one of: {', '.join(allowed_services)}")
        return v.lower()
    
    @validator('urgency_level')
    def validate_urgency_level(cls, v):
        allowed_levels = ["emergency", "urgent", "routine"]
        if v.lower() not in allowed_levels:
            raise ValueError(f"Invalid urgency level. Must be one of: {', '.join(allowed_levels)}")
        return v.lower()


class ChatbotResponse(BaseModel):
    """Pydantic model for chatbot responses"""
    message: str = Field(..., min_length=5, max_length=1000)
    intent: str = Field(default="general")
    confidence: float = Field(default=0.8, ge=0.0, le=1.0)
    requires_human: bool = Field(default=False)


class EmergencyTriage(BaseModel):
    """Pydantic model for emergency triage responses"""
    severity_level: str = Field(..., regex="^(immediate|urgent|non-urgent)$")
    recommendation: str = Field(..., min_length=20, max_length=500)
    requires_immediate_attention: bool = Field(default=False)
    emergency_contacts: Optional[List[str]] = None


class GuardrailsConfig:
    """Main Guardrails configuration class for Sorriso Inteligente PWA - Version 2"""
    
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
        
        logger.info("🛡️ Guardrails configuration initialized successfully")
    
    def _init_guards(self):
        """Initialize all Guardrails guards with custom validators"""
        
        # Chat Response Guard - Ensures safe, professional responses
        self.chat_guard = Guard()
        self.chat_guard.use(DentalSafetyValidator())
        
        # Appointment Guard - Validates appointment booking data
        self.appointment_guard = Guard()
        self.appointment_guard.use(DentalChoiceValidator(choices=self.dental_services))
        self.appointment_guard.use(DentalChoiceValidator(choices=self.urgency_levels))
        
        # Emergency Triage Guard - Critical safety for emergency responses
        self.emergency_guard = Guard()
        self.emergency_guard.use(EmergencyValidator())
        self.emergency_guard.use(DentalSafetyValidator())
        
        # Clinical Content Guard - For medical/dental information
        self.clinical_guard = Guard()
        self.clinical_guard.use(DentalSafetyValidator())
        
        logger.info("✅ All Guardrails guards initialized")
    
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
                requires_human=self._check_human_needed(response, intent)
            )
            
            # Apply guard validation
            validation_result = self.chat_guard.parse(
                llm_output=response,
                metadata={"intent": intent}
            )
            
            return {
                "status": "valid",
                "validated_response": validation_result,
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
            validation_result = self.appointment_guard.parse(
                llm_output=appointment.service_type,
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
            metadata = {
                "type": "emergency_triage",
                "severity": severity_level,
                "patient_id": patient_info.get("id", "unknown")
            }
            
            validation_result = self.emergency_guard.parse(
                llm_output=symptoms,
                metadata=metadata
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
            validation_result = self.clinical_guard.parse(
                llm_output=content,
                metadata={"content_type": content_type}
            )
            
            return {
                "status": "valid",
                "validated_content": validation_result,
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
        response: The AI-generated response
        response_type: Type of response (chat, appointment, emergency, clinical)
        **kwargs: Additional arguments for specific validation types
        
    Returns:
        Dict with validation results
    """
    try:
        if response_type == "chat":
            intent = kwargs.get("intent", "general")
            return guardrails_config.validate_chat_response(response, intent)
        
        elif response_type == "appointment":
            appointment_data = kwargs.get("appointment_data", {})
            return guardrails_config.validate_appointment_request(appointment_data)
        
        elif response_type == "emergency":
            patient_info = kwargs.get("patient_info", {})
            return guardrails_config.validate_emergency_triage(response, patient_info)
        
        elif response_type == "clinical":
            content_type = kwargs.get("content_type", "general")
            return guardrails_config.validate_clinical_content(response, content_type)
        
        else:
            return {
                "status": "invalid",
                "error": f"Unknown response type: {response_type}",
                "timestamp": datetime.now().isoformat()
            }
    
    except Exception as e:
        logger.error(f"Validation error: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "fallback_required": True,
            "timestamp": datetime.now().isoformat()
        }


if __name__ == "__main__":
    # Example usage and testing
    print("🛡️ Guardrails AI for Sorriso Inteligente PWA - Testing (Version 2)")
    
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
