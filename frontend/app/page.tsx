"use client"

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import AnalysisInput from '@/components/AnalysisInput'
import ResultCard from '@/components/ResultCard'
import { analyzeText, ApiError } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function HomePage() {
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const analysisMutation = useMutation({
    mutationFn: async (claims: string[]) => {
      // For now, analyze the first claim only
      const firstClaim = claims[0]
      if (!firstClaim) throw new Error('No claims provided')
      
      const response = await analyzeText(firstClaim)
      return response
    },
    onSuccess: (data) => {
      setError(null)
      // Transform the backend response to match our frontend format
      const transformedResult = {
        claim: data.original_text,
        verdict: {
          score: data.confidence_score,
          label: data.overall_verdict,
          justification: data.analysis_summary,
          sources: data.claims.flatMap(claim => 
            claim.sources.map(source => ({
              id: source.url,
              domain: new URL(source.url).hostname,
              credibility: 85, // Default credibility
              snippet: source.title,
              url: source.url
            }))
          )
        }
      }
      setResults([transformedResult])
    },
    onError: (error) => {
      console.error('Analysis error:', error)
      if (error instanceof ApiError) {
        setError(`API Error (${error.status}): ${error.message}`)
      } else {
        setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  })

  const handleAnalyze = (claims: string[]) => {
    setResults([])
    setError(null)
    analysisMutation.mutate(claims)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AnalysisInput 
          onAnalyze={handleAnalyze} 
          isLoading={analysisMutation.isPending}
        />
        
        {/* Results Section */}
        {(results.length > 0 || error) && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-heading font-bold mb-4">
                    Analysis Results
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    AI-powered verification with detailed explanations
                  </p>
                </div>

                {/* Error State */}
                {error && (
                  <Card className="border-destructive bg-destructive/10 mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Analysis Error</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-destructive">{error}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Loading State */}
                {analysisMutation.isPending && (
                  <Card className="glass mb-8">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center space-x-4 py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <div>
                          <h3 className="text-lg font-semibold">Analyzing Claims</h3>
                          <p className="text-muted-foreground">
                            Our AI is processing your claims and cross-referencing with reliable sources...
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Results */}
                {results.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {results.map((result, index) => (
                      <ResultCard
                        key={index}
                        claim={result.claim}
                        verdict={result.verdict}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}