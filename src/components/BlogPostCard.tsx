'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Clock, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BlogPostCardProps {
  post: {
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
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const router = useRouter()
  const timeAgo = post.publishedAt 
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
    : 'Draft'

  const handleCardClick = () => {
    router.push(`/post/${post.slug}`)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer" onClick={handleCardClick}>
      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        {/* Category and Badges */}
        <div className="flex items-center gap-2 mb-2">
          {post.category && (
            <Badge 
              variant="secondary" 
              style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
              className="text-xs"
            >
              {post.category.name}
            </Badge>
          )}
          {post.featured && (
            <Badge variant="default" className="text-xs">
              Featured
            </Badge>
          )}
          {post.aiGenerated && (
            <Badge variant="outline" className="text-xs">
              AI Generated
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link href={`/post/${post.slug}`}>
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-3 text-sm mt-2">
            {post.excerpt}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag.slug} 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: tag.color + '40', color: tag.color }}
              >
                #{tag.name}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Author and Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name?.charAt(0) || post.author.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {post.author.name || post.author.email}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{timeAgo}</span>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}