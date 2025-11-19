'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { BlogPostCard } from '@/components/BlogPostCard'
import { BlogFilters } from '@/components/BlogFilters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Filter, Grid, List } from 'lucide-react'
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

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [popularTags, setPopularTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [])

  // Fetch posts when filters change
  useEffect(() => {
    if (posts.length > 0) {
      fetchPosts()
    }
  }, [searchQuery, selectedCategory, selectedSort, currentPage])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/posts?limit=12'),
        fetch('/api/categories'),
        fetch('/api/tags')
      ])

      const postsData = await postsRes.json()
      const categoriesData = await categoriesRes.json()
      const tagsData = await tagsRes.json()

      setPosts(postsData.posts || [])
      setCategories(categoriesData || [])
      setPopularTags(tagsData.slice(0, 10) || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        limit: '12',
        page: currentPage.toString(),
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(filteredPosts.length / 12)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                All <span className="text-primary">Articles</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Browse our complete collection of articles, stories, and insights from our community of writers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/write" className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Write Article</span>
                  </Link>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filter Articles</span>
                </Button>
              </div>
            </div>
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

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{filteredPosts.length} articles</span>
          </div>
        </div>

        {/* Posts Grid/List */}
        <section>
          {loading ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
            }>
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                  </div>
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
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
            }>
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground mb-6">
                No articles found matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedSort('latest')
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <section className="mt-12">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    className="w-8 h-8"
                  >
                    {page + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}