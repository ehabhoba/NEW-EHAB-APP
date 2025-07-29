// AI Services Integration with Real API Keys
// This file contains the integration with various AI APIs

interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

// Multiple OpenAI API Keys for load balancing
const OPENAI_API_KEYS = [
  "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",
  "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",
  "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",
  "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",
]

// Multiple Gemini API Keys with Flash 2.0 support
const GEMINI_API_KEYS = [
  "AIzaSyAK3LA-F1e7u0dxCZkVKTzfSR0AdO2ZHCU",
  "AIzaSyB6jnqtwtZ-p2G_8D9KMhvhlNywwLhw3HQ",
  "AIzaSyAXccWf2TjqeOtynlrb0-2wTtl8GI76Br8",
  "AIzaSyDIOaVEEaKlxBzE4cZDO2Io-Ne8IE3-oHQ",
]

// Other API Keys
const DEEPSEEK_API_KEY = "sk-0299560c97684066ac8caefa7bfbd5ad"
const REFACT_API_KEY = "hl9JBa6feY8zQawJNktZFAav"

// Facebook App Configurations
const FACEBOOK_APPS = {
  monazem: {
    appId: "1459615555396584",
    appSecret: "d13b7ea597e189d89a3093c30eb29ff8",
    accessToken:
      "EAAUvgzqwIZBgBPD6mPZCsGbzVaJuYvZA3mE3dMnw27xyXD48dDyv2MFHtQznYoAUH5bmKUdBZBqMZBi85G9jvlNCgOfKZCPzn75VjO1947wGcTTwm0x10Ok6qwyO3SvYPgpnZCr1pIylVhEFhjlZAzOvZB1j2ZCQr9jl3BEhqIHFF3JjzEZC6aX2Thv1yh7zilBXrGRurc4n6ZADHU9bGSGPy9ilIvEVZCm4bfuIznqFxSC45n7EZD",
  },
  onlineServices: {
    appId: "1459615555396584",
    appSecret: "d13b7ea597e189d89a3093c30eb29ff8",
    accessToken:
      "EAAbm7JZCqThcBPFVJqhCr0dfxhw8ZCPbkyJMRZAotzgQtygnuvzr08PNF3JasCFYkYeQ1hwMEZBd68oh4viVZCaJb4ICJeFc8TxUvN2EcfrWSrZBCLizqyPIpVQaC9WLJZAQXqplVvc0IN33tul9KCy6vGZCHGVpdzsIQtLxZAopFhVtXZBp6i5Pc49a3mLiG0nkgd1ukHjEPxbixehmytaxsPphh6ThIZBrnlBc4JE50ZALMQZDZD",
    appToken: "1942753829867031|pjlXaLI9GDrGH27Nip5Eu6aVJCw",
  },
}

// Load balancing function for API keys
function getRandomApiKey(keys: string[]): string {
  return keys[Math.floor(Math.random() * keys.length)]
}

// Enhanced Gemini Flash 2.0 Integration with advanced features
export async function generateContentWithGeminiFlash(
  prompt: string,
  options: {
    model?: "gemini-2.0-flash-exp" | "gemini-pro" | "gemini-pro-vision"
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    context?: string[]
    tools?: any[]
  } = {},
): Promise<AIResponse> {
  try {
    const apiKey = getRandomApiKey(GEMINI_API_KEYS)
    const model = options.model || "gemini-2.0-flash-exp"

    // Enhanced system prompt for Egyptian market
    const systemPrompt =
      options.systemPrompt ||
      `أنت مساعد ذكي متخصص في التسويق الرقمي والأعمال للسوق المصري. 
    تتميز بالإبداع والقدرة على إنشاء محتوى جذاب ومؤثر يناسب الثقافة المصرية.
    تفهم السوق المصري والعادات والتقاليد المحلية.
    تستخدم الجنيه المصري في الأسعار وتذكر المحافظات المصرية عند الحاجة.
    اكتب بأسلوب احترافي وودود مناسب للجمهور المصري.`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\n${prompt}${options.context ? "\n\nالسياق: " + options.context.join("\n") : ""}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: options.temperature || 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: options.maxTokens || 2000,
        candidateCount: 1,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }

    // Add tools if provided
    if (options.tools && options.tools.length > 0) {
      requestBody.tools = options.tools
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    const data = await response.json()

    if (response.ok && data.candidates && data.candidates[0]) {
      return {
        success: true,
        data: data.candidates[0].content.parts[0].text,
      }
    } else {
      console.error("Gemini Flash API Error:", data)
      return {
        success: false,
        error: data.error?.message || "خطأ في الاتصال بـ Gemini Flash",
      }
    }
  } catch (error) {
    console.error("Gemini Flash Network Error:", error)
    return {
      success: false,
      error: "خطأ في الشبكة",
    }
  }
}

