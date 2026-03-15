import Link from "next/link"
import { waTrial, waContact } from "@/lib/whatsapp"

export default function Footer() {
  return (
    <footer className="border-t border-border/30 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">IPTV</span> <span className="text-green-500">ישראל</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              IPTV ישראל הוא שירות מנויי ה-IPTV המוביל בישראל לשנת 2026.
              צפו במעל 20,000 ערוצים בשידור חי ו-65,000 סרטים וסדרות
              באיכות 4K UHD מכל מכשיר. הספק הטוב ביותר עם
              טכנולוגיה למניעת תקיעות וזמינות של 99.9%.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              קישורים מהירים
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "דף הבית", href: "#home" },
                { label: "מחירון חבילות IPTV", href: "#pricing" },
                { label: "תוכנית שותפים", href: "#reseller" },
                { label: "צור קשר", href: waContact },
                { label: "ניסיון IPTV חינם", href: waTrial() },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Devices */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              מכשירים נתמכים
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                "טלוויזיה חכמה (Samsung, LG)",
                "Amazon Firestick",
                "Android TV / MAG Box",
                "Apple TV / מכשירי iOS",
                "מחשב אישי (PC / Mac)",
              ].map((device) => (
                <li
                  key={device}
                  className="text-sm text-muted-foreground"
                >
                  {device}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              משפטי
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'תנאים והגבלות', href: '/terms' },
                { label: 'מדיניות ביטול והחזר', href: '/refund-policy' },
                { label: 'מדיניות פרטיות', href: '/privacy-policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              יצירת קשר עם IPTV ישראל
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href={waContact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  WhatsApp: +212 707 711 512
                </Link>
              </li>
              <li className="text-sm text-muted-foreground">
                תמיכת לקוחות IPTV פועלת 24/7
              </li>
              <li className="text-sm text-muted-foreground">
                החזר כספי מובטח עד 7 ימים
              </li>
              <li className="text-sm text-muted-foreground">
                הפעלת מנוי מיידית
              </li>
            </ul>
          </div>
        </div>

        {/* SEO-rich footer text */}
        <div className="mt-10 border-t border-border/30 pt-6">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {"\u00A9"} {new Date().getFullYear()} IPTV ישראל - שירות מנויי ה-IPTV פרימיום הטוב ביותר בישראל. כל הזכויות שמורות. IPTV ישראל מספקת את חוויית הצפייה האיכותית ביותר בטלוויזיה עם למעלה מ-20,000 ערוצים בשידור חי, 65,000 סרטים וסדרות, קומולציית 4K UHD, וטכנולוגיית מניעת תקיעות. תמיכה בטלוויזיות חכמות, Android, iOS ו-MAG Box. השירות אינו מזוהה עם פלטפורמות סטרימינג צד-שלישי.
          </p>
        </div>
      </div>
    </footer>
  )
}
