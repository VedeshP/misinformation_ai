from fastapi import APIRouter, HTTPException
from ..models.schemas import AnalysisRequest, AnalysisResponse
from ..services.agent_crew import run_analysis_crew
# Import our new extractor service
from ..services.claim_extractor import extract_claims_from_text

router = APIRouter()

# Define a word count threshold to decide if a text is "long"
# currently setting 150 for testing
CONTEXT_LENGTH_THRESHOLD = 150 # You can adjust this value

@router.post("/analyze", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_text(request: AnalysisRequest):
    """
    Receives text for analysis. If the text is long, it first extracts key claims
    before passing them to the main analysis crew.
    """
    try:
        processed_text: str
        text_word_count = len(request.text.split())

        print(f"Received text with {text_word_count} words.") # Good for debugging

        if text_word_count > CONTEXT_LENGTH_THRESHOLD:
            print("Text is long. Running Claim Extractor Agent...")
            # 1. If text is long, use the lightweight agent to extract claims
            processed_text = extract_claims_from_text(long_text=request.text)
            print(f"Extracted claims: {processed_text}")
        else:
            print("Text is short. Bypassing claim extraction.")
            # 2. If text is short, use it directly
            processed_text = request.text

        # 3. Run the main analysis crew on the (potentially) processed text
        print("Running main analysis crew...")
        response_data = run_analysis_crew(claims_to_analyze=processed_text)
        
        return response_data

    except Exception as e:
        # Handle potential errors during the crew run
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during analysis: {str(e)}"
        )