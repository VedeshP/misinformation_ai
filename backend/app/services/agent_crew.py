# In app/services/agent_crew.py

import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
# from crewai_tools import DuckDuckGoSearchRun
from crewai_tools import SerperDevTool
# from langchain_google_genai import ChatGoogleGenerativeAI

from crewai import LLM

# Import your Pydantic model
from ..models.schemas import AnalysisResponse 

from google.generativeai.types import HarmCategory, HarmBlockThreshold

# Load environment variables from .env file
load_dotenv()

# Initialize the tool
# search_tool = DuckDuckGoSearchRun()
search_tool = SerperDevTool()


"""We will use the crew ai inbuilt llm class"""

llm = LLM(
    model="gemini/gemini-2.5-flash",
    # model="gemini/gemini-2.5-flash-lite",
    temperature=0.8,

    # safety_settings={
    #     HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    #     HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    #     HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    #     HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    # }
)



# 1. Define the Agents
# =====================

# Agent 1: The Researcher
# Finds relevant information from the web.
researcher = Agent(
    role='Expert News and Information Researcher',
    goal='To find unbiased, factual information and diverse perspectives on a given topic from reputable sources.',
    backstory=(
        "You are a world-class investigative journalist, known for your ability to dig deep and find the most "
        "reliable information. You are an expert at using search tools to uncover facts and cross-reference sources."
    ),
    verbose=True,
    allow_delegation=False,
    tools=[search_tool],
    llm=llm
)

# Agent 2: The Analyst
# Synthesizes the research into a structured report.
analyst = Agent(
    role='Misinformation Analysis Expert',
    goal='To analyze the research findings and produce a structured, unbiased report on the validity of a claim.',
    backstory=(
        "You are a seasoned intelligence analyst with a PhD in media studies. You specialize in identifying propaganda, "
        "bias, and misinformation. You are meticulous, logical, and your goal is to produce a clear, evidence-based "
        "judgment in a specific JSON format."
    ),
    verbose=True,
    allow_delegation=False,
    llm=llm
)

# 2. Define the Tasks
# ===================

# Task 1: Research Task
research_task = Task(
    description=(
        "Investigate the following text: '{claims_to_analyze}'. "
        "Your primary goal is to gather facts, data, and reports from a variety of credible sources. "
        "Identify the main claims made in the text. For each claim, find at least 2-3 sources that either "
        "support or refute it. List the key findings and the sources you used."
    ),
    expected_output=(
        "A detailed report with a list of claims, key findings for each claim, and a compilation of source URLs and titles. "
        "This report will be used by the Misinformation Analyst."
    ),
    agent=researcher
)

# Task 2: Analysis Task
# This task's prompt is CRITICAL. It tells the agent how to structure the final JSON.
analysis_task = Task(
    description=(
        "Analyze the research findings provided on the text: '{claims_to_analyze}'. "
        "Your job is to produce a final, structured JSON report. Deconstruct the original text into individual claims. "
        "For each claim, provide a verdict, a summary of the evidence, and the sources. "
        "Then, determine an 'overall_verdict' for the entire text. "
        "Crucially, you must also provide a 'confidence_score' (from 0.0 to 1.0) based on the quality and agreement of the sources. "
        "Explain your reasoning for the overall verdict and the confidence score."
    ),
     expected_output=(
        "Your final output MUST BE a single, clean JSON object and nothing else. "
        "Do not include any introductory text, explanations, or markdown formatting like ```json. "
        "The JSON object must strictly conform to the AnalysisResponse Pydantic model, ensuring the 'claims' list is populated correctly based on your research."
    ),
    agent=analyst,
    output_pydantic=AnalysisResponse
    # output_json=True # Instruct CrewAI to expect a JSON output
)

# 3. Create the Crew
# ==================
crew = Crew(
    agents=[researcher, analyst],
    tasks=[research_task, analysis_task],
    process=Process.sequential,
    verbose=True
)

def run_analysis_crew(claims_to_analyze: str) -> str:
    """
    Kicks off the crew to analyze the text and returns the raw JSON string.
    """
    inputs = {'claims_to_analyze': claims_to_analyze}
    result = crew.kickoff(inputs=inputs)
    # return result
    # return result.tasks_output[-1].pydantic
    # return result.raw

    """Running some tests to check the json output"""
    import json
    json_output = result.pydantic.model_dump_json()
    with open("test.json", 'w') as test:
        json.dump(json_output, test)

    return result.pydantic