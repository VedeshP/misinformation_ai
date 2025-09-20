"use client"

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface Verdict {
  score: number
  label: string
  justification: string
  sources: Array<{
    id: string
    domain: string
    credibility: number
    snippet: string
    url: string
  }>
}

interface ResultCardProps {
  claim: string
  verdict: Verdict
  index: number
}

export default function ResultCard({ claim, verdict, index }: ResultCardProps) {
  const getVerdictIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'accurate':
      case 'true':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'false':
      case 'misleading':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getVerdictColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'accurate':
      case 'true':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'false':
      case 'misleading':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="glass hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2 line-clamp-2">
                {claim}
              </CardTitle>
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
                  getVerdictColor(verdict.label)
                )}>
                  {getVerdictIcon(verdict.label)}
                  <span>{verdict.label}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(verdict.score * 100)}% confidence
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(claim)}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Confidence Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">{Math.round(verdict.score * 100)}%</span>
            </div>
            <Progress value={verdict.score * 100} className="h-2" />
          </div>

          {/* AI Explanation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">AI Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {verdict.justification}
            </p>
          </div>

          {/* Sources */}
          {verdict.sources.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Supporting Sources</h4>
              <div className="space-y-2">
                {verdict.sources.slice(0, 3).map((source, sourceIndex) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (sourceIndex * 0.05) }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {source.domain}
                        </span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-muted-foreground">
                            {source.credibility}% credible
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {source.snippet}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="shrink-0"
                    >
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open source"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
                {verdict.sources.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{verdict.sources.length - 3} more sources
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
