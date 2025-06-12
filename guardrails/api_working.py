#!/usr/bin/env python3
"""
Guardrails API Server for Sorriso Inteligente PWA - Working Version
FastAPI server providing AI validation endpoints for the dental application

Endpoints:
- POST /validate/chat - Validate chatbot responses
- POST /validate/appointment - Validate appointment requests
- POST /validate/emergency - Validate emergency triage
- POST /validate/clinical - Validate clinical content
- GET /health - Health check
- GET /metrics - Validation metrics
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import uvicorn
import logging
from datetime import datetime
import json
import os
import sys

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our Guardrails configuration
from config_simple import validate_ai_response, guardrails_config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Guardrails API - Sorriso Inteligente",
    description="AI validation and safety API for dental application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class ChatValidationRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    intent: str = Field(default="general")
    user_id: Optional[str] = None

class AppointmentValidationRequest(BaseModel):
    patient_name: str
    contact_phone: str
    preferred_date: str
    preferred_time: str
    service_type: str
    urgency_level: str
    symptoms: Optional[str] = None

class EmergencyValidationRequest(BaseModel):
    symptoms: str
    patient_info: Dict[str, Any]
    severity_assessment: Optional[str] = None

class ClinicalValidationRequest(BaseModel):
    content: str
    content_type: str = Field(default="general")
    target_audience: str = Field(default="patients")

# Response models
class ValidationResponse(BaseModel):
    status: str
    timestamp: str
    data: Dict[str, Any]

# Global metrics
validation_metrics = {
    "total_requests": 0,
    "successful_validations": 0,
    "failed_validations": 0,
    "emergency_requests": 0,
    "by_type": {
        "chat": 0,
        "appointment": 0,
        "emergency": 0,
        "clinical": 0
    }
}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests for monitoring"""
    start_time = datetime.now()
    
    # Process request
    response = await call_next(request)
    
    # Calculate processing time
    process_time = (datetime.now() - start_time).total_seconds()
    
    # Log request details
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    return response

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Guardrails API - Sorriso Inteligente",
        "version": "1.0.0",
        "description": "AI validation and safety API for dental application",
        "guardrails_version": "0.6.6",
        "endpoints": [
            "/validate/chat", "/validate/appointment", 
            "/validate/emergency", "/validate/clinical",
            "/health", "/metrics", "/config/services"
        ],
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Guardrails functionality
        test_result = validate_ai_response("test", "chat", intent="test")
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "guardrails": "active",
                "validation_engine": "operational",
                "api_server": "running"
            },
            "test_validation": test_result.get("status", "unknown")
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.get("/metrics")
async def get_metrics():
    """Get validation metrics"""
    return {
        "metrics": validation_metrics,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/validate/chat")
async def validate_chat(request: ChatValidationRequest):
    """Validate chatbot response for safety and appropriateness"""
    try:
        # Update metrics
        validation_metrics["total_requests"] += 1
        validation_metrics["by_type"]["chat"] += 1
        
        # Perform chat validation
        result = validate_ai_response(
            request.message,
            "chat",
            intent=request.intent
        )
        
        # Update success metrics
        if result["status"] == "valid":
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result
        )
        
    except Exception as e:
        logger.error(f"Chat validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate/appointment")
async def validate_appointment(request: AppointmentValidationRequest):
    """Validate appointment booking request"""
    try:
        # Update metrics
        validation_metrics["total_requests"] += 1
        validation_metrics["by_type"]["appointment"] += 1
        
        # Convert request to dict
        appointment_data = request.model_dump()
        
        # Perform appointment validation
        result = validate_ai_response(
            "",  # No direct response to validate
            "appointment",
            appointment_data=appointment_data
        )
        
        # Update success metrics
        if result["status"] in ["valid", "emergency_appointment"]:
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result
        )
        
    except Exception as e:
        logger.error(f"Appointment validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate/emergency")
async def validate_emergency(request: EmergencyValidationRequest):
    """Validate emergency triage response - CRITICAL SAFETY"""
    try:
        # Update metrics
        validation_metrics["total_requests"] += 1
        validation_metrics["by_type"]["emergency"] += 1
        validation_metrics["emergency_requests"] += 1
        
        # Perform emergency validation
        result = validate_ai_response(
            request.symptoms,
            "emergency",
            patient_info=request.patient_info,
            severity_assessment=request.severity_assessment
        )
        
        # Update success metrics
        if result["status"] in ["valid", "emergency_fallback"]:
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
        
        # Special logging for emergency requests
        logger.warning(
            f"EMERGENCY VALIDATION: {result['status']} - "
            f"Patient: {request.patient_info.get('id', 'unknown')} - "
            f"Symptoms: {request.symptoms[:50]}..."
        )
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result
        )
        
    except Exception as e:
        logger.error(f"Emergency validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        
        # For emergencies, return safe fallback response
        return ValidationResponse(
            status="emergency_fallback",
            timestamp=datetime.now().isoformat(),
            data={
                "status": "emergency_fallback",
                "error": str(e),
                "automatic_escalation": True,
                "immediate_human_required": True,
                "emergency_message": "Por favor, procure atendimento médico imediato ou ligue para o serviço de emergência.",
                "emergency_contacts": guardrails_config._get_emergency_contacts()
            }
        )

@app.post("/validate/clinical")
async def validate_clinical(request: ClinicalValidationRequest):
    """Validate clinical/medical content for accuracy and safety"""
    try:
        # Update metrics
        validation_metrics["total_requests"] += 1
        validation_metrics["by_type"]["clinical"] += 1
        
        # Perform clinical validation
        result = validate_ai_response(
            request.content,
            "clinical",
            content_type=request.content_type,
            target_audience=request.target_audience
        )
        
        # Update success metrics
        if result["status"] == "valid":
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result
        )
        
    except Exception as e:
        logger.error(f"Clinical validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/config/services")
async def get_supported_services():
    """Get list of supported dental services"""
    return {
        "dental_services": guardrails_config.dental_services,
        "urgency_levels": guardrails_config.urgency_levels,
        "emergency_keywords": guardrails_config.emergency_keywords
    }

if __name__ == "__main__":
    # Configuration
    host = os.getenv("GUARDRAILS_HOST", "0.0.0.0")
    port = int(os.getenv("GUARDRAILS_PORT", 8000))
    
    logger.info(f"🛡️ Starting Guardrails API server on {host}:{port}")
    logger.info(f"📚 API Documentation available at http://{host}:{port}/docs")
    
    # Run server
    uvicorn.run(
        "api_working:app",
        host=host,
        port=port,
        reload=True,  # Set to False in production
        access_log=True
    )
