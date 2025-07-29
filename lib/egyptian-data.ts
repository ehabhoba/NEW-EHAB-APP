// بيانات خاصة بالسوق المصري
export const EGYPTIAN_PHONE_PREFIXES = [
  "+20 10", // فودافون
  "+20 11", // اتصالات
  "+20 12", // أورانج
  "+20 15", // WE
]

export const EGYPTIAN_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
  "البحر الأحمر",
]

export const EGYPTIAN_BUSINESS_CATEGORIES = {
  "مطاعم وكافيهات": {
    keywords: ["طعام", "مطعم", "كافيه", "وجبات", "توصيل"],
    avgBudget: { min: 500, max: 5000 },
    platforms: ["facebook", "instagram", "google"],
  },
  "ملابس وأزياء": {
    keywords: ["ملابس", "أزياء", "موضة", "فساتين", "قمصان"],
    avgBudget: { min: 300, max: 3000 },
    platforms: ["instagram", "facebook", "tiktok"],
  },
  "إلكترونيات وجوالات": {
    keywords: ["جوال", "لابتوب", "إلكترونيات", "تكنولوجيا"],
    avgBudget: { min: 1000, max: 10000 },
    platforms: ["facebook", "google", "youtube"],
  },
  "عقارات واستثمار": {
    keywords: ["شقة", "فيلا", "عقار", "استثمار", "بيع", "إيجار"],
    avgBudget: { min: 2000, max: 20000 },
    platforms: ["facebook", "google", "linkedin"],
  },
  "سيارات ومعارض": {
    keywords: ["سيارة", "معرض", "أوتوموبيل", "قطع غيار"],
    avgBudget: { min: 1500, max: 15000 },
    platforms: ["facebook", "google", "youtube"],
  },
}

export const EGYPTIAN_HOLIDAYS_2024 = [
  { name: "رأس السنة الميلادية", date: "2024-01-01" },
  { name: "عيد الشرطة", date: "2024-01-25" },
  { name: "شم النسيم", date: "2024-05-06" },
  { name: "عيد العمال", date: "2024-05-01" },
  { name: "عيد الفطر", date: "2024-04-10" },
  { name: "عيد الأضحى", date: "2024-06-16" },
  { name: "رأس السنة الهجرية", date: "2024-07-07" },
  { name: "المولد النبوي", date: "2024-09-15" },
  { name: "ثورة 23 يوليو", date: "2024-07-23" },
  { name: "ثورة 30 يونيو", date: "2024-06-30" },
]

export const EGYPTIAN_MARKET_INSIGHTS = {
  peakHours: {
    weekdays: ["19:00-23:00"], // من 7 إلى 11 مساءً
    weekends: ["14:00-17:00", "20:00-24:00"], // من 2-5 عصراً و 8-12 مساءً
    ramadan: ["21:00-02:00"], // بعد الإفطار حتى السحور
  },
  popularPlatforms: {
    facebook: 85, // الأكثر استخداماً
    youtube: 75,
    instagram: 65,
    tiktok: 45,
    twitter: 25,
    linkedin: 15,
  },
  ageGroups: {
    "18-24": 30,
    "25-34": 35,
    "35-44": 20,
    "45-54": 10,
    "55+": 5,
  },
  deviceUsage: {
    mobile: 85,
    desktop: 12,
    tablet: 3,
  },
}

// دالة لتوليد رقم هاتف مصري صحيح
export function generateEgyptianPhone(): string {
  const prefixes = EGYPTIAN_PHONE_PREFIXES
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const number = Math.floor(Math.random() * 90000000) + 10000000 // 8 أرقام
  return `${prefix} ${number.toString().substring(0, 4)} ${number.toString().substring(4)}`
}

// دالة لتنسيق العملة المصرية
export function formatEgyptianCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// دالة للتحقق من صحة رقم الهاتف المصري
export function validateEgyptianPhone(phone: string): boolean {
  const egyptianPhoneRegex = /^(\+20|0020|20)?(1[0125])[0-9]{8}$/
  return egyptianPhoneRegex.test(phone.replace(/\s/g, ""))
}
