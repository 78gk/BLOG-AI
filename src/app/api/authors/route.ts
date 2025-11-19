import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const authors = await db.user.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true
              }
            }
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    })

    const transformedAuthors = authors.map(author => ({
      ...author,
      _count: {
        posts: author._count.posts
      }
    }))

    return NextResponse.json(transformedAuthors)

  } catch (error: any) {
    console.error('Error fetching authors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch authors', details: error.message },
      { status: 500 }
    )
  }
}