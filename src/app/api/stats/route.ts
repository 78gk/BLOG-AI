import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const stats = await Promise.all([
      // Total posts
      db.post.count({
        where: { published: true }
      }),
      // Total authors
      db.user.count(),
      // Total views
      db.post.aggregate({
        where: { published: true },
        _sum: { viewCount: true }
      }),
      // AI generated posts
      db.post.count({
        where: { 
          published: true,
          aiGenerated: true 
        }
      }),
      // Total categories
      db.category.count(),
      // Total tags
      db.tag.count(),
      // Total comments
      db.comment.count()
    ])

    const [totalPosts, totalAuthors, totalViews, aiGeneratedPosts, totalCategories, totalTags, totalComments] = stats

    return NextResponse.json({
      posts: totalPosts,
      authors: totalAuthors,
      views: totalViews._sum.viewCount || 0,
      aiGenerated: aiGeneratedPosts,
      categories: totalCategories,
      tags: totalTags,
      comments: totalComments
    })

  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    )
  }
}