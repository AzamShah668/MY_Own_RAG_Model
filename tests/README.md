# Smoke Tests for RAG Application

This directory contains automated smoke tests for the RAG application.

## Tests

- `test_api.py`: Basic health checks and endpoint validation for backend and frontend

## Running Tests Locally

```bash
# Install dependencies
pip install pytest requests

# Run tests
pytest -v tests/

# With environment variables
BACKEND_URL=http://localhost:8001 STAGING_URL=http://localhost:3000 pytest -v tests/
```

## CI/CD Integration

These tests are automatically run in the Jenkins pipeline during the "Testing Stage" after deployment to staging.
