import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ArrowRight } from 'lucide-react'
import { waContact } from '@/lib/whatsapp'

interface Section {
  title: string
  content: string | string[]
}

interface Props {
  title: string
  lastUpdated: string
  intro: string
  sections: Section[]
}

export default function LegalLayout({ title, lastUpdated, intro, sections }: Props) {
  return (
    <div className="min-h-screen bg-[#0B0F13] text-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        {/* Header */}
        <div className="mb-10 border-b border-[#1E293B] pb-8">
          <span className="mb-4 inline-block rounded-full border border-[#30363D] bg-[#151B23] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#10B981]">
            משפטי
          </span>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-[#94A3B8]">עודכן לאחרונה: {lastUpdated}</p>
          <p className="mt-4 leading-relaxed text-[#94A3B8]">{intro}</p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="mb-3 flex items-center gap-3 text-xl font-bold text-[#F8FAFC]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-xs font-bold text-[#10B981]">
                  {i + 1}
                </span>
                {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="space-y-2 text-[#94A3B8]">
                  {section.content.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="leading-relaxed text-[#94A3B8]">{section.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact note */}
        <div className="mt-14 rounded-2xl border border-[#1E293B] bg-[#151B23] p-6 text-sm text-[#94A3B8]">
          יש לך שאלות בנוגע למדיניות זו? צור איתנו קשר דרך{' '}
          <Link
            href={waContact}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#10B981] underline underline-offset-2 hover:opacity-80"
          >
            WhatsApp
          </Link>{' '}
          — צוות התמיכה שלנו זמין 24/7.
        </div>

        {/* Back */}
        <div className="mt-8 border-t border-[#1E293B] pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] transition-colors hover:text-[#10B981]"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
