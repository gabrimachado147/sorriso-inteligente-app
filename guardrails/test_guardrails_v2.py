#!/usr/bin/env python3
"""
Test suite for Guardrails AI integration - Version 2
Comprehensive testing for all validation functions and API endpoints
Updated for Guardrails AI 0.6.6
"""

import pytest
import asyncio
import requests
import json
from datetime import datetime
from typing import Dict, Any

# Import our modules
from config_v2 import validate_ai_response, guardrails_config
from api_v2 import app
from fastapi.testclient import TestClient

# Create test client
client = TestClient(app)

class TestGuardrailsConfigV2:
    """Test the core Guardrails configuration - Version 2"""
    
    def test_chat_response_validation_valid(self):
        """Test valid chat response validation"""
        response = "Olá! Posso ajudá-lo a agendar uma consulta. Qual serviço você precisa?"
        result = validate_ai_response(response, "chat", intent="greeting")
        
        assert result["status"] == "valid"
        assert "validated_response" in result
        assert result["safety_score"] > 0.5
    
    def test_chat_response_validation_invalid(self):
        """Test invalid chat response validation"""
        response = ""  # Empty response
        result = validate_ai_response(response, "chat", intent="general")
        
        assert result["status"] == "invalid"
        assert "fallback_response" in result
        assert result["requires_human"] == True
    
    def test_appointment_validation_valid(self):
        """Test valid appointment validation"""
        appointment_data = {
            "patient_name": "João Silva",
            "contact_phone": "(35) 99999-9999",
            "preferred_date": "2025-06-15",
            "preferred_time": "14:00",
            "service_type": "limpeza",
            "urgency_level": "routine",
            "symptoms": "Limpeza preventiva"
        }
        
        result = validate_ai_response("", "appointment", appointment_data=appointment_data)
        
        assert result["status"] == "valid"
        assert "validated_appointment" in result
        assert result["priority_level"] >= 1
    
    def test_appointment_validation_emergency(self):
        """Test emergency appointment validation"""
        appointment_data = {
            "patient_name": "Maria Santos",
            "contact_phone": "(35) 99888-8888",
            "preferred_date": "2025-06-12",
            "preferred_time": "09:00",
            "service_type": "emergência",
            "urgency_level": "emergency",
            "symptoms": "Dor intensa no dente"
        }
        
        result = validate_ai_response("", "appointment", appointment_data=appointment_data)
        
        assert result["status"] == "emergency_appointment"
        assert result["immediate_booking"] == True
        assert result["human_confirmation_required"] == True
    
    def test_emergency_triage_validation(self):
        """Test emergency triage validation"""
        symptoms = "Dor de dente muito forte, não consigo dormir"
        patient_info = {"id": "test_patient_123", "name": "Test Patient"}
        
        result = validate_ai_response(symptoms, "emergency", patient_info=patient_info)
        
        assert result["status"] in ["valid", "emergency_fallback"]
        assert result["human_review_required"] == True
        assert "triage_result" in result or "emergency_message" in result
    
    def test_clinical_content_validation(self):
        """Test clinical content validation"""
        content = "A limpeza dental é um procedimento preventivo importante que deve ser realizada a cada 6 meses para manter a saúde bucal."
        
        result = validate_ai_response(content, "clinical", content_type="procedure")
        
        assert result["status"] == "valid"
        assert result["medical_disclaimer_required"] == True
        assert "validated_content" in result

