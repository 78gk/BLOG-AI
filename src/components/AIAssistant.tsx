'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  Type, 
  List, 
  PenTool, 
  RefreshCw, 
  Search,
  Copy,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

interface AIAssistantProps {
  onContentGenerated: (content: string, type: string) => void
  currentContent?: string
  currentTitle?: string
}

interface GenerationRequest {
  prompt: string
  type: string
  context?: string
}

export function AIAssistant({ onContentGenerated, currentContent, currentTitle }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [type, setType] = useState('blog_post')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [copied, setCopied] = useState(false)

  const contentTypes = [
    { 
      value: 'blog_post', 
      label: 'Complete Blog Post', 
      icon: FileText,
      description: 'Generate a full blog post from scratch'
    },
    { 
      value: 'title', 
      label: 'Title Ideas', 
      icon: Type,
      description: 'Generate catchy title suggestions'
    },
    { 
      value: 'excerpt', 
      label: 'Excerpt', 
      icon: FileText,
      description: 'Create a compelling post summary'
    },
    { 
      value: 'outline', 
      label: 'Outline', 
      icon: List,
      description: 'Generate a structured blog post outline'
    },
    { 
      value: 'continue', 
      label: 'Continue Writing', 
      icon: PenTool,
      description: 'Continue writing existing content'
    },
    { 
      value: 'rewrite', 
      label: 'Rewrite & Improve', 
      icon: RefreshCw,
      description: 'Rewrite and improve existing content'
    },
    { 
      value: 'seo_optimize', 
      label: 'SEO Optimize', 
      icon: Search,
      description: 'Optimize content for search engines'
    }
  ]

  const quickPrompts = [
    'Write about the future of AI in web development',
    'Create a tutorial on React best practices',
    'Write about productivity tips for developers',
    'Create a guide to getting started with TypeScript',
    'Write about the importance of user experience design'
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const request: GenerationRequest = {
        prompt: prompt.trim(),
        type
      }

      // Add context for certain types
      if ((type === 'continue' || type === 'rewrite' || type === 'seo_optimize') && currentContent) {
        request.context = currentContent
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedContent(data.content)
      toast.success('Content generated successfully!')

    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseContent = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent, type)
      toast.success('Content added to editor!')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy content')
    }
  }

  const selectedType = contentTypes.find(t => t.value === type)
  const IconComponent = selectedType?.icon || Sparkles

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>AI Content Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Type Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">What would you like to generate?</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((contentType) => {
                const TypeIcon = contentType.icon
                return (
                  <SelectItem key={contentType.value} value={contentType.value}>
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{contentType.label}</div>
                        <div className="text-xs text-muted-foreground">{contentType.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Describe what you want to create</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              type === 'title' ? 'Enter a topic or theme for title suggestions...' :
              type === 'excerpt' ? 'Describe the main points of your article...' :
              type === 'outline' ? 'What should the blog post be about?' :
              type === 'continue' ? 'How should I continue this article?' :
              type === 'rewrite' ? 'What improvements would you like to make?' :
              type === 'seo_optimize' ? 'What keywords or topics should I focus on?' :
              'Describe the blog post you want to create...'
            }
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Quick Prompts */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quick prompts:</label>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((quickPrompt) => (
              <Badge
                key={quickPrompt}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setPrompt(quickPrompt)}
              >
                {quickPrompt}
              </Badge>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-4">
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Generated Content</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="sm" onClick={handleUseContent}>
                    Use This Content
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {Array.isArray(generatedContent) 
                    ? generatedContent.join('\n') 
                    : generatedContent
                  }
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-primary/5 rounded-lg p-4">
          <h4 className="font-medium mb-2 flex items-center">
            <IconComponent className="w-4 h-4 mr-2 text-primary" />
            Pro Tips
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {type === 'blog_post' && (
              <>
                <li>• Be specific about your topic and target audience</li>
                <li>• Mention key points you want to cover</li>
                <li>• Specify desired tone (formal, casual, educational, etc.)</li>
              </>
            )}
            {type === 'title' && (
              <>
                <li>• Include your main topic or keywords</li>
                <li>• Mention your target audience</li>
                <li>• Specify if you want clickbait, professional, or creative titles</li>
              </>
            )}
            {type === 'continue' && (
              <>
                <li>• The AI will analyze your existing content</li>
                <li>• Specify the direction you want the article to take</li>
                <li>• Mention any specific points to include next</li>
              </>
            )}
            {type === 'seo_optimize' && (
              <>
                <li>• List your target keywords</li>
                <li>• Mention your target audience and their search intent</li>
                <li>• Specify any particular SEO goals you have</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}