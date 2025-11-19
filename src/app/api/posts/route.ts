import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'latest'
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      published: true,
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    if (tag) {
      where.postTags = {
        some: {
          tag: {
            slug: tag
          }
        }
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured === 'true') {
      where.featured = true
    }

    // Build order by clause
    let orderBy: any = { publishedAt: 'desc' }
    switch (sort) {
      case 'popular':
        orderBy = { viewCount: 'desc' }
        break
      case 'liked':
        orderBy = { likeCount: 'desc' }
        break
      case 'latest':
      default:
        orderBy = { publishedAt: 'desc' }
        break
    }

    // Fetch posts with related data
    const posts = await db.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        postTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Transform the data to match the expected format
    const transformedPosts = posts.map(post => ({
      ...post,
      tags: post.postTags.map(pt => pt.tag),
      commentCount: post._count.comments,
      postTags: undefined,
      _count: undefined
    }))

    // Get total count for pagination
    const total = await db.post.count({ where })

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      coverImage,
      categoryId,
      tags = [],
      published = false,
      featured = false,
      authorId,
      aiGenerated = false,
      aiPrompt
    } = body

    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'Title and author ID are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now()

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content?.split(/\s+/).length || 0
    const readTime = Math.ceil(wordCount / 200)

    // Create the post
    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        categoryId,
        published,
        featured,
        readTime,
        authorId,
        aiGenerated,
        aiPrompt,
        publishedAt: published ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      }
    })

    // Handle tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        let tag = await db.tag.findFirst({
          where: { slug: tagSlug }
        })

        if (!tag) {
          tag = await db.tag.create({
            data: {
              name: tagName,
              slug: tagSlug
            }
          })
        }

        // Create post-tag relationship
        await db.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id
          }
        })
      }
    }

    // Fetch the complete post with tags
    const completePost = await db.post.findUnique({
      where: { id: post.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        postTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    // Transform the response
    const transformedPost = {
      ...completePost,
      tags: completePost?.postTags.map(pt => pt.tag) || [],
      commentCount: completePost?._count.comments || 0,
      postTags: undefined,
      _count: undefined
    }

    return NextResponse.json(transformedPost, { status: 201 })

  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    )
  }
}