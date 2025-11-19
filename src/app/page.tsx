'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { BlogPostCard } from '@/components/BlogPostCard'
import { BlogFilters } from '@/components/BlogFilters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PenTool, Sparkles, TrendingUp, Users, FileText } from 'lucide-react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  publishedAt?: string
  readTime?: number
  viewCount: number
  likeCount: number
  commentCount: number
  featured: boolean
  aiGenerated: boolean
  author: {
    name?: string
    avatar?: string
    email: string
  }
  category?: {
    name: string
    slug: string
    color?: string
  }
  tags: Array<{
    name: string
    slug: string
    color?: string
  }>
}

interface Category {
  id: string
  name: string
  slug: string
  postCount: number
}

interface Tag {
  id: string
  name: string
  slug: string
  count: number
}

interface Stats {
  posts: number
  authors: number
  views: number
  aiGenerated: number
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [popularTags, setPopularTags] = useState<Tag[]>([])
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    authors: 0,
    views: 0,
    aiGenerated: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('latest')

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [])

  // Fetch posts when filters change
  useEffect(() => {
    if (posts.length > 0) {
      fetchPosts()
    }
  }, [searchQuery, selectedCategory, selectedSort])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [postsRes, categoriesRes, tagsRes, statsRes] = await Promise.all([
        fetch('/api/posts?limit=6'),
        fetch('/api/categories'),
        fetch('/api/tags'),
        fetch('/api/stats')
      ])

      const postsData = await postsRes.json()
      const categoriesData = await categoriesRes.json()
      const tagsData = await tagsRes.json()
      const statsData = await statsRes.json()

      setPosts(postsData.posts || [])
      setCategories(categoriesData || [])
      setPopularTags(tagsData.slice(0, 5) || [])
      setStats(statsData || { posts: 0, authors: 0, views: 0, aiGenerated: 0 })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        limit: '6',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        sort: selectedSort
      })

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  // Filter and sort posts
  const filteredPosts = posts

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to <span className="text-primary">BlogAI</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover insightful articles and create amazing content with the power of AI. 
                Join our community of writers and readers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/write" className="flex items-center space-x-2">
                    <PenTool className="w-5 h-5" />
                    <span>Start Writing</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/write" className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Try AI Assistant</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.posts.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.authors.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Authors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.aiGenerated.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">AI Generated</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <BlogFilters
            onSearch={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSelectedSort}
            onTagFilter={(tag) => console.log('Tag filter:', tag)}
            categories={categories}
            popularTags={popularTags}
            selectedCategory={selectedCategory}
            selectedSort={selectedSort}
            searchQuery={searchQuery}
          />
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <Button variant="outline" asChild>
              <Link href="/all-posts">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedSort('latest')
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}