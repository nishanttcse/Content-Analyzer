'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, TrendingUp, Users, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FileUpload {
  file: File
  id: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  extractedText?: string
  analysis?: {
    engagementScore: number
    suggestions: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    keyTopics: string[]
  }
  error?: string
}

export default function SocialMediaContentAnalyzer() {
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading' as const,
      progress: 0
    }))
    
    setUploads(prev => [...prev, ...newUploads])
    
    // Process each file
    newUploads.forEach(upload => {
      processFile(upload)
    })
  }, [])

  const processFile = async (upload: FileUpload) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setUploads(prev => prev.map(u => 
          u.id === upload.id ? { ...u, progress } : u
        ))
      }

      // Start processing
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, status: 'processing', progress: 0 } : u
      ))

      // Create form data and send to API
      const formData = new FormData()
      formData.append('file', upload.file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process file')
      }

      const result = await response.json()

      // Simulate processing progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploads(prev => prev.map(u => 
          u.id === upload.id ? { ...u, progress } : u
        ))
      }

      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { 
          ...u, 
          status: 'completed', 
          progress: 100,
          extractedText: result.extractedText,
          analysis: result.analysis
        } : u
      ))

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${upload.file.name}`,
      })

    } catch (error) {
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { 
          ...u, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Failed to process file. Please try again.'
        } : u
      ))
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']
    },
    multiple: true
  })

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const getStatusIcon = (status: FileUpload['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: FileUpload['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500'
      case 'processing':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Social Media Content Analyzer
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload your documents and images to analyze content and get engagement improvement suggestions
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Upload PDF files or images (PNG, JPG, TIFF) for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              {isDragActive ? (
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Drop the files here...
                </p>
              ) : (
                <div>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                    Drag & drop files here, or click to select files
                  </p>
                  <p className="text-sm text-slate-500">
                    Supports PDF, PNG, JPG, TIFF files
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploads List */}
        {uploads.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Analysis Results
            </h2>
            
            {uploads.map((upload) => (
              <Card key={upload.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {upload.file.type.includes('pdf') ? (
                        <FileText className="h-8 w-8 text-red-500" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-blue-500" />
                      )}
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {upload.file.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(upload.status)}
                      <Badge className={getStatusColor(upload.status)}>
                        {upload.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(upload.id)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>

                  {(upload.status === 'uploading' || upload.status === 'processing') && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{upload.status === 'uploading' ? 'Uploading...' : 'Processing...'}</span>
                        <span>{upload.progress}%</span>
                      </div>
                      <Progress value={upload.progress} className="w-full" />
                    </div>
                  )}

                  {upload.status === 'error' && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {upload.error || 'An error occurred while processing the file.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {upload.status === 'completed' && upload.analysis && (
                    <div className="mt-6 space-y-6">
                      {/* Engagement Score */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Engagement Score:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${upload.analysis.engagementScore}%` }}
                            />
                          </div>
                          <span className="font-semibold text-green-600">
                            {upload.analysis.engagementScore}%
                          </span>
                        </div>
                      </div>

                      {/* Sentiment */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Sentiment:</span>
                        <Badge 
                          variant={
                            upload.analysis.sentiment === 'positive' ? 'default' :
                            upload.analysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                          }
                        >
                          {upload.analysis.sentiment}
                        </Badge>
                      </div>

                      {/* Key Topics */}
                      <div>
                        <h4 className="font-medium mb-2">Key Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {upload.analysis.keyTopics.map((topic, index) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Suggestions */}
                      <div>
                        <h4 className="font-medium mb-3">Engagement Improvement Suggestions:</h4>
                        <div className="grid gap-3 md:grid-cols-2">
                          {upload.analysis.suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                {suggestion}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Extracted Text Preview */}
                      {upload.extractedText && (
                        <div>
                          <Separator className="my-4" />
                          <h4 className="font-medium mb-2">Extracted Text Preview:</h4>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg max-h-32 overflow-y-auto">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {upload.extractedText.substring(0, 200)}...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Features Section */}
        {uploads.length === 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">PDF Analysis</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Extract and analyze text from PDF documents while maintaining formatting
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">OCR Technology</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Advanced OCR to extract text from scanned documents and images
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="flex gap-1">
                    <Heart className="h-6 w-6 text-red-500" />
                    <MessageCircle className="h-6 w-6 text-blue-500" />
                    <Share2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Smart Insights</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get AI-powered suggestions to improve social media engagement
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}