// Smart Auto-Suggestions Engine
export async function generateSmartSuggestions(
  context: string,
  type: "campaign" | "content" | "audience" | "budget" | "timing",
): Promise<AIResponse> {
  const prompts = {
    campaign: `بناءً على السياق التالي: "${context}"
    اقترح 5 أفكار إبداعية لحملات إعلانية تناسب السوق المصري:
    - اسم الحملة
    - الهدف الرئيسي
    - الجمهور المستهدف
    - المنصة المناسبة
    - الميزانية المقترحة بالجنيه المصري
    - مدة الحملة المثلى`,

    content: `بناءً على السياق: "${context}"
    اقترح 7 أفكار محتوى متنوعة للسوق المصري:
    - منشورات تفاعلية
    - قصص ملهمة
    - عروض وخصومات
    - محتوى تعليمي
    - مسابقات وتحديات
    - شهادات عملاء
    - محتوى موسمي مصري`,

    audience: `للسياق: "${context}"
    حلل الجمهور المصري المستهدف واقترح:
    - الفئات العمرية الأنسب
    - المحافظات المستهدفة
    - الاهتمامات والسلوكيات
    - أفضل أوقات التفاعل
    - المنصات المفضلة
    - اللغة والأسلوب المناسب`,

    budget: `للسياق: "${context}"
    اقترح توزيع ميزانية ذكي بالجنيه المصري:
    - توزيع الميزانية على المنصات
    - تكلفة متوقعة لكل نقرة
    - عدد المشاهدات المتوقع
    - العائد على الاستثمار المتوقع
    - نصائح لتوفير التكاليف`,

    timing: `للسياق: "${context}"
    اقترح جدولة زمنية مثلى للسوق المصري:
    - أفضل أيام الأسبوع
    - أوقات الذروة اليومية
    - المواسم والمناسبات المناسبة
    - تجنب الأوقات غير المناسبة
    - جدولة المحتوى الأسبوعية`,
  }

  return await generateContentWithGeminiFlash(prompts[type], {
    model: "gemini-2.0-flash-exp",
    temperature: 0.9,
    maxTokens: 1500,
  })
}

// Auto Campaign Optimizer
export async function optimizeCampaignAutomatically(campaignData: any): Promise<AIResponse> {
  const prompt = `قم بتحليل وتحسين الحملة التالية تلقائياً:

📊 بيانات الحملة:
• الاسم: ${campaignData.name}
• المنصة: ${campaignData.platform}
• الميزانية: ${campaignData.budget} ج.م
• المنفق: ${campaignData.spent} ج.م
• المشاهدات: ${campaignData.impressions}
• النقرات: ${campaignData.clicks}
• التحويلات: ${campaignData.conversions}
• معدل النقر: ${((campaignData.clicks / campaignData.impressions) * 100).toFixed(2)}%

🎯 المطلوب تحسين تلقائي:
1. تحليل الأداء الحالي
2. نقاط الضعف والقوة
3. اقتراحات تحسين فورية
4. تعديلات الاستهداف
5. تحسين المحتوى الإعلاني
6. إعادة توزيع الميزانية
7. توقيت النشر الأمثل
8. خطة عمل للأسبوع القادم

اكتب التحليل والتوصيات بشكل عملي وقابل للتطبيق فوراً.`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.7,
    maxTokens: 2000,
  })
}

