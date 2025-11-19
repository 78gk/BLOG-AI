'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, FileText, Users, TrendingUp, Eye, Heart, MessageCircle, PenTool, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  posts: number
  authors: number
  views: number
  aiGenerated: number
}

interface RecentPost {
  id: string
  title: string
  slug: string
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt?: string
  author: {
    name?: string
    email: string
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    authors: 0,
    views: 0,
    aiGenerated: 0
  })
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/posts?limit=5')
      ])

      const statsData = await statsRes.json()
      const postsData = await postsRes.json()

      setStats(statsData || { posts: 0, authors: 0, views: 0, aiGenerated: 0 })
      setRecentPosts(postsData.posts || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <BarChart className="w-8 h-8 mr-2 text-primary" />
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor your blog's performance and manage content
              </p>
            </div>
            <div className="flex space-x-2">
              <Button asChild>
                <Link href="/write" className="flex items-center space-x-2">
                  <PenTool className="w-4 h-4" />
                  <span>New Article</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>View Blog</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-8 mb-2" />
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.posts.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Articles</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-8 h-8 text-green-500" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.authors.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Authors</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Eye className="w-8 h-8 text-purple-500" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Sparkles className="w-8 h-8 text-orange-500" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{stats.aiGenerated.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">AI Generated</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </section>

        {/* Recent Posts */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Articles
              </h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex space-x-4">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <h3 className="font-medium hover:text-primary cursor-pointer">
                          <Link href={`/post/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          By {post.author.name || post.author.email} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && recentPosts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start creating content to see it appear here
                  </p>
                  <Button asChild>
                    <Link href="/write">Write Your First Article</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2">
                  <Link href="/write">
                    <PenTool className="w-6 h-6" />
                    <span>New Article</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2">
                  <Link href="/categories">
                    <FileText className="w-6 h-6" />
                    <span>Manage Categories</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2">
                  <Link href="/authors">
                    <Users className="w-6 h-6" />
                    <span>View Authors</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}