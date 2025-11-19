import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, context } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    let systemPrompt = ''
    let userPrompt = prompt

    // Different system prompts based on the type of content generation
    switch (type) {
      case 'blog_post':
        systemPrompt = `You are a professional blog content writer. Write engaging, well-structured blog posts that are informative and interesting to read. Use markdown formatting for better readability. Include proper headings, bullet points, and formatting. The content should be original and plagiarism-free.`
        break
      case 'title':
        systemPrompt = `You are a creative headline writer. Generate catchy, SEO-friendly blog post titles that grab attention and accurately represent the content. Return 5-10 title suggestions, each on a new line.`
        break
      case 'excerpt':
        systemPrompt = `You are a content summarizer. Write compelling 2-3 sentence excerpts that summarize the main points of a blog post and entice readers to continue reading. Keep it under 150 characters.`
        break
      case 'outline':
        systemPrompt = `You are a content strategist. Create detailed blog post outlines with clear sections, headings, and bullet points. Structure the outline logically with introduction, main points, and conclusion.`
        break
      case 'continue':
        systemPrompt = `You are a content writer. Continue writing the blog post in the same style and tone as the existing content. Maintain consistency and flow. Pick up exactly where the existing content leaves off.`
        break
      case 'rewrite':
        systemPrompt = `You are a content editor. Rewrite and improve the given text to make it more engaging, clear, and professional. Fix grammar, improve flow, and enhance readability while preserving the original meaning.`
        break
      case 'seo_optimize':
        systemPrompt = `You are an SEO expert. Optimize the blog content for search engines by including relevant keywords naturally, improving readability, and ensuring proper structure. Focus on user value while following SEO best practices.`
        break
      default:
        systemPrompt = `You are a helpful AI content assistant. Generate high-quality, engaging content based on the user's request.`
    }

    // Add context if provided
    if (context) {
      userPrompt = `Context: ${context}\n\nRequest: ${prompt}`
    }

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: type === 'title' ? 200 : 2000,
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      )
    }

    // For title generation, parse the response into an array
    let processedContent = generatedContent
    if (type === 'title') {
      processedContent = generatedContent
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)
    }

    return NextResponse.json({
      success: true,
      content: processedContent,
      type,
      prompt
    })

  } catch (error: any) {
    console.error('AI Content Generation Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Handle different content generation types
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'AI Content Generation API',
    endpoints: {
      'POST /api/ai/generate': {
        description: 'Generate AI content for blog posts',
        parameters: {
          prompt: 'string (required) - The content generation prompt',
          type: 'string (optional) - Type of content: blog_post, title, excerpt, outline, continue, rewrite, seo_optimize',
          context: 'string (optional) - Additional context for content generation'
        },
        types: {
          blog_post: 'Generate a complete blog post',
          title: 'Generate title suggestions',
          excerpt: 'Generate a post excerpt',
          outline: 'Generate a blog post outline',
          continue: 'Continue writing existing content',
          rewrite: 'Rewrite and improve content',
          seo_optimize: 'Optimize content for SEO'
        }
      }
    }
  })
}