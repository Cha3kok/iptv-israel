"use client"

import { motion } from "framer-motion"
import { Play, Zap } from "lucide-react"
import Link from "next/link"
import { waBuy, waTrial } from "@/lib/whatsapp"

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16"
    >
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
        >
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            שירות ה-IPTV המוביל לשנת 2026 - סטרימינג 4K ללא תקיעות
          </span>
        </motion.div>

        {/* Headline - H1 with primary keyword */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          IPTV ישראל: חוויית צפייה{" "}
          <span className="text-primary">המתקדמת ביותר</span>
          <br />
          <span className="text-muted-foreground">עם גישה ליותר מ-21,000 ערוצים ב-4K</span>
        </motion.h1>

        {/* Sub-headline with LSI keywords */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
        >
          IPTV ישראל הוא ספק ה-IPTV האיכותי והמתקדם בישראל לסטרימינג של ערוצי טלוויזיה, ספורט וסרטים. 
          תיהנו מצפייה חלקה ויציבה, ללא בּאפרים (No Buffering), עם איכות תמונה ב-4K וזמינות של 99.9%.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={waBuy()}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-glow flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            <Zap className="h-5 w-5" />
            קנה עכשיו
          </Link>

          <Link
            href={waTrial()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            <Play className="h-5 w-5" />
            ניסיון חינם
          </Link>
        </motion.div>

        {/* Supported devices - SEO friendly labels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          {[
            "Smart TV IPTV",
            "Firestick IPTV",
            "Android IPTV",
            "iOS IPTV",
            "MAG Box IPTV",
            "PC IPTV",
          ].map((device) => (
            <span
              key={device}
              className="flex items-center gap-2 rounded-full border border-border/50 px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-primary/60" />
              {device}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
