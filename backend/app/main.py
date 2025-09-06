from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import analysis  # Import your APIRouter

# Create the FastAPI app instance
app = FastAPI(
    title="Misinformation Analysis API",
    description="An AI-powered tool to detect and analyze potential misinformation.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router from the api directory
# This is the equivalent of app.register_blueprint() in Flask
# Note this above thing - it is quite important for learning
app.include_router(analysis.router, prefix="/api")

# A simple root endpoint to check if the server is running
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the Misinformation Analysis API"}