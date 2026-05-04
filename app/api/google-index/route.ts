import { NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'
import { getAllPosts } from '@/lib/posts'

const BASE_URL = 'https://iptv.co.il'

const STATIC_URLS = [
  BASE_URL,
  `${BASE_URL}/blog`,
  `${BASE_URL}/channels-list`,
  `${BASE_URL}/pricing`,
]

export async function GET() {
  const credsEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!credsEnv) {
    return NextResponse.json(
      { error: 'GOOGLE_SERVICE_ACCOUNT_JSON not configured' },
      { status: 500 },
    )
  }

  try {
    const credentials = JSON.parse(credsEnv)

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    })

    const client = await auth.getClient()
    const token  = await client.getAccessToken()

    const posts    = await getAllPosts()
    const postUrls = posts.map((p) => `${BASE_URL}/${p.slug}`)
    const allUrls  = [...STATIC_URLS, ...postUrls]

    const results = await Promise.allSettled(
      allUrls.map((url) =>
        fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({ url, type: 'URL_UPDATED' }),
        }).then((r) => r.json()),
      ),
    )

    const submitted = results.filter((r) => r.status === 'fulfilled').length
    const failed    = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({
      success: true,
      total: allUrls.length,
      submitted,
      failed,
      urls: allUrls,
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
