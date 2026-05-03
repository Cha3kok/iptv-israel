import fs from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  content: string
  coverImage?: string
  coverAlt?: string
  category?: string
  author?: string
}

// ── Frontmatter parser ────────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    if (key) data[key] = value
  }

  return { data, body: match[2] }
}

// ── Markdown → HTML ───────────────────────────────────────────────────────────

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

function mdToHtml(md: string): string {
  // Stash fenced code blocks so inner content isn't processed
  const codeBlocks: string[] = []
  md = md.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    codeBlocks.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${escaped}</code></pre>`)
    return `\x00CODE${codeBlocks.length - 1}\x00`
  })

  const out: string[] = []
  const lines = md.split('\n')
  let i = 0
  let listStack: string[] = []
  let inTable = false
  let tableHead = true

  const closeList = () => {
    while (listStack.length) out.push(`</${listStack.pop()}>`)
  }

  const closeTable = () => {
    if (inTable) { out.push('</tbody></table>'); inTable = false }
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Code block placeholder
    if (/^\x00CODE\d+\x00$/.test(trimmed)) {
      closeList(); closeTable()
      out.push(trimmed)
      i++; continue
    }

    // Heading
    const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (hMatch) {
      closeList(); closeTable()
      const lvl = hMatch[1].length
      out.push(`<h${lvl}>${inline(hMatch[2])}</h${lvl}>`)
      i++; continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeList(); closeTable()
      out.push('<hr>')
      i++; continue
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      closeList(); closeTable()
      out.push(`<blockquote><p>${inline(trimmed.slice(2))}</p></blockquote>`)
      i++; continue
    }

    // GFM table header
    if (trimmed.includes('|') && lines[i + 1]?.trim().match(/^\|?[\s|:-]+\|/)) {
      closeList(); closeTable()
      const cells = trimmed.replace(/^\||\|$/g, '').split('|').map(c => `<th>${inline(c.trim())}</th>`).join('')
      out.push(`<table><thead><tr>${cells}</tr></thead><tbody>`)
      inTable = true
      tableHead = false
      i += 2; continue
    }

    // GFM table body row
    if (inTable && trimmed.includes('|')) {
      const cells = trimmed.replace(/^\||\|$/g, '').split('|').map(c => `<td>${inline(c.trim())}</td>`).join('')
      out.push(`<tr>${cells}</tr>`)
      i++; continue
    }

    // Unordered list item
    if (/^[-*+]\s+/.test(trimmed)) {
      closeTable()
      if (!listStack.length || listStack[listStack.length - 1] !== 'ul') {
        if (listStack.length) closeList()
        out.push('<ul>'); listStack.push('ul')
      }
      out.push(`<li>${inline(trimmed.replace(/^[-*+]\s+/, ''))}</li>`)
      i++; continue
    }

    // Ordered list item
    if (/^\d+\.\s+/.test(trimmed)) {
      closeTable()
      if (!listStack.length || listStack[listStack.length - 1] !== 'ol') {
        if (listStack.length) closeList()
        out.push('<ol>'); listStack.push('ol')
      }
      out.push(`<li>${inline(trimmed.replace(/^\d+\.\s+/, ''))}</li>`)
      i++; continue
    }

    // Empty line
    if (trimmed === '') {
      closeList(); closeTable()
      i++; continue
    }

    // Paragraph
    closeList(); closeTable()
    out.push(`<p>${inline(trimmed)}</p>`)
    i++
  }

  closeList()
  closeTable()

  // Restore code blocks
  let html = out.join('\n')
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`\x00CODE${idx}\x00`, block)
  })

  return html
}

// ── Public API ────────────────────────────────────────────────────────────────

function loadPost(filename: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8')
  const { data, body } = parseFrontmatter(raw)
  const slug = data.slug || filename.replace(/\.md$/, '')

  return {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    content: mdToHtml(body),
    coverImage: data.coverImage || undefined,
    coverAlt: data.coverAlt || undefined,
    category: data.category || undefined,
    author: data.author || undefined,
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_DIR)) return []
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  const posts = files.map(loadPost)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!fs.existsSync(POSTS_DIR)) return null
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  const file = files.find((f) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')
    const { data } = parseFrontmatter(raw)
    return (data.slug || f.replace(/\.md$/, '')) === slug
  })
  if (!file) return null
  return loadPost(file)
}

export function readingTime(text: string): number {
  const words = text.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim()
}
