import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

const BASE_URL = 'https://iptv.co.il'
const INDEXNOW_KEY = 'a1b2c3d4e5f6789012345678iptvisrael2026'

const STATIC_URLS = [
  BASE_URL,
  `${BASE_URL}/blog`,
  `${BASE_URL}/channels-list`,
  `${BASE_URL}/pricing`,
]

export async function GET() {
  try {
    const posts = await getAllPosts()
    const postUrls = posts.map((p) => `${BASE_URL}/${p.slug}`)
    const allUrls = [...STATIC_URLS, ...postUrls]

    // Submit to Bing IndexNow (also forwarded to Google, Yandex, etc.)
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'iptv.co.il',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: allUrls,
      }),
    })

    // Also ping Google sitemap
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE_URL}/sitemap.xml`)}`,
    ).catch(() => {})

    return NextResponse.json({
      success: true,
      submitted: allUrls.length,
      urls: allUrls,
      indexnowStatus: res.status,
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
