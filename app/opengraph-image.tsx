import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'IPTV ישראל – 21,000 ערוצים באיכות 4K UHD | ₪62 לחודש'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0B0F13 0%, #0d1f1a 50%, #0B0F13 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Glow circle */}
        <div style={{
          position: 'absolute',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72,
            background: '#10B981',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 0, height: 0,
              borderTop: '18px solid transparent',
              borderBottom: '18px solid transparent',
              borderLeft: '30px solid #0B0F13',
              marginLeft: 6,
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#FFFFFF', fontSize: 52, fontWeight: 900, lineHeight: 1 }}>IPTV</span>
            <span style={{ color: '#10B981', fontSize: 52, fontWeight: 900, lineHeight: 1 }}>ישראל</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{
          color: '#F8FAFC',
          fontSize: 38,
          fontWeight: 800,
          textAlign: 'center',
          maxWidth: 900,
          lineHeight: 1.3,
          marginBottom: 24,
        }}>
          שירות ה-IPTV המוביל בישראל
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 48, marginBottom: 40 }}>
          {[
            { num: '21,000+', label: 'ערוצים חיים' },
            { num: '65,000+', label: 'סרטים & סדרות' },
            { num: '4K UHD',  label: 'איכות שידור' },
            { num: '₪62',     label: 'לחודש בלבד' },
          ].map(({ num, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#10B981', fontSize: 30, fontWeight: 900 }}>{num}</span>
              <span style={{ color: '#94A3B8', fontSize: 16, marginTop: 4 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA badge */}
        <div style={{
          background: '#10B981',
          color: '#0B0F13',
          padding: '12px 32px',
          borderRadius: 50,
          fontSize: 20,
          fontWeight: 800,
        }}>
          ניסיון חינם 3 שעות ← iptv.co.il
        </div>
      </div>
    ),
    { ...size },
  )
}