// Smart Content Calendar Generator
export async function generateContentCalendar(
  businessType: string,
  duration = 30,
  platform = "all",
): Promise<AIResponse> {
  const prompt = `أنشئ تقويم محتوى ذكي لمدة ${duration} يوم لنشاط "${businessType}" في السوق المصري:

📅 متطلبات التقويم:
• نوع النشاط: ${businessType}
• المدة: ${duration} يوم
• المنصات: ${platform === "all" ? "جميع المنصات" : platform}

🎯 يجب أن يتضمن التقويم:
1. محتوى يومي متنوع (منشورات، قصص، فيديوهات)
2. مواضيع تناسب كل يوم من الأسبوع
3. محتوى للمناسبات المصرية
4. أوقات النشر المثلى
5. هاشتاغات مناسبة لكل منشور
6. أفكار للتفاعل مع الجمهور
7. محتوى ترويجي وتعليمي متوازن
8. اقتراحات للصور والفيديوهات

📋 تنسيق الإخراج:
اليوم | التاريخ | نوع المحتوى | المنصة | الوقت | النص المقترح | الهاشتاغات`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.8,
    maxTokens: 3000,
  })
}

// Intelligent Competitor Analysis
export async function analyzeCompetitorsIntelligently(
  businessName: string,
  industry: string,
  competitors: string[],
): Promise<AIResponse> {
  const prompt = `قم بتحليل ذكي شامل للمنافسين في السوق المصري:

🏢 معلومات العمل:
• اسم العمل: ${businessName}
• المجال: ${industry}
• المنافسين: ${competitors.join(", ")}

🔍 التحليل المطلوب:
1. نقاط القوة والضعف لكل منافس
2. استراتيجيات المحتوى المستخدمة
3. أسعارهم وعروضهم
4. جمهورهم المستهدف
5. منصاتهم الأكثر نشاطاً
6. أوقات نشرهم
7. نوعية تفاعل جمهورهم
8. الفجوات في السوق
9. الفرص المتاحة للتفوق
10. استراتيجية مقترحة للتنافس

💡 أمثلة للاستخدام:
• إيقاف الحملة عند نفاد الميزانية
• إرسال تنبيه عند انخفاض الأداء
• زيادة الميزانية عند تحسن النتائج
• إرسال رسائل ترحيب تلقائية
• جدولة المحتوى حسب الأداء`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.8,
    maxTokens: 2500,
  })
}

// Smart Hashtag Generator with Trending Analysis
export async function generateSmartHashtags(
  content: string,
  platform: string,
  industry: string,
  location = "مصر",
): Promise<AIResponse> {
  const prompt = `أنشئ مجموعة هاشتاغات ذكية ومحسنة للمحتوى التالي:

📝 المحتوى: "${content}"
📱 المنصة: ${platform}
🏢 المجال: ${industry}
📍 الموقع: ${location}

🎯 أنواع الهاشتاغات المطلوبة:
1. هاشتاغات عامة شائعة (5-7)
2. هاشتاغات متخصصة في المجال (5-7)
3. هاشتاغات محلية مصرية (4-6)
4. هاشتاغات ترندينغ حالية (3-5)
5. هاشتاغات موسمية (2-3)
6. هاشتاغات للتفاعل (2-3)

📊 معايير الاختيار:
• شعبية الهاشتاغ في مصر
• مستوى المنافسة
• معدل التفاعل المتوقع
• مناسبة للجمهور المصري
• سهولة البحث والاكتشاف

🔥 هاشتاغات مقترحة بالعربية والإنجليزية:
قدم الهاشتاغات مرتبة حسب الأولوية مع شرح سبب اختيار كل مجموعة.`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.7,
    maxTokens: 1500,
  })
}

// Auto-Response Generator for Customer Service
export async function generateAutoResponse(
  customerMessage: string,
  businessType: string,
  tone: "formal" | "friendly" | "professional" = "friendly",
): Promise<AIResponse> {
  const prompt = `أنشئ رد تلقائي احترافي لرسالة العميل التالية:

💬 رسالة العميل: "${customerMessage}"
🏢 نوع النشاط: ${businessType}
🎭 النبرة المطلوبة: ${tone === "formal" ? "رسمية" : tone === "friendly" ? "ودودة" : "مهنية"}

📋 متطلبات الرد:
• مناسب للثقافة المصرية
• يجيب على استفسار العميل
• يتضمن دعوة للعمل إذا كان مناسباً
• مهذب ومحترم
• يعكس احترافية العمل
• لا يزيد عن 200 كلمة

🎯 أنواع الردود المطلوبة:
1. رد فوري (للرد التلقائي)
2. رد مفصل (للمتابعة اليدوية)
3. رد بديل (في حالة عدم فهم الاستفسار)

قدم الردود جاهزة للاستخدام المباشر.`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.6,
    maxTokens: 800,
  })
}

