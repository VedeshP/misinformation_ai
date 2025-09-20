"use client"

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Upload, FileText, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Claim {
  id: string
  text: string
}

interface AnalysisInputProps {
  // eslint-disable-next-line no-unused-vars
  onAnalyze?: (claimTexts: string[]) => void
  isLoading?: boolean
}

export default function AnalysisInput({ onAnalyze, isLoading = false }: AnalysisInputProps) {
  const [claims, setClaims] = useState<Claim[]>([
    { id: '1', text: '' }
  ])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addClaim = () => {
    const newClaim: Claim = {
      id: Date.now().toString(),
      text: ''
    }
    setClaims([...claims, newClaim])
  }

  const removeClaim = (id: string) => {
    if (claims.length > 1) {
      setClaims(claims.filter(claim => claim.id !== id))
    }
  }

  const updateClaim = (id: string, text: string) => {
    setClaims(claims.map(claim => 
      claim.id === id ? { ...claim, text } : claim
    ))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      // Handle CSV file processing
      // console.log('CSV file uploaded:', file.name)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      // Handle CSV file processing
      // console.log('CSV file dropped:', file.name)
    }
  }

  const analyzeClaims = () => {
    const validClaims = claims.filter(claim => claim.text.trim())
    if (validClaims.length === 0) {
      return
    }
    
    // Trigger analysis
    const claimTexts = validClaims.map(claim => claim.text.trim())
    if (onAnalyze) {
      onAnalyze(claimTexts)
    } else {
      // console.log('Analyzing claims:', claimTexts)
    }
  }

  const hasValidClaims = claims.some(claim => claim.text.trim())

  return (
    <section id="analysis-section" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Analyze Claims
            </h2>
            <p className="text-xl text-muted-foreground">
              Enter claims to verify or upload a CSV file for batch analysis
            </p>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Claims to Analyze</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Claims Input */}
              <div className="space-y-4">
                {claims.map((claim, index) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-1">
                      <Input
                        placeholder={`Claim ${index + 1}: Enter the statement you want to verify...`}
                        value={claim.text}
                        onChange={(e) => updateClaim(claim.id, e.target.value)}
                        className="text-base"
                        disabled={isLoading}
                      />
                    </div>
                    {claims.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeClaim(claim.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Add Claim Button */}
              <Button
                variant="outline"
                onClick={addClaim}
                className="w-full"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Claim
              </Button>

              {/* CSV Upload */}
              <div className="border-t pt-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Upload CSV File
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                size="lg"
                onClick={analyzeClaims}
                disabled={!hasValidClaims || isLoading}
                className="w-full text-lg py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : hasValidClaims ? (
                  'Analyze Claims'
                ) : (
                  'Enter at least one claim to analyze'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
