#!/usr/bin/env python3
"""
Comprehensive test suite for Guardrails API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("✅ Health endpoint working")

def test_metrics_endpoint():
    """Test metrics endpoint"""
    print("Testing /metrics endpoint...")
    response = requests.get(f"{BASE_URL}/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "timestamp" in data
    print("✅ Metrics endpoint working")

def test_chat_validation():
    """Test chat validation endpoint"""
    print("Testing /validate/chat endpoint...")
    payload = {
        "message": "Olá, como posso ajudar com seu problema dental?",
        "context": "greeting",
        "user_id": "test_user"
    }
    response = requests.post(f"{BASE_URL}/validate/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "data" in data
    assert data["status"] == "success"
    print("✅ Chat validation endpoint working")

def test_appointment_validation():
    """Test appointment validation endpoint"""
    print("Testing /validate/appointment endpoint...")
    payload = {
        "patient_name": "João Silva",
        "contact_phone": "(11) 99999-9999",
        "preferred_date": "2025-07-15",
        "preferred_time": "14:00",
        "service_type": "limpeza",
        "urgency_level": "routine",
        "symptoms": "Limpeza preventiva"
    }
    response = requests.post(f"{BASE_URL}/validate/appointment", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "data" in data
    print("✅ Appointment validation endpoint working")

def test_emergency_validation():
    """Test emergency validation endpoint"""
    print("Testing /validate/emergency endpoint...")
    payload = {
        "symptoms": "dor de dente muito forte",
        "patient_info": {
            "age": 30,
            "name": "Maria Silva",
            "contact": "(11) 99999-9999"
        },
        "severity_assessment": "high"
    }
    response = requests.post(f"{BASE_URL}/validate/emergency", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "data" in data
    print("✅ Emergency validation endpoint working")

def test_clinical_validation():
    """Test clinical validation endpoint"""
    print("Testing /validate/clinical endpoint...")
    payload = {
        "content": "Recomendo escovação com creme dental com flúor duas vezes ao dia",
        "content_type": "recommendation",
        "target_audience": "patients"
    }
    response = requests.post(f"{BASE_URL}/validate/clinical", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "data" in data
    print("✅ Clinical validation endpoint working")

def run_all_tests():
    """Run all API tests"""
    print("🧪 Running comprehensive Guardrails API tests...\n")
    
    try:
        test_health_endpoint()
        test_metrics_endpoint()
        test_chat_validation()
        test_appointment_validation()
        test_emergency_validation()
        test_clinical_validation()
        
        print("\n🎉 All API tests passed successfully!")
        print("✅ Guardrails API server is fully functional")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        raise

if __name__ == "__main__":
    run_all_tests()
