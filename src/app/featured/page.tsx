'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { BlogPostCard } from '@/components/BlogPostCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, TrendingUp } from 'lucide-react'
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

export default function FeaturedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedPosts()
  }, [])

  const fetchFeaturedPosts = async () => {
    try {
      const response = await fetch('/api/posts?featured=true&limit=12')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching featured posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-primary mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold">Featured Articles</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our hand-picked selection of the most insightful and engaging content. 
              These articles represent the best of our community.
            </p>
          </div>
        </section>

        {/* Featured Stats */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{posts.length}</div>
                <div className="text-muted-foreground">Featured Articles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {posts.reduce((sum, post) => sum + post.viewCount, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">Total Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {posts.reduce((sum, post) => sum + post.likeCount, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">Total Likes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Trending Now
            </h2>
            <Button variant="outline" asChild>
              <Link href="/">View All Articles</Link>
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
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Featured Articles Yet</h3>
              <p className="text-muted-foreground mb-4">
                Our editors are currently selecting the best articles to feature. 
                Check back soon for amazing content!
              </p>
              <Button asChild>
                <Link href="/">Browse All Articles</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}