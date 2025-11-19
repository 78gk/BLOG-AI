import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: {
          select: {
            postTags: {
              where: {
                post: {
                  published: true
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    const transformedTags = tags.map(tag => ({
      ...tag,
      count: tag._count.postTags,
      _count: undefined
    }))

    // Sort by count (most popular first) and then by name
    transformedTags.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      }
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(transformedTags)

  } catch (error: any) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags', details: error.message },
      { status: 500 }
    )
  }
}