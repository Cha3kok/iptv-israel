const PHONE = '212707711512'
const BASE = `https://wa.me/${PHONE}`

// Duration label map (Hebrew plan name → English)
const durationMap: Record<string, string> = {
  '1 חודש':    '1 Month',
  '3 חודשים':  '3 Months',
  '6 חודשים':  '6 Months',
  '12 חודשים': '12 Months',
  '24 חודשים': '24 Months',
}

/** "קנה עכשיו" on a specific pricing plan */
export function waBuyPlan(planName: string, price: string) {
  const duration = durationMap[planName] ?? planName
  const msg = `iptv.co.il - ${duration} / 1 Device - ${price} USD`
  return `${BASE}?text=${encodeURIComponent(msg)}`
}

/** Generic "קנה עכשיו" with no specific plan (hero, navbar) */
export function waBuy() {
  const msg = 'iptv.co.il - I want to subscribe'
  return `${BASE}?text=${encodeURIComponent(msg)}`
}

/** Free-trial buttons */
export function waTrial() {
  const msg = 'iptv.co.il - i want to try 3 hours trial'
  return `${BASE}?text=${encodeURIComponent(msg)}`
}

/** Generic contact (no pre-filled message) */
export const waContact = BASE
