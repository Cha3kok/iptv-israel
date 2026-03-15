import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, stripHtml, readingTime } from '@/lib/wordpress'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Clock, Rss } from 'lucide-react'

export const metadata: Metadata = {
  title: 'בלוג | IPTV ישראל',
  description: 'מדריכים, טיפים והשוואות על IPTV – כל מה שצריך לדעת על שירותי טלוויזיה באינטרנט.',
  alternates: { canonical: 'https://iptv.co.il/blog' },
}

// Revalidate every hour (ISR)
export const revalidate = 3600

export default async function BlogPage() {
  const posts = await getAllPosts(100)
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (sorted.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0F13] text-[#F8FAFC]">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 text-center">
          <p className="text-[#94A3B8]">אין מאמרים כרגע. חזור בקרוב.</p>
        </main>
        <Footer />
      </div>
    )
  }

  const [featured, ...rest] = sorted

  return (
    <div className="min-h-screen bg-[#0B0F13] text-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363D] bg-[#151B23] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#10B981]">
            <Rss className="h-3 w-3" /> הבלוג שלנו
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            מדריכים &amp; טיפים
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#94A3B8]">
            כל מה שצריך לדעת על IPTV – מהגדרה ראשונה ועד טיפים מתקדמים לחוויית צפייה מושלמת.
          </p>
        </div>

        {/* Featured post */}
        <Link
          href={`/${featured.slug}`}
          className="glass group mb-10 grid overflow-hidden rounded-2xl transition-all hover:border-[#10B981]/30 md:grid-cols-2"
        >
          {/* Image */}
          {featured.featuredImage?.node.sourceUrl && (
            <div className="relative h-56 w-full overflow-hidden md:h-full">
              <Image
                src={featured.featuredImage.node.sourceUrl}
                alt={featured.featuredImage.node.altText || featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F13] via-[#0B0F13]/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {featured.categories.nodes[0] && (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                  {featured.categories.nodes[0].name}
                </span>
              )}
              <span className="text-xs text-[#94A3B8]">
                {format(new Date(featured.date), 'd MMMM yyyy', { locale: he })}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                <Clock className="h-3 w-3" />
                {readingTime(featured.excerpt)} דק׳ קריאה
              </span>
            </div>

            <h2 className="mb-3 text-2xl font-bold leading-snug transition-colors group-hover:text-[#10B981] md:text-3xl">
              {featured.title}
            </h2>
            <p className="line-clamp-3 text-[#94A3B8]">
              {stripHtml(featured.excerpt)}
            </p>

            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#10B981]">
              קרא עוד ←
            </span>
          </div>
        </Link>

        {/* Rest of posts */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="glass group flex flex-col overflow-hidden rounded-2xl transition-all hover:border-[#10B981]/30"
              >
                {/* Thumbnail */}
                {post.featuredImage?.node.sourceUrl && (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151B23] via-transparent to-transparent" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {post.categories.nodes[0] && (
                    <span className="mb-3 inline-block w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      {post.categories.nodes[0].name}
                    </span>
                  )}

                  <h2 className="mb-3 flex-1 text-lg font-bold leading-snug transition-colors group-hover:text-[#10B981]">
                    {post.title}
                  </h2>

                  <p className="mb-5 line-clamp-2 text-sm text-[#94A3B8]">
                    {stripHtml(post.excerpt)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>{format(new Date(post.date), 'd MMM yyyy', { locale: he })}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {readingTime(post.excerpt)} דק׳
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
