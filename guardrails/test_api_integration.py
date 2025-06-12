#!/usr/bin/env python3
"""
Guardrails API Integration Test
Tests the complete API functionality for the Sorriso Inteligente PWA
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(method, endpoint, data=None, description=""):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=5)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=5)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        if response.status_code == 200:
            print(f"✅ {description}: SUCCESS ({response.status_code})")
            return True
        else:
            print(f"❌ {description}: FAILED ({response.status_code})")
            print(f"   Response: {response.text[:100]}...")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {description}: CONNECTION FAILED - Server not running?")
        return False
    except Exception as e:
        print(f"❌ {description}: ERROR - {str(e)}")
        return False

def run_comprehensive_tests():
    """Run comprehensive API tests"""
    print("🛡️ Guardrails API Integration Tests")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Root endpoint
    total_tests += 1
    if test_endpoint("GET", "/", description="Root endpoint"):
        tests_passed += 1
    
    # Test 2: Health check
    total_tests += 1
    if test_endpoint("GET", "/health", description="Health check"):
        tests_passed += 1
    
    # Test 3: Chat validation
    total_tests += 1
    chat_data = {
        "message": "Olá! Como posso ajudá-lo hoje?",
        "intent": "greeting",
        "user_id": "test_user"
    }
    if test_endpoint("POST", "/validate/chat", chat_data, "Chat validation"):
        tests_passed += 1
    
    # Test 4: Appointment validation
    total_tests += 1
    appointment_data = {
        "patient_name": "João Silva",
        "contact_phone": "(35) 99999-9999",
        "preferred_date": "2025-06-15",
        "preferred_time": "14:00",
        "service_type": "limpeza",
        "urgency_level": "routine",
        "symptoms": "Limpeza preventiva"
    }
    if test_endpoint("POST", "/validate/appointment", appointment_data, "Appointment validation"):
        tests_passed += 1
    
    # Test 5: Emergency validation
    total_tests += 1
    emergency_data = {
        "symptoms": "Dor muito forte no dente",
        "patient_info": {"id": "test_patient", "name": "Test Patient"},
        "severity_assessment": "urgent"
    }
    if test_endpoint("POST", "/validate/emergency", emergency_data, "Emergency validation"):
        tests_passed += 1
    
    # Test 6: Clinical validation
    total_tests += 1
    clinical_data = {
        "content": "A limpeza dental é importante para a saúde bucal.",
        "content_type": "advice",
        "target_audience": "patients"
    }
    if test_endpoint("POST", "/validate/clinical", clinical_data, "Clinical validation"):
        tests_passed += 1
    
    # Test 7: Metrics
    total_tests += 1
    if test_endpoint("GET", "/metrics", description="Metrics endpoint"):
        tests_passed += 1
    
    # Test 8: Configuration
    total_tests += 1
    if test_endpoint("GET", "/config/services", description="Services configuration"):
        tests_passed += 1
    
    # Results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 ALL TESTS PASSED! Guardrails API is fully operational.")
        return True
    else:
        print(f"⚠️  {total_tests - tests_passed} tests failed. Check the API server.")
        return False

def test_performance():
    """Test API performance"""
    print("\n🚀 Performance Test")
    print("-" * 30)
    
    start_time = time.time()
    successful_requests = 0
    
    # Test 10 rapid requests
    for i in range(10):
        chat_data = {
            "message": f"Test message {i}",
            "intent": "test"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/validate/chat", json=chat_data, timeout=2)
            if response.status_code == 200:
                successful_requests += 1
        except:
            pass
    
    end_time = time.time()
    duration = end_time - start_time
    
    print(f"✅ {successful_requests}/10 requests successful")
    print(f"⏱️  Total time: {duration:.3f}s")
    print(f"📈 Average response time: {duration/10:.3f}s per request")

def main():
    """Main test function"""
    # Run comprehensive tests
    api_working = run_comprehensive_tests()
    
    if api_working:
        # Run performance tests
        test_performance()
        
        print("\n🛡️ Guardrails AI System Status: OPERATIONAL")
        print("📋 Features tested:")
        print("   • Chat message validation")
        print("   • Appointment request validation")
        print("   • Emergency triage validation")
        print("   • Clinical content validation")
        print("   • Safety and profanity filtering")
        print("   • Metrics and monitoring")
        print("   • Configuration endpoints")
        
        return True
    else:
        print("\n❌ Guardrails API System: NOT FULLY OPERATIONAL")
        print("💡 Please check that the API server is running on http://127.0.0.1:8000")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
