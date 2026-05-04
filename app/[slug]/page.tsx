import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getPostBySlug, stripHtml, readingTime } from '@/lib/posts'
import { format } from 'date-fns'
import { Clock, ArrowLeft, CalendarDays, User } from 'lucide-react'
import { waTrial, waBuy } from '@/lib/whatsapp'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = false

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const ogImages = post.coverImage
    ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.coverAlt || post.title }]
    : []

  return {
    title: `${post.title} | IPTV ישראל`,
    description: post.excerpt.slice(0, 160),
    alternates: { canonical: `https://iptv.co.il/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 160),
      type: 'article',
      publishedTime: post.date,
      locale: 'he_IL',
      siteName: 'IPTV ישראל',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt.slice(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

/** Split HTML at the midpoint <hr> so we can inject a mid-article CTA */
function splitAtMidHr(html: string): [string, string] {
  const parts = html.split('<hr>')
  if (parts.length < 3) return [html, '']
  const mid = Math.ceil(parts.length / 2)
  return [
    parts.slice(0, mid).join('<hr>'),
    '<hr>' + parts.slice(mid).join('<hr>'),
  ]
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const minutes = readingTime(post.content)
  const [firstHalf, secondHalf] = splitAtMidHr(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author || 'צוות IPTV ישראל',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IPTV ישראל',
      url: 'https://iptv.co.il',
      logo: {
        '@type': 'ImageObject',
        url: 'https://iptv.co.il/logo.png',
        width: 200,
        height: 60,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    image: post.coverImage
      ? [{ '@type': 'ImageObject', url: post.coverImage, width: 1200, height: 630 }]
      : [],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://iptv.co.il/${slug}`,
    },
  }

  return (
    <div className="min-h-screen bg-[#0B0F13] text-[#F8FAFC]">
      <Navbar />

      {/* ── JSON-LD Structured Data (Google Discover / Rich Results) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <div className="relative w-full pt-16">
        {post.coverImage ? (
          <>
            <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F13] via-[#0B0F13]/60 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0">
              <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
                {post.category && (
                  <span className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    {post.category}
                  </span>
                )}
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                  {post.title}
                </h1>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-3xl px-4 pb-10 pt-16 sm:px-6">
            {post.category && (
              <span className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {post.category}
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
          {post.author && (
            <span className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                <User className="h-3.5 w-3.5" />
              </span>
              {post.author}
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
        {post.excerpt && (
          <p className="mb-10 text-xl font-light leading-relaxed text-[#cbd5e1]">
            {post.excerpt}
          </p>
        )}

        {/* ── CTA #1 – Top (before content) ── */}
        <div className="mb-10 flex flex-col items-center gap-3 rounded-2xl border border-[#10B981]/20 bg-[#0d1f1a] px-6 py-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-400">ניסיון חינם ✓ ללא התחייבות</p>
            <p className="mt-0.5 text-base font-bold text-white">
              קבל 3 שעות IPTV בחינם – כולל 21,000 ערוצים ו-4K UHD
            </p>
          </div>
          <Link
            href={waTrial()}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-glow shrink-0 rounded-xl bg-[#10B981] px-7 py-3 font-bold text-[#0B0F13] transition-all hover:brightness-110"
          >
            שלח הודעה ב-WhatsApp →
          </Link>
        </div>

        {/* ── Content – First half ── */}
        <div
          dir="ltr"
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: firstHalf }}
        />

        {/* ── CTA #2 – Mid-article ── */}
        {secondHalf && (
          <>
            <div className="my-10 overflow-hidden rounded-2xl border border-[#10B981]/30 bg-gradient-to-br from-[#0d1f1a] to-[#0B0F13]">
              <div className="p-8 text-center sm:p-10">
                <span className="mb-3 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  מנוי פרימיום
                </span>
                <h3 className="mb-3 text-2xl font-black">
                  מוכן לצפות ב-21,000 ערוצים?{' '}
                  <span className="text-[#10B981]">מתחילים עכשיו</span>
                </h3>
                <p className="mx-auto mb-8 max-w-sm text-[#94A3B8]">
                  הצטרף לאלפי לקוחות מרוצים. ₪62 לחודש – הכל כלול, ללא עלויות נסתרות.
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href={waTrial()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neon-glow inline-block rounded-xl bg-[#10B981] px-8 py-3.5 font-bold text-[#0B0F13] transition-all hover:brightness-110"
                  >
                    קבל ניסיון חינם של 3 שעות
                  </Link>
                  <Link
                    href={waBuy()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-xl border border-[#10B981]/40 px-8 py-3.5 font-semibold text-[#10B981] transition-all hover:border-[#10B981] hover:bg-[#10B981]/10"
                  >
                    רכוש מנוי עכשיו
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Content – Second half ── */}
            <div
              dir="ltr"
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: secondHalf }}
            />
          </>
        )}

        {/* ── CTA #3 – Bottom ── */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-[#10B981]/20 bg-gradient-to-br from-[#0d1f1a] to-[#0B0F13]">
          <div className="p-8 text-center sm:p-10">
            <span className="mb-3 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              מוכן להתחיל?
            </span>
            <h3 className="mb-3 text-2xl font-black">
              קבל 24 שעות ניסיון <span className="text-[#10B981]">בחינם</span>
            </h3>
            <p className="mx-auto mb-8 max-w-sm text-[#94A3B8]">
              הצטרף לאלפי לקוחות מרוצים ותיהנה מ-21,000+ ערוצים באיכות 4K.
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
            חזרה לבלוג
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
