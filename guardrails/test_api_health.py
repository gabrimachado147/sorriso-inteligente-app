import requests

def test_health_endpoint():
    url = "http://localhost:8000/health"
    response = requests.get(url)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()

    assert data["status"] == "healthy", "API is not healthy"
    assert "services" in data, "Services key missing in response"
    assert data["services"]["guardrails"] == "active", "Guardrails service is not active"

if __name__ == "__main__":
    test_health_endpoint()
    print("Health endpoint test passed.")
