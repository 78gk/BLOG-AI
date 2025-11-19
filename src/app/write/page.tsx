'use client'

import { useState, useEffect } from 'react'
import { BlogEditor } from '@/components/BlogEditor'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

export default function WritePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    try {
      // For demo purposes, we'll use a fixed author ID
      // In a real app, this would come from authentication
      const postData = {
        ...data,
        authorId: '1', // Using first seeded user
        published: false, // Save as draft by default
        aiGenerated: data.aiGenerated || false
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save post')
      }

      const savedPost = await response.json()
      toast.success('Article saved as draft!')
      console.log('Saved post:', savedPost)

      // Optionally redirect to edit page
      // router.push(`/write/${savedPost.slug}`)
    } catch (error: any) {
      console.error('Error saving post:', error)
      toast.error(error.message || 'Failed to save article')
    }
  }

  const handlePreview = (data: any) => {
    console.log('Preview post:', data)
    toast.info('Preview functionality coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogEditor
        onSave={handleSave}
        onPreview={handlePreview}
        categories={categories}
      />
    </div>
  )
}