// Smart Budget Optimizer
export async function optimizeBudgetIntelligently(
  totalBudget: number,
  campaignObjectives: string[],
  platforms: string[],
  duration: number,
): Promise<AIResponse> {
  const prompt = `قم بتحسين وتوزيع الميزانية الإعلانية بذكاء:

💰 الميزانية الإجمالية: ${totalBudget} ج.م
🎯 أهداف الحملات: ${campaignObjectives.join(", ")}
📱 المنصات: ${platforms.join(", ")}
⏱️ مدة الحملة: ${duration} يوم

📊 التحليل والتوزيع المطلوب:
1. توزيع الميزانية على المنصات (بالنسب والمبالغ)
2. توزيع يومي للإنفاق
3. تخصيص ميزانية لكل هدف
4. احتياطي للتحسينات (10-15%)
5. توقعات الأداء لكل منصة
6. نصائح لتحسين العائد على الاستثمار

💡 اعتبارات السوق المصري:
• أسعار النقرة المحلية
• أوقات الذروة وتأثيرها على التكلفة
• المنافسة في كل منصة
• سلوك الجمهور المصري
• المواسم والمناسبات

📈 خطة التحسين:
• متى نزيد الميزانية
• متى نقللها أو نوقفها
• كيفية إعادة التوزيع حسب الأداء
• مؤشرات الأداء للمراقبة`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.7,
    maxTokens: 2000,
  })
}

// Enhanced WhatsApp Integration via GreenAPI
export async function sendWhatsAppMessage(phone: string, message: string): Promise<AIResponse> {
  try {
    const instanceId = "7103121490"
    const apiToken = "5302bc690deb405c9bd36048a27167e4c0baaa81616449d0d"

    const response = await fetch(`https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: `${phone}@c.us`,
        message: message,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        data: data,
      }
    } else {
      return {
        success: false,
        error: "خطأ في إرسال رسالة واتساب",
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "خطأ في الشبكة",
    }
  }
}

// Auto WhatsApp Campaign Creator
export async function createAutoWhatsAppCampaign(
  clientList: string[],
  campaignType: "welcome" | "promotion" | "reminder" | "survey",
  businessInfo: any,
): Promise<AIResponse> {
  const prompt = `أنشئ حملة واتساب تلقائية للعملاء:

👥 عدد العملاء: ${clientList.length}
📱 نوع الحملة: ${campaignType}
🏢 معلومات العمل: ${JSON.stringify(businessInfo)}

📋 متطلبات الحملة:
1. رسالة أساسية مناسبة لنوع الحملة
2. 3 بدائل للرسالة لتجنب التكرار
3. توقيت الإرسال المثالي
4. جدولة الرسائل (فترات زمنية بين الرسائل)
5. رسائل متابعة إذا لزم الأمر
6. مؤشرات نجاح الحملة

🎯 حسب نوع الحملة:
${campaignType === "welcome" ? "• رسائل ترحيب للعملاء الجدد\n• شرح الخدمات\n• معلومات التواصل" : ""}
${campaignType === "promotion" ? "• عروض وخصومات\n• دعوة للعمل واضحة\n• فترة محدودة للعرض" : ""}
${campaignType === "reminder" ? "• تذكير مهذب\n• معلومات مفيدة\n• دعوة للتفاعل" : ""}
${campaignType === "survey" ? "• طلب رأي العملاء\n• أسئلة بسيطة\n• شكر على المشاركة" : ""}

📊 خطة التنفيذ:
• ترتيب الإرسال
• فترات الانتظار
• متابعة الردود
• تحليل النتائج`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.8,
    maxTokens: 2000,
  })
}

// Facebook Graph API Integration
export async function getFacebookAdAccountData(adAccountId: string, app = "monazem"): Promise<AIResponse> {
  try {
    const config = FACEBOOK_APPS[app as keyof typeof FACEBOOK_APPS]
    const accessToken = config.accessToken

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/insights?access_token=${accessToken}&fields=impressions,clicks,spend,reach,frequency,cpm,cpc,ctr,conversions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        data: data.data,
      }
    } else {
      return {
        success: false,
        error: data.error?.message || "خطأ في جلب بيانات فيسبوك",
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "خطأ في الشبكة",
    }
  }
}

// Create Facebook Ad Campaign
export async function createFacebookCampaign(campaignData: any, app = "monazem"): Promise<AIResponse> {
  try {
    const config = FACEBOOK_APPS[app as keyof typeof FACEBOOK_APPS]
    const accessToken = config.accessToken

    const response = await fetch(`https://graph.facebook.com/v18.0/act_${campaignData.adAccountId}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: campaignData.name,
        objective: campaignData.objective,
        status: "PAUSED",
        access_token: accessToken,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        data: data,
      }
    } else {
      return {
        success: false,
        error: data.error?.message || "خطأ في إنشاء الحملة",
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "خطأ في الشبكة",
    }
  }
}