class TestGuardrailsAPIV2:
    """Test the FastAPI endpoints - Version 2"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Guardrails API - Sorriso Inteligente (v2)"
        assert data["version"] == "2.0.0"
        assert "endpoints" in data
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "services" in data
        assert data["version"] == "2.0.0"
    
    def test_metrics_endpoint(self):
        """Test metrics endpoint"""
        response = client.get("/metrics")
        assert response.status_code == 200
        data = response.json()
        assert "metrics" in data
        assert "total_requests" in data["metrics"]
    
    def test_chat_validation_endpoint(self):
        """Test chat validation endpoint"""
        request_data = {
            "message": "Olá, gostaria de agendar uma consulta",
            "intent": "appointment",
            "user_id": "test_user_123"
        }
        
        response = client.post("/validate/chat", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "data" in data
    
    def test_appointment_validation_endpoint(self):
        """Test appointment validation endpoint"""
        request_data = {
            "patient_name": "João Silva",
            "contact_phone": "(35) 99999-9999",
            "preferred_date": "2025-06-15",
            "preferred_time": "14:00",
            "service_type": "limpeza",
            "urgency_level": "routine",
            "symptoms": "Limpeza preventiva"
        }
        
        response = client.post("/validate/appointment", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
    
    def test_emergency_validation_endpoint(self):
        """Test emergency validation endpoint"""
        request_data = {
            "symptoms": "Dor muito forte no dente, inchaço na face",
            "patient_info": {
                "id": "emergency_patient_456",
                "name": "Emergency Patient",
                "age": 35
            },
            "severity_assessment": "urgent"
        }
        
        response = client.post("/validate/emergency", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["success", "emergency_fallback"]
    
    def test_clinical_validation_endpoint(self):
        """Test clinical validation endpoint"""
        request_data = {
            "content": "O clareamento dental é um procedimento estético que pode clarear os dentes em várias tonalidades. É importante seguir as orientações do dentista.",
            "content_type": "procedure",
            "target_audience": "patients"
        }
        
        response = client.post("/validate/clinical", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
    
    def test_batch_validation_endpoint(self):
        """Test batch validation endpoint"""
        request_data = [
            {
                "type": "chat",
                "content": "Hello, how can I help you?",
                "kwargs": {"intent": "greeting"}
            },
            {
                "type": "clinical",
                "content": "Dental hygiene is important for oral health.",
                "kwargs": {"content_type": "advice"}
            }
        ]
        
        response = client.post("/batch/validate", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert len(data["results"]) == 2
    
    def test_config_endpoints(self):
        """Test configuration endpoints"""
        # Test services endpoint
        response = client.get("/config/services")
        assert response.status_code == 200
        data = response.json()
        assert "dental_services" in data
        assert "urgency_levels" in data
        
        # Test guards endpoint
        response = client.get("/config/guards")
        assert response.status_code == 200
        data = response.json()
        assert "guards" in data
        assert "chat_guard" in data["guards"]
        assert data["version"] == "2.0.0"
        assert data["guardrails_version"] == "0.6.6"

class TestSpecialCasesV2:
    """Test special cases and edge conditions - Version 2"""
    
    def test_profanity_detection(self):
        """Test profanity detection in chat responses"""
        profane_responses = [
            "Esse dentista é uma merda",
            "Que porra de atendimento é esse?",
            "Vai se foder"
        ]
        
        for response in profane_responses:
            result = validate_ai_response(response, "chat")
            assert result["status"] == "invalid"
            assert "inappropriate language" in str(result.get("error", "")).lower()
    
    def test_emergency_keywords_detection(self):
        """Test detection of emergency keywords"""
        emergency_symptoms = [
            "Sangramento intenso na boca",
            "Dente quebrou em acidente",
            "Trauma na face, muito inchaço"
        ]
        
        for symptom in emergency_symptoms:
            result = validate_ai_response(symptom, "emergency", patient_info={"id": "test"})
            assert result["status"] in ["valid", "emergency_fallback"]
            if result["status"] == "valid":
                assert result["immediate_action_required"] == True
    
    def test_invalid_input_handling(self):
        """Test handling of invalid inputs"""
        # Test with None input
        result = validate_ai_response(None, "chat")
        assert result["status"] == "error"
        
        # Test with invalid response type
        result = validate_ai_response("test", "invalid_type")
        assert result["status"] == "invalid"
        assert "Unknown response type" in result["error"]
    
    def test_safety_scoring(self):
        """Test safety scoring functionality"""
        safe_responses = [
            "Como posso ajudá-lo hoje?",
            "Sua consulta está agendada para amanhã.",
            "Recomendamos uma limpeza a cada 6 meses."
        ]
        
        for response in safe_responses:
            result = validate_ai_response(response, "chat")
            if result["status"] == "valid":
                assert result["safety_score"] >= 0.7
    
    def test_human_intervention_triggers(self):
        """Test scenarios that should trigger human intervention"""
        intervention_cases = [
            "Estou com dor de dente há uma semana",
            "Preciso de uma emergência dental",
            "Meu dente está sangrando muito"
        ]
        
        for case in intervention_cases:
            result = validate_ai_response(case, "chat")
            if result["status"] == "valid":
                assert result.get("requires_human", False) == True

def run_integration_tests():
    """Run integration tests with live API"""
    print("\n🧪 Running Integration Tests for Guardrails v2")
    
    try:
        # Test if we can import everything
        from config_v2 import GuardrailsConfig
        from api_v2 import app
        
        # Test basic functionality
        config = GuardrailsConfig()
        result = config.validate_chat_response("Test message", "test")
        print(f"✅ Basic validation test: {result['status']}")
        
        # Test API client
        with TestClient(app) as test_client:
            response = test_client.get("/health")
            if response.status_code == 200:
                print("✅ API health check: PASSED")
            else:
                print("❌ API health check: FAILED")
        
        print("🎉 Integration tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Integration test failed: {str(e)}")

if __name__ == "__main__":
    # Run unit tests
    print("🧪 Starting Guardrails Test Suite v2")
    
    # Run pytest
    pytest.main([__file__, "-v"])
    
    # Run integration tests
    print("\n" + "="*50)
    run_integration_tests()
