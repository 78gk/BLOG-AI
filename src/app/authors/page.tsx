'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, FileText, Eye, PenTool } from 'lucide-react'
import Link from 'next/link'

interface Author {
  id: string
  name?: string
  email: string
  avatar?: string
  bio?: string
  website?: string
  twitter?: string
  github?: string
  linkedin?: string
  _count: {
    posts: number
  }
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors')
      const data = await response.json()
      setAuthors(data || [])
    } catch (error) {
      console.error('Error fetching authors:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPosts = authors.reduce((sum, author) => sum + author._count.posts, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold">Our Authors</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the talented writers who contribute to our platform. 
              Each author brings unique perspectives and expertise to create engaging content.
            </p>
          </div>
        </section>

        {/* Authors Stats */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{authors.length}</div>
                <div className="text-muted-foreground">Active Authors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{totalPosts.toLocaleString()}</div>
                <div className="text-muted-foreground">Total Articles</div>
              </div>
            </div>
          </div>
        </section>

        {/* Authors Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Authors</h2>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.map((author) => (
                <Card key={author.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={author.avatar} alt={author.name || author.email} />
                        <AvatarFallback>
                          {(author.name || author.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                          {author.name || author.email.split('@')[0]}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {author.email}
                        </p>
                      </div>
                    </div>
                    {author.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {author.bio}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{author._count.posts} articles</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/?author=${author.id}`} className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && authors.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Authors Available</h3>
              <p className="text-muted-foreground mb-4">
                Our author community is growing. Check back soon to meet our talented writers!
              </p>
              <Button asChild>
                <Link href="/">Browse All Articles</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Join CTA */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <PenTool className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Become an Author</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Share your knowledge and insights with our community. 
              Start writing today and join our network of talented authors.
            </p>
            <Button asChild>
              <Link href="/write">Start Writing</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}