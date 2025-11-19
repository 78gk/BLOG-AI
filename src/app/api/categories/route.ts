import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
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
      orderBy: { name: 'asc' }
    })

    const transformedCategories = categories.map(category => ({
      ...category,
      postCount: category._count.posts,
      _count: undefined
    }))

    return NextResponse.json(transformedCategories)

  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if category already exists
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 409 }
      )
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        color
      }
    })

    return NextResponse.json(category, { status: 201 })

  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category', details: error.message },
      { status: 500 }
    )
  }
}