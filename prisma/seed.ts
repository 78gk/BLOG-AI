import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah.johnson@example.com',
        name: 'Sarah Johnson',
        bio: 'Tech writer and AI enthusiast with a passion for exploring the intersection of technology and creativity.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        website: 'https://sarahjohnson.dev',
        twitter: '@sarahjohnson',
        github: 'sarahjohnson',
        role: 'AUTHOR'
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike.chen@example.com',
        name: 'Mike Chen',
        bio: 'Full-stack developer specializing in React, Node.js, and cloud architecture.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        website: 'https://mikechen.dev',
        github: 'mikechen',
        role: 'AUTHOR'
      }
    }),
    prisma.user.create({
      data: {
        email: 'emily.rodriguez@example.com',
        name: 'Emily Rodriguez',
        bio: 'Software architect with expertise in scalable systems and microservices.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        website: 'https://emilyrodriguez.dev',
        linkedin: 'emilyrodriguez',
        role: 'AUTHOR'
      }
    })
  ])

  console.log('✅ Created users:', users.map(u => u.name).join(', '))

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest in tech trends, AI, software development, and digital innovation.',
        color: '#3b82f6'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Development',
        slug: 'development',
        description: 'Programming tutorials, best practices, and development workflows.',
        color: '#10b981'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design principles, tools, and creative processes.',
        color: '#f59e0b'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Business',
        slug: 'business',
        description: 'Business strategies, entrepreneurship, and industry insights.',
        color: '#ef4444'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Marketing',
        slug: 'marketing',
        description: 'Digital marketing, content strategy, and growth hacking.',
        color: '#8b5cf6'
      }
    })
  ])

  console.log('✅ Created categories:', categories.map(c => c.name).join(', '))

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'AI', slug: 'ai', color: '#8b5cf6' } }),
    prisma.tag.create({ data: { name: 'React', slug: 'react', color: '#61dafb' } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript', color: '#3178c6' } }),
    prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs', color: '#000000' } }),
    prisma.tag.create({ data: { name: 'JavaScript', slug: 'javascript', color: '#f7df1e' } }),
    prisma.tag.create({ data: { name: 'Python', slug: 'python', color: '#3776ab' } }),
    prisma.tag.create({ data: { name: 'Web Development', slug: 'web-development', color: '#3b82f6' } }),
    prisma.tag.create({ data: { name: 'Machine Learning', slug: 'machine-learning', color: '#ff6f00' } }),
    prisma.tag.create({ data: { name: 'Content Creation', slug: 'content-creation', color: '#10b981' } }),
    prisma.tag.create({ data: { name: 'Writing', slug: 'writing', color: '#f59e0b' } }),
    prisma.tag.create({ data: { name: 'Frontend', slug: 'frontend', color: '#8b5cf6' } }),
    prisma.tag.create({ data: { name: 'Backend', slug: 'backend', color: '#10b981' } }),
    prisma.tag.create({ data: { name: 'DevOps', slug: 'devops', color: '#ef4444' } }),
    prisma.tag.create({ data: { name: 'Cloud', slug: 'cloud', color: '#3b82f6' } }),
    prisma.tag.create({ data: { name: 'Architecture', slug: 'architecture', color: '#f59e0b' } }),
    prisma.tag.create({ data: { name: 'Scalability', slug: 'scalability', color: '#ef4444' } }),
    prisma.tag.create({ data: { name: 'SEO', slug: 'seo', color: '#10b981' } }),
    prisma.tag.create({ data: { name: 'Productivity', slug: 'productivity', color: '#8b5cf6' } }),
    prisma.tag.create({ data: { name: 'Tutorial', slug: 'tutorial', color: '#f59e0b' } }),
    prisma.tag.create({ data: { name: 'Best Practices', slug: 'best-practices', color: '#3b82f6' } })
  ])

  console.log('✅ Created tags:', tags.map(t => t.name).join(', '))

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with AI-Powered Content Creation',
        slug: 'getting-started-ai-content-creation',
        excerpt: 'Discover how artificial intelligence is revolutionizing the way we create and consume content in the digital age.',
        content: `# Getting Started with AI-Powered Content Creation

Artificial intelligence is revolutionizing the way we create and consume content in the digital age. From blog posts to social media updates, AI tools are becoming indispensable for content creators who want to stay competitive and efficient.

## What is AI-Powered Content Creation?

AI-powered content creation refers to the use of artificial intelligence tools and technologies to generate, enhance, or optimize written content. These tools use natural language processing (NLP) and machine learning algorithms to understand context, generate human-like text, and even adapt to different writing styles.

## Benefits of Using AI for Content Creation

### 1. Increased Productivity
One of the most significant advantages of AI content creation tools is the dramatic increase in productivity. What used to take hours can now be accomplished in minutes, allowing content creators to focus on strategy and creativity rather than mundane writing tasks.

### 2. Consistency and Quality
AI tools help maintain consistency across all your content while ensuring high quality. They can follow specific style guides, maintain brand voice, and even optimize content for SEO automatically.

### 3. Idea Generation
Writer's block becomes a thing of the past with AI assistants that can generate ideas, outlines, and even complete drafts based on minimal input.

## Popular AI Content Creation Tools

### ChatGPT and Similar Language Models
These tools can generate human-like text based on prompts, making them excellent for brainstorming, drafting, and even final content creation.

### Content Optimization Platforms
Tools that analyze your content and provide suggestions for improvement, including SEO optimization, readability improvements, and engagement enhancements.

### Automated Writing Assistants
Specialized tools that focus on specific types of content, such as social media posts, product descriptions, or email campaigns.

## Best Practices for AI Content Creation

While AI tools are powerful, they work best when combined with human oversight and creativity. Here are some best practices:

1. **Review and Edit**: Always review AI-generated content for accuracy, tone, and brand alignment.
2. **Add Personal Touch**: Inject your unique perspective and expertise into AI-generated content.
3. **Use as a Starting Point**: Treat AI output as a first draft that you can build upon and improve.
4. **Maintain Authenticity**: Ensure your content still sounds like you and reflects your brand's voice.

## The Future of AI in Content Creation

As AI technology continues to evolve, we can expect even more sophisticated tools that understand context better, generate more nuanced content, and integrate seamlessly into existing workflows. The key is to embrace these tools while maintaining the human element that makes content truly engaging and valuable.

## Conclusion

AI-powered content creation is not about replacing human creativity but augmenting it. By leveraging these tools effectively, content creators can produce more high-quality content in less time, allowing them to focus on strategy, creativity, and building meaningful connections with their audience.

The future of content creation is here, and it's a collaboration between human creativity and artificial intelligence.`,
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
        published: true,
        featured: true,
        readTime: 8,
        viewCount: 1234,
        likeCount: 89,
        authorId: users[0].id,
        categoryId: categories[0].id,
        aiGenerated: true,
        aiPrompt: 'Write a comprehensive guide about AI content creation for beginners',
        publishedAt: new Date('2024-01-15T10:00:00Z')
      }
    }),
    prisma.post.create({
      data: {
        title: 'The Future of Web Development: Trends to Watch in 2024',
        slug: 'future-web-development-trends-2024',
        excerpt: 'Explore the latest trends and technologies shaping the future of web development, from AI integration to new frameworks.',
        content: `# The Future of Web Development: Trends to Watch in 2024

The web development landscape is constantly evolving, and 2024 brings exciting new trends that are reshaping how we build and experience web applications. From AI-powered development tools to revolutionary frameworks, let's explore what's driving the future of web development.

## 1. AI-Assisted Development

Artificial intelligence is no longer just a buzzword in web development—it's becoming an essential tool.

### GitHub Copilot and AI Pair Programming
Tools like GitHub Copilot are transforming how developers write code, offering intelligent suggestions and completing entire functions based on natural language prompts.

### Automated Testing and Debugging
AI-powered tools are making it easier to identify bugs, write tests, and ensure code quality automatically.

## 2. The Rise of WebAssembly

WebAssembly (Wasm) is enabling near-native performance in web browsers, opening up new possibilities for:

- High-performance games in the browser
- Complex data processing applications
- Desktop applications ported to the web
- Resource-intensive scientific computations

## 3. Edge Computing and CDN Evolution

The shift towards edge computing is changing how we think about web application architecture:

### Benefits of Edge Computing
- Reduced latency through geographic distribution
- Improved performance for global applications
- Enhanced privacy and data sovereignty
- Better scalability and reliability

## 4. Progressive Web Apps (PWAs) Maturation

PWAs are becoming more sophisticated, offering app-like experiences:

### Key PWA Features
- Offline functionality
- Push notifications
- Background sync
- Installation on home screens
- Hardware access capabilities

## 5. Serverless Architecture Evolution

Serverless computing continues to evolve with:

### New Serverless Patterns
- Edge functions for global deployment
- Event-driven architectures
- Micro-frontend patterns
- Database-as-a-service solutions

## 6. Modern CSS Frameworks and Tools

CSS is experiencing a renaissance with:

### CSS-in-JS and Utility-First CSS
- Tailwind CSS continues to dominate
- CSS Modules for component isolation
- Container queries for responsive design
- New CSS features like :has() and container queries

## 7. JavaScript Framework Evolution

The JavaScript ecosystem continues to evolve rapidly:

### React and Meta Frameworks
- Next.js 14 with app router
- Server components and streaming
- Improved developer experience
- Better performance optimizations

### Alternative Frameworks
- Svelte for compiled components
- Solid.js for fine-grained reactivity
- Qwik for instant loading applications

## 8. Web3 and Blockchain Integration

While the hype has cooled, practical Web3 applications are emerging:

### Real-World Use Cases
- Decentralized identity solutions
- Content ownership verification
- Micropayments and creator economy
- Decentralized storage solutions

## 9. Performance and Core Web Vitals

Google's Core Web Vitals continue to influence development:

### Key Metrics to Focus On
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- New metrics like Interaction to Next Paint (INP)

## 10. Security-First Development

Security is becoming more integrated into the development process:

### Modern Security Practices
- Zero-trust architecture
- Automated security scanning
- Dependency vulnerability management
- Privacy-by-design principles

## Preparing for the Future

To stay relevant in 2024 and beyond, developers should:

1. **Embrace AI Tools**: Learn to work effectively with AI-assisted development tools
2. **Focus on Performance**: Prioritize user experience and web vitals
3. **Learn Modern Frameworks**: Stay current with the latest framework features
4. **Understand Security**: Implement security best practices from the start
5. **Think Globally**: Consider international users and accessibility

## Conclusion

The future of web development is exciting and full of opportunities. By staying current with these trends and continuously learning, developers can build better, faster, and more secure web applications that delight users worldwide.

The key is to balance adopting new technologies with maintaining stability and focusing on user needs. After all, the best web applications are those that solve real problems for real people.`,
        coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop',
        published: true,
        featured: false,
        readTime: 12,
        viewCount: 892,
        likeCount: 67,
        authorId: users[1].id,
        categoryId: categories[1].id,
        aiGenerated: false,
        publishedAt: new Date('2024-01-14T14:30:00Z')
      }
    }),
    prisma.post.create({
      data: {
        title: 'Building Scalable Applications with Modern Architecture',
        slug: 'building-scalable-applications-modern-architecture',
        excerpt: 'Learn the principles and best practices for building applications that can scale with your growing user base.',
        content: `# Building Scalable Applications with Modern Architecture

In today's digital landscape, building applications that can handle growth is not just an option—it's a necessity. Scalability determines whether your application can handle increased load, user growth, and feature expansion without compromising performance.

## Understanding Scalability

### What is Scalability?
Scalability is the ability of a system to handle a growing amount of work by adding resources to the system. There are two main types:

#### Vertical Scaling (Scaling Up)
- Increasing resources of a single server (CPU, RAM, storage)
- Simpler to implement but has physical limits
- Can become expensive quickly
- Single point of failure

#### Horizontal Scaling (Scaling Out)
- Adding more servers to distribute the load
- More complex but offers unlimited potential
- Better fault tolerance
- Cost-effective at scale

## Core Architectural Principles

### 1. Microservices Architecture
Breaking down applications into smaller, independent services:

#### Benefits
- Independent deployment and scaling
- Technology diversity
- Fault isolation
- Team autonomy

#### Challenges
- Increased complexity
- Network latency
- Data consistency
- Monitoring and debugging

### 2. Event-Driven Architecture
Using events to communicate between services:

#### Key Components
- Event producers and consumers
- Message brokers (Kafka, RabbitMQ)
- Event streaming platforms
- CQRS (Command Query Responsibility Segregation)

### 3. Database Design for Scale

#### Database Partitioning
- Horizontal partitioning (sharding)
- Vertical partitioning
- Functional partitioning

#### Replication Strategies
- Master-slave replication
- Multi-master replication
- Read replicas

#### Caching Layers
- Application-level caching
- Database query caching
- Content delivery networks (CDNs)
- Distributed caching (Redis, Memcached)

## Modern Scalability Patterns

### 1. Load Balancing
Distributing incoming traffic across multiple servers:

#### Load Balancer Types
- Application Load Balancers (Layer 7)
- Network Load Balancers (Layer 4)
- Global Load Balancers
- DNS-based load balancing

### 2. Auto Scaling
Automatically adjusting resources based on demand:

#### Scaling Triggers
- CPU utilization
- Memory usage
- Request queue length
- Custom metrics

### 3. Containerization and Orchestration
Using containers for consistent deployment:

#### Key Technologies
- Docker for containerization
- Kubernetes for orchestration
- Docker Swarm for simpler orchestration
- Service meshes (Istio, Linkerd)

## Performance Optimization

### 1. Caching Strategies

#### Multi-Level Caching
- Browser caching
- CDN caching
- Application caching
- Database caching

#### Cache Invalidation
- Time-based expiration
- Event-based invalidation
- Write-through caching
- Cache-aside pattern

### 2. Database Optimization

#### Query Optimization
- Indexing strategies
- Query plan analysis
- Connection pooling
- Read/write splitting

#### NoSQL for Scale
- Document databases (MongoDB)
- Key-value stores (Redis)
- Column-family stores (Cassandra)
- Graph databases (Neo4j)

## Monitoring and Observability

### 1. Key Metrics
- Response times
- Error rates
- Throughput
- Resource utilization

### 2. Monitoring Tools
- Application performance monitoring (APM)
- Infrastructure monitoring
- Log aggregation and analysis
- Distributed tracing

## Best Practices

### 1. Design for Failure
Assume components will fail and build resilience:

- Circuit breakers
- Bulkheads
- Retry mechanisms
- Graceful degradation

### 2. Security at Scale
- Zero-trust architecture
- Rate limiting
- DDoS protection
- Security monitoring

### 3. Cost Optimization
- Right-sizing resources
- Spot instances
- Reserved capacity
- Auto-scaling policies

## Real-World Examples

### Netflix
- Microservices architecture
- Chaos engineering
- Multi-region deployment
- Advanced caching strategies

### Amazon
- Service-oriented architecture
- Database sharding
- Global infrastructure
- Continuous deployment

### Twitter
- Timeline service optimization
- Graph database for social graph
- Real-time processing
- Edge computing

## Getting Started

### 1. Assess Current Architecture
- Identify bottlenecks
- Analyze growth patterns
- Evaluate current limitations
- Define scalability goals

### 2. Plan Incremental Changes
- Start with low-risk improvements
- Implement monitoring first
- Test thoroughly
- Roll out gradually

### 3. Build for the Future
- Design for horizontal scaling
- Implement caching early
- Use managed services when possible
- Plan for data growth

## Conclusion

Building scalable applications requires careful planning, the right architecture, and continuous optimization. By understanding these principles and patterns, you can create applications that grow with your user base and business needs.

Remember that scalability is not just about handling more users—it's about maintaining performance, reliability, and user experience as you grow. Start with a solid foundation, monitor continuously, and evolve your architecture as your needs change.

The journey to scalability is ongoing, but with the right approach, you can build applications that stand the test of time and growth.`,
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        published: true,
        featured: true,
        readTime: 15,
        viewCount: 756,
        likeCount: 45,
        authorId: users[2].id,
        categoryId: categories[1].id,
        aiGenerated: false,
        publishedAt: new Date('2024-01-13T09:15:00Z')
      }
    })
  ])

  console.log('✅ Created posts:', posts.map(p => p.title.substring(0, 30)).join('...'))

  // Create post-tag relationships
  const postTags = [
    // Post 1 tags
    { postId: posts[0].id, tagId: tags[0].id }, // AI
    { postId: posts[0].id, tagId: tags[8].id }, // Content Creation
    { postId: posts[0].id, tagId: tags[9].id }, // Writing
    
    // Post 2 tags
    { postId: posts[1].id, tagId: tags[1].id }, // React
    { postId: posts[1].id, tagId: tags[2].id }, // TypeScript
    { postId: posts[1].id, tagId: tags[3].id }, // Next.js
    { postId: posts[1].id, tagId: tags[6].id }, // Web Development
    
    // Post 3 tags
    { postId: posts[2].id, tagId: tags[14].id }, // Architecture
    { postId: posts[2].id, tagId: tags[15].id }, // Scalability
    { postId: posts[2].id, tagId: tags[12].id }, // DevOps
    { postId: posts[2].id, tagId: tags[13].id }, // Cloud
  ]

  await Promise.all(
    postTags.map(pt => 
      prisma.postTag.create({
        data: { postId: pt.postId, tagId: pt.tagId }
      })
    )
  )

  console.log('✅ Created post-tag relationships')

  // Create some sample comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great article! I\'ve been using AI tools for content creation and they\'ve been a game-changer for my productivity.',
        authorId: users[1].id,
        postId: posts[0].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'The section on best practices is particularly helpful. I agree that human oversight is crucial when using AI.',
        authorId: users[2].id,
        postId: posts[0].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'WebAssembly is definitely something I need to explore more. Thanks for the comprehensive overview!',
        authorId: users[0].id,
        postId: posts[1].id
      }
    })
  ])

  console.log('✅ Created sample comments')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })