#!/usr/bin/env python3
"""
Test suite for Guardrails AI integration
Comprehensive testing for all validation functions and API endpoints
"""

import pytest
import asyncio
import requests
import json
from datetime import datetime
from typing import Dict, Any

# Import our modules
from config import validate_ai_response, guardrails_config
from api import app
from fastapi.testclient import TestClient

# Create test client
client = TestClient(app)

class TestGuardrailsConfig:
    """Test the core Guardrails configuration"""
    
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

class TestGuardrailsAPI:
    """Test the FastAPI endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Guardrails API - Sorriso Inteligente"
        assert "endpoints" in data
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "services" in data
    
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
                "id": "req_1",
                "type": "chat",
                "data": {
                    "message": "Olá, como posso ajudar?",
                    "intent": "greeting"
                }
            },
            {
                "id": "req_2",
                "type": "appointment",
                "data": {
                    "patient_name": "Test Patient",
                    "contact_phone": "(35) 99999-9999",
                    "preferred_date": "2025-06-15",
                    "preferred_time": "14:00",
                    "service_type": "consulta-rotina",
                    "urgency_level": "routine"
                }
            }
        ]
        
        response = client.post("/batch/validate", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["batch_size"] == 2
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

class TestSpecialCases:
    """Test special cases and edge conditions"""
    
    def test_emergency_keywords_detection(self):
        """Test detection of emergency keywords"""
        emergency_symptoms = [
            "sangramento intenso na boca",
            "dente quebrado por acidente",
            "inchaço grave no rosto",
            "febre alta com dor de dente"
        ]
        
        for symptoms in emergency_symptoms:
            result = validate_ai_response(
                symptoms, 
                "emergency", 
                patient_info={"id": "test", "name": "Test"}
            )
            
            # Should be flagged as emergency or high priority
            assert result["status"] in ["valid", "emergency_fallback"]
            if result["status"] == "valid":
                assert result.get("immediate_action_required", False) or \
                       result.get("triage_result", {}).get("severity_level") == "immediate"
    
    def test_invalid_input_handling(self):
        """Test handling of invalid inputs"""
        # Test with None input
        result = validate_ai_response(None, "chat")
        assert result["status"] == "invalid"
        
        # Test with invalid appointment data
        invalid_appointment = {
            "patient_name": "",  # Empty name
            "contact_phone": "invalid_phone",
            "preferred_date": "invalid_date",
            "preferred_time": "25:99",  # Invalid time
            "service_type": "unknown_service",
            "urgency_level": "invalid_urgency"
        }
        
        result = validate_ai_response("", "appointment", appointment_data=invalid_appointment)
        assert result["status"] == "invalid"
    
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
        high_risk_scenarios = [
            ("emergency", "Dor insuportável, não consigo abrir a boca", {"id": "test"}),
            ("chat", "Preciso de cirurgia urgente", {}),
            ("clinical", "Tome este medicamento sem prescrição", {})
        ]
        
        for response_type, content, kwargs in high_risk_scenarios:
            result = validate_ai_response(content, response_type, **kwargs)
            
            # Should require human intervention
            assert result.get("requires_human") == True or \
                   result.get("human_review_required") == True or \
                   result.get("immediate_human_required") == True

def run_integration_tests():
    """Run integration tests with live API"""
    print("🧪 Running Guardrails Integration Tests")
    
    # Test API connectivity
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ API server is running")
        else:
            print("⚠️ API server is not responding correctly")
            return False
    except requests.RequestException:
        print("❌ API server is not running. Start with: python api.py")
        return False
    
    # Test sample requests
    test_cases = [
        {
            "endpoint": "/validate/chat",
            "data": {
                "message": "Olá! Como posso agendar uma consulta?",
                "intent": "appointment"
            }
        },
        {
            "endpoint": "/validate/appointment",
            "data": {
                "patient_name": "João Silva",
                "contact_phone": "(35) 99999-9999",
                "preferred_date": "2025-06-15",
                "preferred_time": "14:00",
                "service_type": "limpeza",
                "urgency_level": "routine"
            }
        }
    ]
    
    for test_case in test_cases:
        try:
            response = requests.post(
                f"http://localhost:8000{test_case['endpoint']}", 
                json=test_case['data'],
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ {test_case['endpoint']} - OK")
            else:
                print(f"❌ {test_case['endpoint']} - Failed ({response.status_code})")
        except requests.RequestException as e:
            print(f"❌ {test_case['endpoint']} - Error: {e}")
    
    print("🎯 Integration tests completed")
    return True

if __name__ == "__main__":
    # Run unit tests
    print("🧪 Starting Guardrails Test Suite")
    
    # Run pytest
    pytest.main([__file__, "-v"])
    
    # Run integration tests
    print("\n" + "="*50)
    run_integration_tests()
