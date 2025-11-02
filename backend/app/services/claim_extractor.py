import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
# from langchain_groq import ChatGroq

from crewai import LLM

load_dotenv()

# Defining the Lightweight LLM here
# Initialize the Lightweight LLM for Claim Extraction
lightweight_llm = LLM(
    model="gemini/gemini-2.5-flash-lite",
    # api_key is often handled by the environment, but include if your class requires it.
    
    # --- Parameters for Factual Extraction ---
    temperature=0.1,
    top_p=0.9,
    top_k=40,
    max_output_tokens=2048,
    stream=False, # Set to False for a complete response in one go
    
    # --- Safety Settings to avoid blocking on controversial topics ---
    # safety_settings={
    #     "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
    #     "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
    #     "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
    #     "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE"
    # }
)

claim_extractor_agent = Agent(
    role='Expert Information Extractor',
    goal='To accurately identify and extract all distinct, verifiable factual claims from a given text.',
    backstory=(
        "You are a meticulous AI assistant, highly skilled in the art of information distillation. "
        "Your sole purpose is to read long-form text and pull out only the statements that can be "
        "independently fact-checked. You ignore opinions, questions, and narrative fluff, focusing "
        "exclusively on concrete, verifiable claims."
    ),
    verbose=True,
    allow_delegation=False,
    llm=lightweight_llm,
    tools=[] # This agent needs no external tools
)

extraction_task = Task(
    description=(
        "Analyze the provided text: '{long_text}'. Your task is to identify every distinct, "
        "verifiable claim made within it. A claim is a statement of fact that can be proven true or false. "
        "Extract these claims and present them as a single, concatenated string, with each distinct "
        "claim separated by a newline character ('\\n')."
    ),
    expected_output=(
        "A single string containing the most important extracted claims, separated by newlines. "
        "For example: 'The study concluded that X leads to a 15% increase in Y.\\nThe company "
        "announced its new headquarters will be in City Z.'"
    ),
    agent=claim_extractor_agent
)

# 4. Create a dedicated crew for this single task
extraction_crew = Crew(
    agents=[claim_extractor_agent],
    tasks=[extraction_task],
    verbose=True
)


def extract_claims_from_text(long_text: str) -> str:
    """
    Runs the extraction crew to pull out verifiable claims from a long text.
    Returns a single string with claims separated by newlines.
    """
    inputs = {'long_text': long_text}
    result = extraction_crew.kickoff(inputs=inputs)
    # kickoff method returns CrewOutput object so get the raw str to return only the text
    return result.raw