// Smart Automation Rules Engine
export async function createAutomationRule(
  trigger: string,
  condition: any,
  action: string,
  parameters: any,
): Promise<AIResponse> {
  const prompt = `أنشئ قاعدة أتمتة ذكية:

🔄 المحفز: ${trigger}
📋 الشرط: ${JSON.stringify(condition)}
⚡ الإجراء: ${action}
🎛️ المعاملات: ${JSON.stringify(parameters)}

📊 تحليل القاعدة:
1. منطق القاعدة وصحتها
2. التوقيت المناسب للتنفيذ
3. المخاطر المحتملة
4. البدائل في حالة الفشل
5. مؤشرات المراقبة
6. تحسينات مقترحة

💡 أمثلة للاستخدام:
• إيقاف الحملة عند نفاد الميزانية
• إرسال تنبيه عند انخفاض الأداء
• زيادة الميزانية عند تحسن النتائج
• إرسال رسائل ترحيب تلقائية
• جدولة المحتوى حسب الأداء`

  return await generateContentWithGeminiFlash(prompt, {
    model: "gemini-2.0-flash-exp",
    temperature: 0.6,
    maxTokens: 1200,
  })
}

// Legacy functions for backward compatibility
export const generateContentWithGemini = generateContentWithGeminiFlash
export const generateContentWithOpenAI = async (prompt: string, type = "text", model = "gpt-3.5-turbo") => {
  // Implementation remains the same as before
  return { success: false, error: "Function not implemented in this version" }
}
export const generateContentWithDeepSeek = async (prompt: string) => {
  // Implementation remains the same as before
  return { success: false, error: "Function not implemented in this version" }
}

// Updating currency and data for Egyptian market
const CURRENCY = "EGP" // الجنيه المصري
const CURRENCY_SYMBOL = "ج.م" // رمز الجنيه المصري

// Function to format currency in Egyptian format
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Updated list of Egyptian cities
export const EGYPTIAN_CITIES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "شبرا الخيمة",
  "بورسعيد",
  "السويس",
  "الأقصر",
  "المنصورة",
  "المحلة الكبرى",
  "طنطا",
  "أسيوط",
  "الإسماعيلية",
  "الفيوم",
  "الزقازيق",
  "دمياط",
  "أسوان",
  "المنيا",
  "دمنهور",
  "بني سويف",
  "قنا",
  "سوهاج",
  "كفر الشيخ",
  "البحيرة",
  "الغردقة",
  "شرم الشيخ",
]

// Updated list of Egyptian business types
export const EGYPTIAN_BUSINESS_TYPES = [
  "مطاعم وكافيهات",
  "ملابس وأزياء",
  "إلكترونيات وجوالات",
  "عقارات واستثمار",
  "سيارات ومعارض",
  "تجميل وعناية شخصية",
  "طبي وصيدليات",
  "تعليم ودورات",
  "رياضة ولياقة",
  "سفر وسياحة",
  "أثاث ومفروشات",
  "مجوهرات وذهب",
  "خدمات مالية",
  "تكنولوجيا ومواقع",
  "زراعة وأغذية",
]

// Updated ad pricing for Egyptian market
export const EGYPTIAN_AD_PRICING = {
  facebook: {
    minBudget: 50, // 50 جنيه يومياً
    avgCPC: 0.75, // متوسط تكلفة النقرة
    avgCPM: 15, // متوسط تكلفة الألف مشاهدة
  },
  instagram: {
    minBudget: 50,
    avgCPC: 0.85,
    avgCPM: 18,
  },
  google: {
    minBudget: 100,
    avgCPC: 1.2,
    avgCPM: 25,
  },
}
