'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FolderOpen, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  postCount: number
}

export default function CategoriesPage() {
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
    } finally {
      setLoading(false)
    }
  }

  const totalPosts = categories.reduce((sum, category) => sum + category.postCount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-primary mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold">Categories</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of topics and find content that interests you. 
              Each category contains carefully curated articles by our expert authors.
            </p>
          </div>
        </section>

        {/* Categories Stats */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{categories.length}</div>
                <div className="text-muted-foreground">Active Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{totalPosts.toLocaleString()}</div>
                <div className="text-muted-foreground">Total Articles</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Categories</h2>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color || '#3b82f6' }}
                      >
                        <FolderOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    {category.description && (
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{category.postCount} articles</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/?category=${category.slug}`} className="flex items-center space-x-1">
                          <span>Browse</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Categories Available</h3>
              <p className="text-muted-foreground mb-4">
                Categories are being organized. Check back soon to explore different topics!
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