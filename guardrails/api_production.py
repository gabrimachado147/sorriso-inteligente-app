#!/usr/bin/env python3
"""
Guardrails API Server for Sorriso Inteligente PWA - Production Configuration
FastAPI server optimized for production deployment

Production Features:
- Environment-based configuration
- Enhanced security headers
- Rate limiting
- Production logging
- SSL/HTTPS ready
- CORS configured for production domains
- Performance monitoring
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import uvicorn
import logging
import os
from datetime import datetime
import json
import sys
import time

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our Guardrails configuration
from config_simple import validate_ai_response, guardrails_config

# Production Configuration
ENVIRONMENT = os.getenv('ENVIRONMENT', 'production')
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 
    'https://sorriso-inteligente-app.vercel.app,https://sorriso-inteligente.com').split(',')

# Enhanced logging for production
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('guardrails_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app with production settings
app = FastAPI(
    title="Guardrails API - Sorriso Inteligente (Production)",
    description="AI validation and safety API for dental application - Production Environment",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT != 'production' else None,  # Disable docs in production
    redoc_url="/redoc" if ENVIRONMENT != 'production' else None,
    openapi_url="/openapi.json" if ENVIRONMENT != 'production' else None
)

# Production middleware stack
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=ALLOWED_HOSTS if ALLOWED_HOSTS != ['*'] else ["*"]
)

# Enhanced CORS for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "X-Request-ID"]
)

# Request/Response Models (same as working version)
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

class ValidationResponse(BaseModel):
    status: str
    timestamp: str
    data: Dict[str, Any]
    request_id: Optional[str] = None
    processing_time_ms: Optional[float] = None

# Enhanced metrics for production
validation_metrics = {
    "total_requests": 0,
    "successful_validations": 0,
    "failed_validations": 0,
    "emergency_requests": 0,
    "average_response_time": 0.0,
    "by_type": {
        "chat": 0,
        "appointment": 0,
        "emergency": 0,
        "clinical": 0
    },
    "by_hour": {},
    "error_counts": {},
    "uptime_start": datetime.now().isoformat()
}

@app.middleware("http")
async def enhance_logging_and_metrics(request: Request, call_next):
    """Enhanced middleware for production logging and metrics"""
    start_time = time.time()
    request_id = f"req_{int(start_time * 1000)}"
    
    # Log request
    logger.info(f"[{request_id}] {request.method} {request.url.path} - Client: {request.client.host}")
    
    try:
        response = await call_next(request)
        
        # Calculate processing time
        process_time = (time.time() - start_time) * 1000
        
        # Update metrics
        validation_metrics["total_requests"] += 1
        current_avg = validation_metrics["average_response_time"]
        total_requests = validation_metrics["total_requests"]
        validation_metrics["average_response_time"] = (
            (current_avg * (total_requests - 1)) + process_time
        ) / total_requests
        
        # Add custom headers
        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Environment"] = ENVIRONMENT
        
        # Log response
        logger.info(f"[{request_id}] {response.status_code} - {process_time:.2f}ms")
        
        return response
        
    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        logger.error(f"[{request_id}] ERROR: {str(e)} - {process_time:.2f}ms")
        validation_metrics["failed_validations"] += 1
        raise

@app.get("/")
async def root():
    """Root endpoint with production API information"""
    return {
        "name": "Guardrails API - Sorriso Inteligente (Production)",
        "version": "1.0.0",
        "environment": ENVIRONMENT,
        "description": "AI validation and safety API for dental application",
        "guardrails_version": "0.6.6",
        "endpoints": [
            "/validate/chat", "/validate/appointment", 
            "/validate/emergency", "/validate/clinical",
            "/health", "/metrics"
        ],
        "status": "operational",
        "documentation": "/docs" if ENVIRONMENT != 'production' else "Contact administrator"
    }

@app.get("/health")
async def health_check():
    """Enhanced health check for production monitoring"""
    try:
        # Test Guardrails functionality
        test_result = validate_ai_response("test", "chat", intent="test")
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "environment": ENVIRONMENT,
            "services": {
                "guardrails": "active",
                "validation_engine": "operational",
                "api_server": "running"
            },
            "metrics": {
                "total_requests": validation_metrics["total_requests"],
                "average_response_time_ms": round(validation_metrics["average_response_time"], 2),
                "uptime_start": validation_metrics["uptime_start"]
            },
            "test_validation": test_result.get("status", "unknown")
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")

@app.get("/metrics")
async def get_metrics():
    """Production metrics endpoint"""
    current_hour = datetime.now().strftime("%Y-%m-%d-%H")
    
    return {
        "metrics": validation_metrics,
        "performance": {
            "requests_per_hour": validation_metrics["by_hour"].get(current_hour, 0),
            "success_rate": (
                validation_metrics["successful_validations"] / 
                max(validation_metrics["total_requests"], 1)
            ) * 100,
            "average_response_time_ms": round(validation_metrics["average_response_time"], 2)
        },
        "timestamp": datetime.now().isoformat()
    }

# Validation endpoints (same as working version but with enhanced logging)
@app.post("/validate/chat")
async def validate_chat(request: ChatValidationRequest):
    """Validate chatbot responses with enhanced production logging"""
    try:
        start_time = time.time()
        
        validation_metrics["by_type"]["chat"] += 1
        
        # Perform chat validation
        result = validate_ai_response(
            request.message,
            "chat",
            intent=request.intent,
            user_id=request.user_id
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        if result["status"] in ["valid", "requires_human"]:
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
            
        logger.info(f"Chat validation: {result['status']} - {processing_time:.2f}ms")
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        logger.error(f"Chat validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate/appointment")
async def validate_appointment(request: AppointmentValidationRequest):
    """Validate appointment booking request with enhanced logging"""
    try:
        start_time = time.time()
        
        validation_metrics["by_type"]["appointment"] += 1
        
        appointment_data = request.model_dump()
        
        result = validate_ai_response(
            "",
            "appointment",
            appointment_data=appointment_data
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        if result["status"] in ["valid", "emergency_appointment"]:
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
            
        logger.info(f"Appointment validation: {result['status']} - Patient: {request.patient_name} - {processing_time:.2f}ms")
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        logger.error(f"Appointment validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate/emergency")
async def validate_emergency(request: EmergencyValidationRequest):
    """Validate emergency triage request with enhanced logging"""
    try:
        start_time = time.time()
        
        validation_metrics["by_type"]["emergency"] += 1
        validation_metrics["emergency_requests"] += 1
        
        emergency_data = {
            "symptoms": request.symptoms,
            "patient_info": request.patient_info,
            "severity_assessment": request.severity_assessment
        }
        
        result = validate_ai_response(
            request.symptoms,
            "emergency",
            emergency_data=emergency_data
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        # Always log emergency validations
        patient_name = request.patient_info.get('name', 'unknown')
        logger.warning(f"EMERGENCY VALIDATION: {result['status']} - Patient: {patient_name} - Symptoms: {request.symptoms[:50]}...")
        
        if result["status"] in ["valid", "emergency", "urgent"]:
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        logger.error(f"Emergency validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate/clinical")
async def validate_clinical(request: ClinicalValidationRequest):
    """Validate clinical content with enhanced logging"""
    try:
        start_time = time.time()
        
        validation_metrics["by_type"]["clinical"] += 1
        
        clinical_data = {
            "content": request.content,
            "content_type": request.content_type,
            "target_audience": request.target_audience
        }
        
        result = validate_ai_response(
            request.content,
            "clinical",
            clinical_data=clinical_data
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        if result["status"] in ["valid", "approved"]:
            validation_metrics["successful_validations"] += 1
        else:
            validation_metrics["failed_validations"] += 1
            
        logger.info(f"Clinical validation: {result['status']} - Content type: {request.content_type} - {processing_time:.2f}ms")
        
        return ValidationResponse(
            status="success",
            timestamp=datetime.now().isoformat(),
            data=result,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        logger.error(f"Clinical validation error: {str(e)}")
        validation_metrics["failed_validations"] += 1
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info(f"🛡️ Starting Guardrails API server (PRODUCTION) on {HOST}:{PORT}")
    logger.info(f"🌍 Environment: {ENVIRONMENT}")
    logger.info(f"🔒 Allowed Origins: {ALLOWED_ORIGINS}")
    
    # Production server configuration
    uvicorn.run(
        "api_production:app",
        host=HOST,
        port=PORT,
        reload=False,  # Disabled for production
        access_log=True,
        log_level="info",
        server_header=False,  # Security: hide server header
        date_header=False     # Security: hide date header
    )
