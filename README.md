# 🔍 Misinformation AI — Multi-Agent Fact-Checking Engine

> An AI-powered misinformation detection API that uses a collaborative multi-agent pipeline to research, analyze, and verdict claims found in any text.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![CrewAI](https://img.shields.io/badge/CrewAI-Multi--Agent-6C63FF)
![Gemini](https://img.shields.io/badge/Google-Gemini_2.5-4285F4?logo=google&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🧠 What It Does

**Misinformation AI** takes any piece of text — a news article, a social media post, a WhatsApp forward — and runs it through a multi-agent AI pipeline that:

1. **Extracts** all verifiable factual claims from the text (for long inputs)
2. **Researches** each claim using live web search from credible sources
3. **Analyzes** the evidence and produces a structured verdict with confidence scoring

The final output is a rich, structured JSON report — not just "true/false", but *why*, *how confident*, and *which sources* back it up.

---

## 🏗️ Architecture

```
Input Text
    │
    ▼
┌─────────────────────────────────┐
│        FastAPI Endpoint         │  POST /api/analyze
└────────────────┬────────────────┘
                 │
         Word count > 150?
        /                  \
      YES                   NO
       │                     │
       ▼                     │
┌─────────────┐              │
│   Claim     │              │
│  Extractor  │ ◄── gemini-2.5-flash-lite (temp: 0.1)
│   Agent     │
└──────┬──────┘
       │  Extracted claims (newline-separated string)
       └──────────────┐
                      ▼
         ┌────────────────────────┐
         │   CrewAI Sequential    │
         │      Pipeline          │
         │                        │
         │  🔎 Researcher Agent   │ ◄── SerperDev web search
         │       (Task 1)         │
         │          │             │
         │          ▼             │
         │  📊 Analyst Agent      │ ◄── gemini-2.5-flash (temp: 0.8)
         │       (Task 2)         │
         └────────────┬───────────┘
                      │
                      ▼
             AnalysisResponse
             (Pydantic-validated JSON)
```

---

## 📦 Project Structure

```
misinformation_ai/
└── backend/
    └── app/
        ├── main.py                  # FastAPI app, CORS, router registration
        ├── api/
        │   └── analysis.py          # POST /api/analyze endpoint
        ├── models/
        │   └── schemas.py           # Pydantic models (Request, Response, Claim, Verdict)
        └── services/
            ├── agent_crew.py        # Main 2-agent research + analysis crew
            └── claim_extractor.py   # Lightweight claim extraction agent
```

---

## 🤖 Agents & Tasks

### Agent 1 — Claim Extractor *(lightweight pre-processor)*
| Property | Value |
|---|---|
| Model | `gemini-2.5-flash-lite` |
| Temperature | `0.1` (factual, deterministic) |
| Tools | None |
| Trigger | Only when input text > 150 words |
| Output | Newline-separated verifiable claims |

### Agent 2 — Researcher
| Property | Value |
|---|---|
| Model | `gemini-2.5-flash` |
| Tools | SerperDev web search |
| Goal | Find 2–3 credible sources per claim |
| Output | Findings report with source URLs |

### Agent 3 — Misinformation Analyst
| Property | Value |
|---|---|
| Model | `gemini-2.5-flash` |
| Tools | None |
| Goal | Produce structured JSON verdict |
| Output | `AnalysisResponse` (Pydantic validated) |

---

## 📋 API Reference

### `POST /api/analyze`

**Request Body:**
```json
{
  "text": "The WHO confirmed that 5G towers spread COVID-19, and the vaccine contains microchips."
}
```

**Response:**
```json
{
  "original_text": "The WHO confirmed that 5G towers...",
  "overall_verdict": "False",
  "confidence_score": 0.95,
  "analysis_summary": "Both claims in the text are debunked conspiracy theories...",
  "reasoning": "Claim 1 is refuted by 3 WHO sources. Claim 2 has no scientific basis...",
  "claims": [
    {
      "claim_text": "5G towers spread COVID-19",
      "verdict": "False",
      "evidence": "WHO, CDC, and peer-reviewed studies confirm no link between 5G and COVID-19.",
      "sources": [
        { "url": "https://www.who.int/...", "title": "WHO: 5G networks do not spread COVID-19" }
      ]
    }
  ]
}
```

**Verdict Types:**

| Verdict | Meaning |
|---|---|
| `Accurate` | Supported by credible sources |
| `Misleading` | Contains partial truths or deceptive framing |
| `False` | Directly contradicted by evidence |
| `Unsubstantiated` | No credible sources found either way |
| `Contested` | Sources disagree; genuine debate exists |

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- A [Serper.dev](https://serper.dev/) API key (web search)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/misinformation_ai.git
cd misinformation_ai/backend
```

### 2. Create and activate a virtual environment
```bash
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
SERPER_API_KEY=your_serper_api_key_here
```

### 5. Run the server
```bash
uvicorn app.main:app --reload
```

The API will be live at `http://localhost:8000`.
Interactive docs available at `http://localhost:8000/docs`.

---

## 🧪 Testing

You can test the endpoint directly via the Swagger UI at `/docs`, or with `curl`:

```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "The moon landing was faked by NASA in 1969."}'
```

---

## 🔧 Configuration

| Variable | Location | Description |
|---|---|---|
| `CONTEXT_LENGTH_THRESHOLD` | `analysis.py` | Word count above which claim extraction runs (default: `150`) |
| `temperature` (researcher/analyst) | `agent_crew.py` | Set to `0.8` for diverse research |
| `temperature` (extractor) | `claim_extractor.py` | Set to `0.1` for precise extraction |

---

## 🗺️ Roadmap

- [ ] Frontend UI (React/Next.js)
- [ ] Support for image/screenshot input (OCR + analysis)
- [ ] Claim-level source credibility scoring
- [ ] Browser extension integration
- [ ] Rate limiting & auth middleware
- [ ] Docker support

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [CrewAI](https://www.crewai.com/) — Multi-agent orchestration framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) — LLM backbone
- [Serper.dev](https://serper.dev/) — Real-time web search API
- [FastAPI](https://fastapi.tiangolo.com/) — High-performance Python API framework

## 🤝 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/VedeshP">
        <img src="https://github.com/VedeshP.png" width="100px;" alt=""/>
        <br />
        <sub><b>Vedesh Pandya</b></sub>
      </a>
    </td>
        <td align="center">
      <a href="https://github.com/chetangadhiya5062">
        <img src="https://github.com/chetangadhiya5062.png" width="100px;" alt=""/>
        <br />
        <sub><b>Chetan Gadhiya</b></sub>
      </a>
    </td>
  </tr>
</table>
