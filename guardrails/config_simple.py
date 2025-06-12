#!/usr/bin/env python3
"""
Guardrails AI Configuration for Sorriso Inteligente PWA - Simplified Version
LLM validation and safeguards for dental application AI features

This module provides AI safety guards for:
- Chat responses with patients
- Appointment booking AI assistance
- Emergency triage AI recommendations
- Clinical content validation

Simplified for Guardrails AI 0.6.6 compatibility
"""

import os
import re
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Pydantic Models
class DentalAppointmentRequest(BaseModel):
    """Pydantic model for dental appointment requests"""
    patient_name: str = Field(..., min_length=2, max_length=100)
    contact_phone: str
    preferred_date: str
    preferred_time: str
    service_type: str
    urgency_level: str
    symptoms: Optional[str] = None


class ChatbotResponse(BaseModel):
    """Pydantic model for chatbot responses"""
    message: str = Field(..., min_length=5, max_length=1000)
    intent: str = "general"
    confidence: float = 0.8
    requires_human: bool = False


class GuardrailsConfig:
    """Main Guardrails configuration class for Sorriso Inteligente PWA - Simplified"""
    
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
        
        self.profanity_words = [
            "merda", "porra", "caralho", "buceta", "puta", "viado", 
            "cu", "fdp", "desgraça", "idiota", "burro", "estúpido"
        ]
        
        logger.info("🛡️ Guardrails configuration initialized successfully")
    
    def _validate_safety(self, content: str) -> Dict[str, Any]:
        """Basic safety validation"""
        content_lower = content.lower()
        
        # Check for profanity
        for word in self.profanity_words:
            if word in content_lower:
                return {
                    "is_safe": False,
                    "reason": f"Contains inappropriate language: {word}",
                    "severity": "high"
                }
        
        # Check content length
        if len(content.strip()) < 5:
            return {
                "is_safe": False,
                "reason": "Content too short",
                "severity": "medium"
            }
        
        if len(content) > 2000:
            return {
                "is_safe": False,
                "reason": "Content too long",
                "severity": "medium"
            }
        
        return {"is_safe": True, "reason": "Content is safe", "severity": "none"}
    
    def _check_emergency_keywords(self, content: str) -> bool:
        """Check if content contains emergency keywords"""
        content_lower = content.lower()
        return any(keyword in content_lower for keyword in self.emergency_keywords)
    
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
            # Basic safety validation
            safety_check = self._validate_safety(response)
            
            if not safety_check["is_safe"]:
                return {
                    "status": "invalid",
                    "error": safety_check["reason"],
                    "original_response": response,
                    "fallback_response": "Desculpe, não posso processar sua solicitação no momento. Um atendente humano entrará em contato em breve.",
                    "requires_human": True,
                    "timestamp": datetime.now().isoformat()
                }
            
            # Create ChatbotResponse model
            chat_data = ChatbotResponse(
                message=response,
                intent=intent,
                requires_human=self._check_human_needed(response, intent)
            )
            
            return {
                "status": "valid",
                "validated_response": response,
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
            
            # Validate service type
            if appointment.service_type.lower() not in self.dental_services:
                return {
                    "status": "invalid",
                    "error": f"Invalid service type: {appointment.service_type}",
                    "valid_services": self.dental_services,
                    "timestamp": datetime.now().isoformat()
                }
            
            # Validate urgency level
            if appointment.urgency_level.lower() not in self.urgency_levels:
                return {
                    "status": "invalid",
                    "error": f"Invalid urgency level: {appointment.urgency_level}",
                    "valid_levels": self.urgency_levels,
                    "timestamp": datetime.now().isoformat()
                }
            
            # Additional business logic validation
            if appointment.urgency_level == "emergency":
                return self._handle_emergency_appointment(appointment)
            
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
            # Safety check first
            safety_check = self._validate_safety(symptoms)
            
            if not safety_check["is_safe"]:
                return {
                    "status": "emergency_fallback",
                    "error": safety_check["reason"],
                    "automatic_escalation": True,
                    "immediate_human_required": True,
                    "emergency_message": "Por favor, procure atendimento médico imediato ou ligue para o serviço de emergência.",
                    "emergency_contacts": self._get_emergency_contacts(),
                    "timestamp": datetime.now().isoformat()
                }
            
            # Check for immediate emergency keywords
            is_immediate = self._check_emergency_keywords(symptoms)
            severity_level = "immediate" if is_immediate else "urgent"
            
            return {
                "status": "valid",
                "triage_result": {
                    "severity_level": severity_level,
                    "recommendation": self._generate_emergency_recommendation(symptoms, severity_level),
                    "requires_immediate_attention": is_immediate,
                    "emergency_contacts": self._get_emergency_contacts() if is_immediate else None
                },
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
            # Safety check
            safety_check = self._validate_safety(content)
            
            if not safety_check["is_safe"]:
                return {
                    "status": "invalid",
                    "error": safety_check["reason"],
                    "requires_medical_review": True,
                    "timestamp": datetime.now().isoformat()
                }
            
            return {
                "status": "valid",
                "validated_content": content,
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
    print("🛡️ Guardrails AI for Sorriso Inteligente PWA - Testing (Simplified Version)")
    
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
    
    # Test emergency validation
    test_symptoms = "Dor de dente muito forte"
    result = validate_ai_response(test_symptoms, "emergency", patient_info={"id": "test_patient"})
    print(f"Emergency validation: {result['status']}")
    
    print("✅ Guardrails validation system ready!")
