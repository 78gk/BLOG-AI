'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  Image,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Save,
  Sparkles,
  X
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIAssistant } from './AIAssistant'

interface BlogEditorProps {
  initialData?: {
    title?: string
    content?: string
    excerpt?: string
    coverImage?: string
    tags?: string[]
    category?: string
  }
  onSave?: (data: any) => void
  onPreview?: (data: any) => void
  categories?: Array<{
    id: string
    name: string
    slug: string
  }>
}

export function BlogEditor({ initialData, onSave, onPreview, categories }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [category, setCategory] = useState(initialData?.category || '')
  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const availableCategories = categories || []

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  const formatText = (type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**')
        break
      case 'italic':
        insertText('*', '*')
        break
      case 'underline':
        insertText('__', '__')
        break
      case 'code':
        insertText('`', '`')
        break
      case 'heading1':
        insertText('# ', '')
        break
      case 'heading2':
        insertText('## ', '')
        break
      case 'heading3':
        insertText('### ', '')
        break
      case 'quote':
        insertText('> ', '')
        break
      case 'list':
        insertText('- ', '')
        break
      case 'orderedList':
        insertText('1. ', '')
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) insertText('[', `](${url})`)
        break
      case 'image':
        const imgUrl = prompt('Enter image URL:')
        if (imgUrl) insertText('![', `](${imgUrl})`)
        break
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    const postData = {
      title,
      content,
      excerpt,
      coverImage,
      tags,
      category
    }
    onSave?.(postData)
  }

  const handlePreview = () => {
    const postData = {
      title,
      content,
      excerpt,
      coverImage,
      tags,
      category
    }
    onPreview?.(postData)
    setIsPreview(true)
  }

  const handleAIGeneratedContent = (generatedContent: string, type: string) => {
    switch (type) {
      case 'title':
        if (Array.isArray(generatedContent)) {
          setTitle(generatedContent[0] || '')
        } else {
          setTitle(generatedContent)
        }
        break
      case 'excerpt':
        setExcerpt(generatedContent)
        break
      case 'blog_post':
        setContent(generatedContent)
        break
      case 'outline':
        setContent(generatedContent)
        break
      case 'continue':
        setContent(content + '\n\n' + generatedContent)
        break
      case 'rewrite':
        setContent(generatedContent)
        break
      case 'seo_optimize':
        setContent(generatedContent)
        break
      default:
        setContent(generatedContent)
    }
    setIsAIDialogOpen(false)
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering (in a real app, you'd use a proper markdown parser)
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (match, alt, src) => {
        const altText = alt || 'Image'
        return `<img src="${src}" alt="${altText}" className="rounded-lg mb-4" />`
      })
      .split('\n').map(line => line.trim() ? `<p class="mb-4">${line}</p>` : '<br />').join('')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {initialData ? 'Edit Article' : 'Create New Article'}
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      <Tabs value={isPreview ? "preview" : "edit"} onValueChange={(value) => setIsPreview(value === "preview")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your article title..."
              className="text-lg font-semibold"
            />
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief summary of your article..."
              rows={2}
            />
          </div>

          {/* Cover Image */}
          <div>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {coverImage && (
              <div className="mt-2">
                <img 
                  src={coverImage} 
                  alt="Cover image preview" 
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a category</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Content
                <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Assist
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>AI Content Assistant</DialogTitle>
                    </DialogHeader>
                    <AIAssistant
                      onContentGenerated={handleAIGeneratedContent}
                      currentContent={content}
                      currentTitle={title}
                    />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                <Button variant="ghost" size="sm" onClick={() => formatText('bold')}>
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('italic')}>
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('underline')}>
                  <Underline className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <Button variant="ghost" size="sm" onClick={() => formatText('heading1')}>
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('heading2')}>
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('heading3')}>
                  <Heading3 className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <Button variant="ghost" size="sm" onClick={() => formatText('list')}>
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('orderedList')}>
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('quote')}>
                  <Quote className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('code')}>
                  <Code className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <Button variant="ghost" size="sm" onClick={() => formatText('link')}>
                  <Link className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('image')}>
                  <Image className="w-4 h-4" alt="Insert image" />
                </Button>
              </div>

              {/* Textarea */}
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your article... (Markdown supported)"
                rows={20}
                className="font-mono"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6">
              {title && <h1 className="text-4xl font-bold mb-4">{title}</h1>}
              {excerpt && <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>}
              {coverImage && (
                <img 
                  src={coverImage} 
                  alt="Cover" 
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}