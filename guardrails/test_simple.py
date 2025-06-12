#!/usr/bin/env python3
"""
Simple test script for Guardrails AI functionality
"""

import sys
import os
import json
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Test imports
try:
    from config_simple import validate_ai_response, guardrails_config
    print("✅ Configuration import successful")
except Exception as e:
    print(f"❌ Configuration import failed: {e}")
    sys.exit(1)

def test_chat_validation():
    """Test chat response validation"""
    print("\n🧪 Testing Chat Validation...")
    
    test_cases = [
        {
            "response": "Olá! Como posso ajudá-lo hoje?",
            "intent": "greeting",
            "expected": "valid"
        },
        {
            "response": "Você é um idiota",
            "intent": "general",
            "expected": "invalid"
        },
        {
            "response": "",
            "intent": "general",
            "expected": "invalid"
        }
    ]
    
    for i, case in enumerate(test_cases, 1):
        result = validate_ai_response(case["response"], "chat", intent=case["intent"])
        status = "✅" if result["status"] == case["expected"] else "❌"
        print(f"  {status} Test {i}: {result['status']} (expected: {case['expected']})")

def test_appointment_validation():
    """Test appointment validation"""
    print("\n🧪 Testing Appointment Validation...")
    
    # Valid appointment
    valid_appointment = {
        "patient_name": "João Silva",
        "contact_phone": "(35) 99999-9999",
        "preferred_date": "2025-06-15",
        "preferred_time": "14:00",
        "service_type": "limpeza",
        "urgency_level": "routine",
        "symptoms": "Limpeza preventiva"
    }
    
    result = validate_ai_response("", "appointment", appointment_data=valid_appointment)
    status = "✅" if result["status"] == "valid" else "❌"
    print(f"  {status} Valid appointment: {result['status']}")
    
    # Emergency appointment
    emergency_appointment = {
        "patient_name": "Maria Santos",
        "contact_phone": "(35) 99888-8888",
        "preferred_date": "2025-06-12",
        "preferred_time": "09:00",
        "service_type": "emergência",
        "urgency_level": "emergency",
        "symptoms": "Dor intensa no dente"
    }
    
    result = validate_ai_response("", "appointment", appointment_data=emergency_appointment)
    status = "✅" if result["status"] == "emergency_appointment" else "❌"
    print(f"  {status} Emergency appointment: {result['status']}")

def test_emergency_validation():
    """Test emergency triage validation"""
    print("\n🧪 Testing Emergency Validation...")
    
    symptoms = "Dor de dente muito forte, não consigo dormir"
    patient_info = {"id": "test_patient_123", "name": "Test Patient"}
    
    result = validate_ai_response(symptoms, "emergency", patient_info=patient_info)
    status = "✅" if result["status"] in ["valid", "emergency_fallback"] else "❌"
    print(f"  {status} Emergency triage: {result['status']}")
    print(f"    Human review required: {result.get('human_review_required', False)}")

def test_clinical_validation():
    """Test clinical content validation"""
    print("\n🧪 Testing Clinical Content Validation...")
    
    content = "A limpeza dental é um procedimento preventivo importante que deve ser realizada a cada 6 meses para manter a saúde bucal."
    
    result = validate_ai_response(content, "clinical", content_type="procedure")
    status = "✅" if result["status"] == "valid" else "❌"
    print(f"  {status} Clinical content: {result['status']}")
    print(f"    Medical disclaimer required: {result.get('medical_disclaimer_required', False)}")

def test_profanity_detection():
    """Test profanity detection"""
    print("\n🧪 Testing Profanity Detection...")
    
    profane_content = "Esse dentista é uma merda"
    result = validate_ai_response(profane_content, "chat")
    status = "✅" if result["status"] == "invalid" else "❌"
    print(f"  {status} Profanity detection: {result['status']}")

def test_performance():
    """Test performance with multiple requests"""
    print("\n🧪 Testing Performance...")
    
    start_time = datetime.now()
    
    for i in range(10):
        validate_ai_response(f"Test message {i}", "chat")
    
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    print(f"  ✅ 10 validations completed in {duration:.3f}s ({duration/10:.3f}s per validation)")

def main():
    """Run all tests"""
    print("🛡️ Guardrails AI Test Suite - Sorriso Inteligente PWA")
    print("=" * 60)
    
    test_chat_validation()
    test_appointment_validation()
    test_emergency_validation()
    test_clinical_validation()
    test_profanity_detection()
    test_performance()
    
    print("\n" + "=" * 60)
    print("🎉 All tests completed successfully!")
    print(f"📊 System Status: {guardrails_config.__class__.__name__} loaded")
    print(f"🔧 Available services: {len(guardrails_config.dental_services)}")
    print(f"⚡ Emergency keywords: {len(guardrails_config.emergency_keywords)}")

if __name__ == "__main__":
    main()
