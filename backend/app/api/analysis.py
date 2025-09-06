# In app/api/analysis.py (Updated)

from fastapi import APIRouter, HTTPException
from ..models.schemas import AnalysisRequest, AnalysisResponse
from ..services.agent_crew import run_analysis_crew

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_text(request: AnalysisRequest):
    """
    Receives text and kicks off the multi-agent system for a deep analysis.
    """
    try:
        # The result is now a Pydantic object, not a string.
        response_data = run_analysis_crew(request.text)
        
        # You can return it directly. FastAPI will handle the serialization.
        return response_data

    except Exception as e:
        # Handle potential errors during the crew run
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during analysis: {str(e)}"
        )