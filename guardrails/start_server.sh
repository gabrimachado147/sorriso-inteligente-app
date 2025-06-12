#!/bin/bash
# Guardrails API Server Startup Script
# Sorriso Inteligente PWA - AI Validation System

echo "🛡️ Starting Guardrails AI Server for Sorriso Inteligente PWA"
echo "================================================="

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "api_working.py" ]; then
    echo "❌ api_working.py not found. Please run this script from the guardrails directory."
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
python3 -c "import fastapi, uvicorn, pydantic" 2>/dev/null || {
    echo "📦 Installing missing dependencies..."
    python3 -m pip install fastapi uvicorn pydantic
}

# Check if Guardrails AI is installed
python3 -c "import guardrails" 2>/dev/null || {
    echo "📦 Installing Guardrails AI..."
    python3 -m pip install guardrails-ai==0.6.6
}

echo "✅ Dependencies checked"
echo ""

# Set default configuration
export GUARDRAILS_HOST=${GUARDRAILS_HOST:-"0.0.0.0"}
export GUARDRAILS_PORT=${GUARDRAILS_PORT:-"8000"}

echo "🚀 Starting Guardrails API Server..."
echo "   Host: $GUARDRAILS_HOST"
echo "   Port: $GUARDRAILS_PORT"
echo "   URL: http://$GUARDRAILS_HOST:$GUARDRAILS_PORT"
echo "   Docs: http://$GUARDRAILS_HOST:$GUARDRAILS_PORT/docs"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo "================================================="

# Start the server
python3 api_working.py
