import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'IPTV ישראל – 21,000 ערוצים באיכות 4K UHD'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B0F13',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{
            width: '80px', height: '80px', background: '#10B981',
            borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 0, height: 0,
              borderTop: '20px solid transparent',
              borderBottom: '20px solid transparent',
              borderLeft: '34px solid #0B0F13',
              marginLeft: '8px',
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <span style={{ color: '#FFFFFF', fontSize: '60px', fontWeight: '900', lineHeight: '1' }}>IPTV</span>
            <span style={{ color: '#10B981', fontSize: '60px', fontWeight: '900', lineHeight: '1' }}>ישראל</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ color: '#F8FAFC', fontSize: '36px', fontWeight: '700', marginBottom: '32px' }}>
          שירות ה-IPTV המוביל בישראל
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '60px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#10B981', fontSize: '32px', fontWeight: '900' }}>21,000+</span>
            <span style={{ color: '#94A3B8', fontSize: '18px' }}>ערוצים חיים</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#10B981', fontSize: '32px', fontWeight: '900' }}>4K UHD</span>
            <span style={{ color: '#94A3B8', fontSize: '18px' }}>איכות שידור</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#10B981', fontSize: '32px', fontWeight: '900' }}>₪62</span>
            <span style={{ color: '#94A3B8', fontSize: '18px' }}>לחודש בלבד</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: '#10B981', color: '#0B0F13',
          padding: '14px 40px', borderRadius: '50px',
          fontSize: '22px', fontWeight: '800',
        }}>
          ניסיון חינם 3 שעות — iptv.co.il
        </div>
      </div>
    ),
    { ...size },
  )
}
