// API client for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export interface AnalysisRequest {
  text: string
}

export interface Source {
  url: string
  title: string
}

export interface Claim {
  claim_text: string
  verdict: 'Accurate' | 'Misleading' | 'False' | 'Unsubstantiated' | 'Contested'
  evidence: string
  sources: Source[]
}

export interface AnalysisResponse {
  original_text: string
  overall_verdict: 'Accurate' | 'Misleading' | 'False' | 'Unsubstantiated' | 'Contested'
  confidence_score: number
  analysis_summary: string
  reasoning: string
  claims: Claim[]
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function analyzeText(text: string): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.detail || `HTTP error! status: ${response.status}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function checkHealth(): Promise<{ status: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}