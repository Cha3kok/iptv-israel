const GQL_URL = 'https://backend.iptv.co.il/graphql'

async function fetchGQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  })

  if (!res.ok) throw new Error(`GraphQL fetch failed: ${res.status}`)

  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0]?.message ?? 'GraphQL error')

  return json.data as T
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WPPost {
  id: string
  databaseId: number
  title: string
  slug: string
  excerpt: string
  date: string
  content: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  } | null
  categories: {
    nodes: { name: string; slug: string }[]
  }
  author: {
    node: { name: string }
  } | null
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const POST_FIELDS = `
  id
  databaseId
  title
  slug
  excerpt
  date
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  categories {
    nodes { name slug }
  }
`

export async function getAllPosts(first = 100): Promise<WPPost[]> {
  const data = await fetchGQL<{ posts: { nodes: WPPost[] } }>(`
    query GetPosts($first: Int) {
      posts(first: $first) {
        nodes { ${POST_FIELDS} }
      }
    }
  `, { first })

  return data.posts.nodes
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchGQL<{ post: WPPost | null }>(`
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ${POST_FIELDS}
        content
        author { node { name } }
      }
    }
  `, { slug })

  if (data.post?.content) {
    data.post.content = sanitizeContent(data.post.content)
  }

  return data.post
}

// Remove bare backend URLs and empty paragraphs injected by WordPress
function sanitizeContent(html: string): string {
  return html
    // Remove any <p> that contains only a backend.iptv.co.il URL (with optional whitespace)
    .replace(/<p[^>]*>\s*https?:\/\/backend\.iptv\.co\.il[^\s<]*\s*<\/p>/gi, '')
    // Remove any standalone backend URL as plain text (but not inside href/src/srcset attributes)
    .replace(/(?<!href=["']|src=["']|srcset=["'][^"']*)https?:\/\/backend\.iptv\.co\.il\/[^\s<"']*/gi, '')
    // Clean up resulting empty paragraphs
    .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '')
}

// Strip HTML tags to get plain text excerpt
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

// Estimate reading time (words / 200 wpm)
export function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
