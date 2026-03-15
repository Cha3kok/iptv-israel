import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getPostBySlug, stripHtml, readingTime } from '@/lib/wordpress'
import { format } from 'date-fns'
import { Clock, ArrowLeft, CalendarDays, User } from 'lucide-react'
import { waTrial } from '@/lib/whatsapp'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await getAllPosts(100)
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} | IPTV ישראל`,
    description: stripHtml(post.excerpt).slice(0, 160),
    alternates: { canonical: `https://iptv.co.il/${slug}` },
    openGraph: {
      title: post.title,
      description: stripHtml(post.excerpt).slice(0, 160),
      type: 'article',
      publishedTime: post.date,
      locale: 'he_IL',
      images: post.featuredImage?.node.sourceUrl
        ? [{ url: post.featuredImage.node.sourceUrl }]
        : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const minutes = readingTime(post.content)
  const category = post.categories.nodes[0]

  return (
    <div className="min-h-screen bg-[#0B0F13] text-[#F8FAFC]">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative w-full pt-16">
        {post.featuredImage?.node.sourceUrl ? (
          <>
            <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                fill
                className="object-cover"
                priority
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F13] via-[#0B0F13]/60 to-transparent" />
            </div>

            {/* Title sits over the gradient */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
                {category && (
                  <span className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    {category.name}
                  </span>
                )}
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                  {post.title}
                </h1>
              </div>
            </div>
          </>
        ) : (
          /* No image — plain header */
          <div className="mx-auto max-w-3xl px-4 pb-10 pt-16 sm:px-6">
            {category && (
              <span className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {category.name}
              </span>
            )}
            <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
              {post.title}
            </h1>
          </div>
        )}
      </div>

      {/* ── Article body ── */}
      <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">

        {/* Meta bar */}
        <div className="mb-8 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#1E293B] pb-6 text-sm text-[#94A3B8]">
          {post.author?.node.name && (
            <span className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                <User className="h-3.5 w-3.5" />
              </span>
              {post.author.node.name.includes('@') ? 'Admin' : post.author.node.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-[#10B981]" />
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#10B981]" />
            {minutes} min read
          </span>
        </div>

        {/* Excerpt / lead */}
        <p className="mb-10 text-xl font-light leading-relaxed text-[#cbd5e1]">
          {stripHtml(post.excerpt)}
        </p>

        {/* Content */}
        <div
          dir="ltr"
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── CTA ── */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-[#10B981]/20 bg-gradient-to-br from-[#0d1f1a] to-[#0B0F13]">
          <div className="p-8 text-center sm:p-10">
            <span className="mb-3 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              מוכן להתחיל?
            </span>
            <h3 className="mb-3 text-2xl font-black">
              קבל 24 שעות ניסיון <span className="text-[#10B981]">בחינם</span>
            </h3>
            <p className="mx-auto mb-8 max-w-sm text-[#94A3B8]">
              הצטרף לאלפי לקוחות מרוצים ותיהנה מ-20,000+ ערוצים באיכות 4K.
            </p>
            <Link
              href={waTrial()}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-glow inline-block rounded-xl bg-[#10B981] px-10 py-3.5 font-bold text-[#0B0F13] transition-all hover:brightness-110"
            >
              התחל ניסיון חינם
            </Link>
          </div>
        </div>

        {/* Back to blog */}
        <div className="mt-10 border-t border-[#1E293B] pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8] transition-colors hover:text-[#10B981]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
