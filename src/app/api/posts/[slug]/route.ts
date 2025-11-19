import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const post = await db.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            website: true,
            twitter: true,
            github: true,
            linkedin: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            description: true
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

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.post.update({
      where: { id: post.id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    // Get related posts (same category, excluding current post)
    const relatedPosts = await db.post.findMany({
      where: {
        categoryId: post.categoryId,
        id: { not: post.id },
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 3
    })

    // Transform the data
    const transformedPost = {
      ...post,
      tags: post.postTags.map(pt => pt.tag),
      commentCount: post._count.comments,
      postTags: undefined,
      _count: undefined
    }

    return NextResponse.json({
      post: transformedPost,
      relatedPosts
    })

  } catch (error: any) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      coverImage,
      categoryId,
      tags = [],
      published,
      featured,
      aiGenerated,
      aiPrompt
    } = body

    // Find the existing post
    const existingPost = await db.post.findUnique({
      where: { slug }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Generate new slug if title changed
    let newSlug = slug
    if (title && title !== existingPost.title) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now()
    }

    // Calculate read time
    const wordCount = content?.split(/\s+/).length || 0
    const readTime = Math.ceil(wordCount / 200)

    // Update the post
    const updatedPost = await db.post.update({
      where: { id: existingPost.id },
      data: {
        ...(title && { title }),
        ...(newSlug !== slug && { slug: newSlug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(categoryId !== undefined && { categoryId }),
        ...(published !== undefined && { 
          published,
          publishedAt: published && !existingPost.published ? new Date() : existingPost.publishedAt
        }),
        ...(featured !== undefined && { featured }),
        ...(aiGenerated !== undefined && { aiGenerated }),
        ...(aiPrompt !== undefined && { aiPrompt }),
        readTime
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

    // Handle tags - remove existing and add new ones
    await db.postTag.deleteMany({
      where: { postId: existingPost.id }
    })

    if (tags.length > 0) {
      for (const tagName of tags) {
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

        await db.postTag.create({
          data: {
            postId: existingPost.id,
            tagId: tag.id
          }
        })
      }
    }

    // Fetch complete updated post
    const completePost = await db.post.findUnique({
      where: { id: existingPost.id },
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

    // Transform response
    const transformedPost = {
      ...completePost,
      tags: completePost?.postTags.map(pt => pt.tag) || [],
      commentCount: completePost?._count.comments || 0,
      postTags: undefined,
      _count: undefined
    }

    return NextResponse.json(transformedPost)

  } catch (error: any) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const existingPost = await db.post.findUnique({
      where: { slug }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Delete the post (cascade will handle postTags and comments)
    await db.post.delete({
      where: { id: existingPost.id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })

  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 }
    )
  }
}