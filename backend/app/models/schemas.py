# In app/models/schemas.py

from pydantic import BaseModel, Field
from enum import Enum
from typing import List



# Define the possible verdicts using an Enum for strict validation
class Verdict(str, Enum):
    ACCURATE = "Accurate"
    MISLEADING = "Misleading"
    FALSE = "False"
    UNSUBSTANTIATED = "Unsubstantiated"
    CONTESTED = "Contested"

# Model for a single source
class Source(BaseModel):
    url: str
    title: str

# Model for a single extracted claim
class Claim(BaseModel):
    claim_text: str = Field(description="The specific claim being analyzed.")
    verdict: Verdict
    evidence: str = Field(description="A summary of the evidence found for this specific claim.")
    sources: List[Source]


# The main input model (remains the same)
class AnalysisRequest(BaseModel):
    text: str

# The final, structured output of our multi-agent system
class AnalysisResponse(BaseModel):
    original_text: str
    overall_verdict: Verdict
    confidence_score: float = Field(ge=0.0, le=1.0, description="The calculated confidence in the overall verdict (0.0 to 1.0).")
    analysis_summary: str = Field(description="A high-level summary of the findings.")
    reasoning: str = Field(description="The step-by-step reasoning for the final verdict and confidence score.")
    claims: List[Claim]