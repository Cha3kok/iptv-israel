import { Shield, Star, Crown, Zap, MonitorPlay } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  durationMonths: number;
  iconName: string; // We'll map this to actual icons in the component
  popular: boolean;
  features: string[];
}

export interface SiteSettings {
  supportPhone: string;
  supportWhatsAppUrl: string;
}

// Mock Database service for Antigravity DB
export class AntigravityDB {
  static async getPlans(): Promise<PricingPlan[]> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const standardFeatures = [
      "מעל 21,000 ערוצים בשידור חי (מקומי ובינלאומי)",
      "מעל 65,000 סרטים וסדרות VOD (עדכונים יומיים)",
      "איכות סטרימינג 4K / UHD / FHD",
      "כל ערוצי הספורט במנוי פרימיום ואירועי PPV",
      "טכנולוגיית מניעת תקיעות ושידור חלק מבאפרים",
      "תמיכת לקוחות פריורית 24/7",
      "מדריך שידורים מלא (EPG)",
      "תואם לכל המכשירים (טלוויזיה חכמה, Android, iOS, Mag, Firestick)"
    ];

    return [
      {
        id: "plan-1m",
        name: "1 חודש",
        subtitle: "חיבור למכשיר אחד",
        price: "62",
        durationMonths: 1,
        iconName: "MonitorPlay",
        popular: false,
        features: [
          "הכי מומלץ לבדיקת השירות",
          ...standardFeatures
        ],
      },
      {
        id: "plan-3m",
        name: "3 חודשים",
        subtitle: "חיבור למכשיר אחד",
        price: "124",
        durationMonths: 3,
        iconName: "Zap",
        popular: false,
        features: [
          "בחירה חכמה - חסוך 25%",
          ...standardFeatures
        ],
      },
      {
        id: "plan-6m",
        name: "6 חודשים",
        subtitle: "חיבור למכשיר אחד",
        price: "152",
        durationMonths: 6,
        iconName: "Shield",
        popular: false,
        features: [
          "תמורה מצוינת - חסוך 37%",
          "כולל 7 ימי שחזור תכנים (Catch-Up)",
          ...standardFeatures
        ],
      },
      {
        id: "plan-12m",
        name: "12 חודשים",
        subtitle: "חיבור למכשיר אחד",
        price: "240",
        durationMonths: 12,
        iconName: "Star",
        popular: true,
        features: [
          "הכי פופולרי - חסוך 53%",
          "הפעלה מיידית",
          ...standardFeatures
        ],
      },
      {
        id: "plan-24m",
        name: "24 חודשים",
        subtitle: "חיבור למכשיר אחד",
        price: "432",
        durationMonths: 24,
        iconName: "Crown",
        popular: false,
        features: [
          "התוכנית האולטימטיבית - המחיר הטוב ביותר",
          "אחריות לאפס תקלות בשידור",
          "תמיכת VIP",
          ...standardFeatures
        ],
      },
    ];
  }

  static async getSettings(): Promise<SiteSettings> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Use the requested updated phone number globally
    const phone = "+212707711512";
    
    return {
      supportPhone: "+212 707 711 512",
      supportWhatsAppUrl: `https://wa.me/${phone}`,
    };
  }
}
