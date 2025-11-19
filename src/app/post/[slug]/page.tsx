'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: string
  publishedAt?: string
  readTime?: number
  viewCount: number
  likeCount: number
  commentCount: number
  featured: boolean
  aiGenerated: boolean
  author: {
    id: string
    name?: string
    avatar?: string
    email: string
    bio?: string
    website?: string
    twitter?: string
    github?: string
    linkedin?: string
  }
  category?: {
    id: string
    name: string
    slug: string
    color?: string
    description?: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
    color?: string
  }>
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  readTime?: number
  viewCount: number
  author: {
    name?: string
    avatar?: string
  }
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${slug}`)
      if (!response.ok) {
        throw new Error('Post not found')
      }
      const data = await response.json()
      setPost(data.post)
      setRelatedPosts(data.relatedPosts || [])
      setLikeCount(data.post.likeCount)
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const timeAgo = post.publishedAt 
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
    : 'Draft'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleLike}>
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="ml-1">{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <article className="mb-12">
          {/* Category and Badges */}
          <div className="flex items-center gap-2 mb-4">
            {post.category && (
              <Badge 
                variant="secondary" 
                style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
              >
                {post.category.name}
              </Badge>
            )}
            {post.featured && (
              <Badge variant="default">Featured</Badge>
            )}
            {post.aiGenerated && (
              <Badge variant="outline">AI Generated</Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name?.charAt(0) || post.author.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{timeAgo}</span>
                  {post.readTime && (
                    <>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </>
                  )}
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="outline"
                  style={{ borderColor: tag.color + '40', color: tag.color }}
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="mb-8" />

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>

        {/* Author Bio */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name?.charAt(0) || post.author.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{post.author.name}</h3>
                {post.author.bio && (
                  <p className="text-muted-foreground mb-4">{post.author.bio}</p>
                )}
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">Follow</Button>
                  <Button variant="ghost" size="sm">View Profile</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Link href={`/post/${relatedPost.slug}`}>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={relatedPost.author.avatar} alt={relatedPost.author.name} />
                          <AvatarFallback>
                            {relatedPost.author.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{relatedPost.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{relatedPost.readTime} min</span>
                        <Eye className="w-3 h-3 ml-2" />
                        <span>{relatedPost.viewCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}