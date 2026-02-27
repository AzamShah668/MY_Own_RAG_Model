import os
import requests
import pytest
import time

# Get environment variables
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8001")
STAGING_URL = os.getenv("STAGING_URL", "http://localhost:3000")

def test_backend_health():
    """Test if backend is up and running"""
    max_retries = 5
    for i in range(max_retries):
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "online"
            print(f"✓ Backend health check passed: {data}")
            return
        except Exception as e:
            if i < max_retries - 1:
                print(f"Retry {i+1}/{max_retries}: {e}")
                time.sleep(5)
            else:
                raise

def test_backend_upload_endpoint():
    """Test if upload endpoint is accessible"""
    response = requests.options(f"{BACKEND_URL}/upload_pdf", timeout=10)
    # OPTIONS request should return 200 or 405 (method not allowed is fine, means endpoint exists)
    assert response.status_code in [200, 405]
    print("✓ Upload endpoint is accessible")

def test_backend_ask_endpoint():
    """Test if ask endpoint is accessible"""
    response = requests.options(f"{BACKEND_URL}/ask", timeout=10)
    # OPTIONS request should return 200 or 405
    assert response.status_code in [200, 405]
    print("✓ Ask endpoint is accessible")

def test_frontend_health():
    """Test if frontend is up and running"""
    max_retries = 5
    for i in range(max_retries):
        try:
            response = requests.get(STAGING_URL, timeout=10)
            assert response.status_code == 200
            print("✓ Frontend is accessible")
            return
        except Exception as e:
            if i < max_retries - 1:
                print(f"Retry {i+1}/{max_retries}: {e}")
                time.sleep(5)
            else:
                raise

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
