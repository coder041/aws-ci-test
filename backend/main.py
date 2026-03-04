from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/hello")
def hello():
    """Simple API endpoint to verify deployment."""
    return {
        "message": "Hello from aws-ci-test backend",
        "endpoint": "api/hello",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }