/**
 * Daily Article Generator
 * - Reads next keyword from content/keywords.json
 * - Calls Claude API to write a full Hebrew SEO article
 * - Downloads 3 relevant images from Pexels CDN
 * - Saves article + updates keywords.json
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT        = path.join(__dirname, '..')
const KEYWORDS_FILE = path.join(ROOT, 'content/keywords.json')
const POSTS_DIR     = path.join(ROOT, 'content/posts')
const IMAGES_DIR    = path.join(ROOT, 'public/images/posts')

// ── Pexels photo pool (no API key needed for direct CDN URLs) ──────────────
const COVER_POOL = [
  '29942709', '35490407', '5202925', '1201996', '30366457',
  '3776903',  '5146493',  '4009409', '6977380', '31121857',
]
const INLINE_POOL = [
  '4777979',  '5202953', '31121857', '12956039', '5202917',
  '5202957',  '29942709', '1440727', '3912956',  '6953869',
]

// ── Helpers ────────────────────────────────────────────────────────────────

function pickImages(idx) {
  return {
    coverId:   COVER_POOL[idx % COVER_POOL.length],
    inline1Id: INLINE_POOL[idx % INLINE_POOL.length],
    inline2Id: INLINE_POOL[(idx + 4) % INLINE_POOL.length],
  }
}

function toSlug(keyword) {
  return keyword
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w֐-׿-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const file  = fs.createWriteStream(dest)
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        downloadFile(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
      file.on('error', reject)
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err) })
  })
}

async function downloadImage(photoId, filename, w, h) {
  const url = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`
  const dest = path.join(IMAGES_DIR, filename)
  console.log(`  ↓ ${filename} (Pexels ${photoId})`)
  await downloadFile(url, dest)
}

// ── Article generation via Claude API ─────────────────────────────────────

async function generateArticle(keyword, idx) {
  const client  = new Anthropic()
  const today   = new Date().toISOString().split('T')[0]
  const { coverId, inline1Id, inline2Id } = pickImages(idx)
  const slug    = toSlug(keyword)
  const coverPath  = `/images/posts/auto-${idx}-cover.jpg`
  const inline1    = `/images/posts/auto-${idx}-inline1.jpg`
  const inline2    = `/images/posts/auto-${idx}-inline2.jpg`

  const systemPrompt = `אתה כותב תוכן SEO מומחה לאתר IPTV ישראל (iptv.co.il).
כתוב אך ורק בעברית מקצועית ברמה גבוהה.
הפלט חייב להיות Markdown טהור בלבד – ללא הסברים, ללא \`\`\`markdown, ללא טקסט לפני/אחרי המאמר.
המחיר: ₪62 לחודש. ניסיון חינם: 3 שעות. WhatsApp: wa.me/212707711512`

  const userPrompt = `כתוב מאמר SEO מקצועי מלא על: "${keyword}"

השתמש בדיוק בפורמט הבא (החלף [...] בתוכן אמיתי):

---
title: "[כותרת SEO עד 65 תווים עם מילת המפתח ו-2026]"
slug: "${slug}"
excerpt: "[150 תווים, מילת המפתח, ערך ברור לקורא]"
date: "${today}"
category: "מדריכים"
author: "צוות IPTV ישראל"
coverImage: "${coverPath}"
coverAlt: "[תיאור תמונה עם מילת המפתח]"
---

## [כותרת H2 עם מילת המפתח – מה זה ולמה חשוב]

[3-4 משפטי פתיחה. הסבר את הנושא ותן ערך מיידי.]

![תיאור תמונה רלוונטי למאמר](${inline1})

---

## [H2 – יתרונות / מאפיינים מרכזיים]

[רשימה עשירה עם **bold** על נקודות מפתח. 4-5 פריטים לפחות.]

| תכונה | IPTV ישראל | HOT | יס | נטפליקס |
|-------|-----------|-----|-----|---------|
| ערוצים חיים | 21,000+ | ~200 | ~200 | אין |
| מחיר חודשי | ₪62 | ₪300+ | ₪280+ | ₪60-90 |
| [תכונה רלוונטית לנושא המאמר] | ✅ | ❌ | ❌ | ❌ |
| איכות 4K | ✅ | בתוספת | בתוספת | כן |

---

## [H2 – מדריך שלב אחר שלב הקשור ל-"${keyword}"]

[הוראות מפורטות עם מספור. לפחות 4 שלבים.]

![תיאור תמונה שנייה רלוונטית](${inline2})

---

## [H2 – טיפים מקצועיים / מידע נוסף חשוב]

[3-4 פסקאות עשירות עם קישורים חיצוניים רלוונטיים]

**קישורים חיצוניים שימושיים:**
- [Golden Gate IPTV](https://goldengateiptv.com/) – IPTV בינלאומי מוביל
- [Apollo Groups IPTV](https://www.apollogroupsiptv.com/) – ספק IPTV גלובלי
- [TiviMate](https://tivimate.net) – נגן IPTV מומלץ
- [VLC Player](https://www.videolan.org) – נגן חינמי למחשב

---

## שאלות נפוצות על ${keyword}

**Q: [שאלה ישירה הקשורה ל-${keyword}]?**
A: [תשובה מפורטת ב-2-3 משפטים.]

**Q: כמה עולה מנוי IPTV ישראל?**
A: המחיר מתחיל ב-₪62 לחודש בלבד, כולל 21,000 ערוצים ו-65,000 VOD באיכות 4K.

**Q: האם יש ניסיון חינם?**
A: כן! 3 שעות ניסיון חינם דרך WhatsApp – ללא התחייבות.

**Q: [שאלה נוספת הקשורה לנושא]?**
A: [תשובה מקצועית.]

**Q: על אילו מכשירים עובד IPTV ישראל?**
A: על כל מכשיר – טלוויזיה חכמה, Firestick, אנדרואיד, iPhone, מחשב, MAG Box ועוד.

---

## מדריכים קשורים

- **[IPTV ישראל – המדריך המלא](/iptv-israel)** – 21,000 ערוצים, השוואה מול HOT ויס, מחירים
- **[מדריך IPTV למתחילים](/iptv-guide-beginners)** – הגדרה ראשונה, בחירת נגן, טרובלשוטינג`

  console.log(`Calling Claude API for keyword: "${keyword}"...`)
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  let content = msg.content[0].text.trim()
  // Strip any accidental code fences
  content = content.replace(/^```(?:markdown)?\n?/i, '').replace(/\n?```$/i, '').trim()

  return { content, coverId, inline1Id, inline2Id, slug }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY is not set')
    process.exit(1)
  }

  // Load keywords
  const kw = JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf-8'))
  const { nextIndex, keywords, published = [] } = kw

  if (nextIndex >= keywords.length) {
    console.log('✅ All keywords have been published! No more to process.')
    process.exit(0)
  }

  const keyword = keywords[nextIndex]
  console.log(`\n🚀 Generating article [${nextIndex + 1}/${keywords.length}]: "${keyword}"`)

  // Generate article content
  const { content, coverId, inline1Id, inline2Id, slug } =
    await generateArticle(keyword, nextIndex)

  // Extract title from frontmatter for the published record
  const titleMatch = content.match(/^title:\s*"([^"]+)"/m)
  const title = titleMatch ? titleMatch[1] : keyword

  // Download images
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
  console.log('Downloading images...')
  await downloadImage(coverId,   `auto-${nextIndex}-cover.jpg`,   1200, 630)
  await downloadImage(inline1Id, `auto-${nextIndex}-inline1.jpg`, 1200, 500)
  await downloadImage(inline2Id, `auto-${nextIndex}-inline2.jpg`, 1200, 500)

  // Save article file
  const filename = `${slug}.md`
  fs.mkdirSync(POSTS_DIR, { recursive: true })
  fs.writeFileSync(path.join(POSTS_DIR, filename), content, 'utf-8')
  console.log(`✅ Article saved: content/posts/${filename}`)

  // Update keywords.json
  kw.nextIndex = nextIndex + 1
  kw.published = [...published, {
    index: nextIndex,
    keyword,
    slug,
    title,
    date: new Date().toISOString().split('T')[0],
  }]
  fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(kw, null, 2) + '\n', 'utf-8')
  console.log(`✅ keywords.json updated → nextIndex: ${kw.nextIndex}`)
  console.log(`\n🎉 Done! Article published at: /${slug}`)
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
