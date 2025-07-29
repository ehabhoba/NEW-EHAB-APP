"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Copy,
  RefreshCw,
  Share,
  Wand2,
  Target,
  MessageSquare,
  ImageIcon,
  Video,
  Calendar,
  Plus,
} from "lucide-react"

export function AIContentStudio() {
  const [contentType, setContentType] = useState("ad-copy")
  const [platform, setPlatform] = useState("facebook")
  const [tone, setTone] = useState("professional")
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateContent = async () => {
    setIsGenerating(true)

    // Simulate AI content generation using OpenAI GPT 3.5 or Gemini Flash 2.0
    const mockContent = {
      "ad-copy": [
        "🌟 اكتشف مجموعتنا الجديدة من المنتجات المميزة! جودة عالية وأسعار منافسة. تسوق الآن واحصل على خصم 20% على طلبك الأول! #تسوق_ذكي #عروض_حصرية",
        "💎 لا تفوت الفرصة! عروض محدودة الوقت على أفضل منتجاتنا. اطلب الآن وادفع عند الاستلام مع ضمان الجودة 100%. 🚚 توصيل مجاني لجميع أنحاء المملكة",
        "🔥 عرض خاص لعملائنا الكرام! خصم يصل إلى 50% على مجموعة مختارة من المنتجات. سارع بالطلب قبل انتهاء الكمية المحدودة!",
      ],
      "social-post": [
        "صباح الخير أصدقاءنا الأعزاء! ☀️ نبدأ يومنا بطاقة إيجابية وحماس للعمل. ما هي خططكم لهذا اليوم؟ شاركونا في التعليقات! #صباح_الخير #طاقة_إيجابية",
        "هل تعلم أن...؟ 🤔 نصائح مفيدة ومعلومات قيمة نشاركها معكم يومياً. تابعونا للمزيد من المحتوى المفيد والممتع! #معلومات_مفيدة #تعلم_معنا",
        "شكراً لكم على ثقتكم الغالية! 🙏 رضاكم هو هدفنا الأول وسعادتكم هي نجاحنا. نعدكم بتقديم الأفضل دائماً! #شكراً #ثقة_العملاء",
      ],
      "email-subject": [
        "🎉 عرض خاص لك فقط - خصم 30% ينتهي اليوم!",
        "⏰ آخر فرصة للحصول على العرض المحدود",
        "🌟 منتجات جديدة وصلت حديثاً - كن أول من يراها!",
        "💝 هدية مجانية مع كل طلب - لفترة محدودة",
        "🚀 تحديث مهم حول طلبك - اطلع عليه الآن",
      ],
    }

    // Simulate API delay
    setTimeout(() => {
      setGeneratedContent(mockContent[contentType as keyof typeof mockContent] || [])
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "ad-copy":
        return "نسخة إعلانية"
      case "social-post":
        return "منشور اجتماعي"
      case "email-subject":
        return "عنوان بريد إلكتروني"
      case "blog-title":
        return "عنوان مقال"
      case "product-description":
        return "وصف منتج"
      default:
        return "محتوى"
    }
  }

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "فيسبوك"
      case "instagram":
        return "إنستغرام"
      case "tiktok":
        return "تيك توك"
      case "youtube":
        return "يوتيوب"
      case "email":
        return "البريد الإلكتروني"
      case "website":
        return "الموقع الإلكتروني"
      default:
        return "عام"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">استوديو المحتوى الذكي</h2>
          <p className="text-muted-foreground">إنشاء محتوى إبداعي باستخدام الذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Badge variant="secondary" className="flex items-center space-x-1 space-x-reverse">
            <Sparkles className="h-3 w-3" />
            <span>مدعوم بالذكاء الاصطناعي</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Generation Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Wand2 className="h-5 w-5" />
                <span>إعدادات المحتوى</span>
              </CardTitle>
              <CardDescription>اختر نوع المحتوى والمنصة لإنشاء محتوى محسن</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="contentType">نوع المحتوى</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المحتوى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ad-copy">نسخة إعلانية</SelectItem>
                    <SelectItem value="social-post">منشور اجتماعي</SelectItem>
                    <SelectItem value="email-subject">عنوان بريد إلكتروني</SelectItem>
                    <SelectItem value="blog-title">عنوان مقال</SelectItem>
                    <SelectItem value="product-description">وصف منتج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="platform">المنصة</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">فيسبوك</SelectItem>
                    <SelectItem value="instagram">إنستغرام</SelectItem>
                    <SelectItem value="tiktok">تيك توك</SelectItem>
                    <SelectItem value="youtube">يوتيوب</SelectItem>
                    <SelectItem value="email">البريد الإلكتروني</SelectItem>
                    <SelectItem value="website">الموقع الإلكتروني</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tone">نبرة المحتوى</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النبرة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">مهني</SelectItem>
                    <SelectItem value="friendly">ودود</SelectItem>
                    <SelectItem value="exciting">متحمس</SelectItem>
                    <SelectItem value="formal">رسمي</SelectItem>
                    <SelectItem value="casual">غير رسمي</SelectItem>
                    <SelectItem value="persuasive">مقنع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prompt">وصف المحتوى المطلوب</Label>
                <Textarea
                  id="prompt"
                  placeholder="اكتب وصفاً مفصلاً للمحتوى الذي تريد إنشاءه..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={generateContent} disabled={isGenerating || !prompt.trim()} className="w-full">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 ml-2" />
                    إنشاء المحتوى
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>المحتوى المُنشأ</CardTitle>
              <CardDescription>
                {generatedContent.length > 0
                  ? `تم إنشاء ${generatedContent.length} نسخة من ${getContentTypeLabel(contentType)} لمنصة ${getPlatformLabel(platform)}`
                  : "سيظهر المحتوى المُنشأ هنا"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContent.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">لم يتم إنشاء أي محتوى بعد</p>
                  <p className="text-sm text-gray-400">املأ النموذج واضغط على "إنشاء المحتوى" للبدء</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedContent.map((content, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline">النسخة {index + 1}</Badge>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(content)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-gray-500">
                          <span>الطول: {content.length} حرف</span>
                          <span>مناسب لـ {getPlatformLabel(platform)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={generateContent} disabled={isGenerating}>
                      <RefreshCw className="h-4 w-4 ml-2" />
                      إنشاء المزيد
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Tools Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>أدوات الذكاء الاصطناعي المتقدمة</CardTitle>
          <CardDescription>مجموعة شاملة من الأدوات لإنشاء وتحسين المحتوى</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content-ideas" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content-ideas">أفكار المحتوى</TabsTrigger>
              <TabsTrigger value="competitor-analysis">تحليل المنافسين</TabsTrigger>
              <TabsTrigger value="hashtag-generator">مولد الهاشتاغ</TabsTrigger>
              <TabsTrigger value="content-calendar">تقويم المحتوى</TabsTrigger>
            </TabsList>

            <TabsContent value="content-ideas" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "أفكار منشورات تفاعلية", desc: "اقتراحات لمنشورات تزيد التفاعل", icon: MessageSquare },
                  { title: "مواضيع ترندينغ", desc: "أحدث المواضيع الرائجة", icon: Calendar },
                  { title: "أفكار فيديوهات", desc: "مفاهيم إبداعية للفيديوهات", icon: Video },
                  { title: "تصاميم مقترحة", desc: "أفكار للتصاميم والجرافيك", icon: ImageIcon },
                  { title: "حملات موسمية", desc: "أفكار للمناسبات والأعياد", icon: Calendar },
                  { title: "محتوى تعليمي", desc: "مواضيع تثقيفية ومفيدة", icon: Target },
                ].map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <item.icon className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="competitor-analysis" className="space-y-4">
              <div className="text-center py-8">
                <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">تحليل المنافسين الذكي</h3>
                <p className="text-gray-500 mb-4">راقب أداء منافسيك واحصل على رؤى قيمة</p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منافس للمراقبة
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="hashtag-generator" className="space-y-4">
              <div className="text-center py-8">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">مولد الهاشتاغ الذكي</h3>
                <p className="text-gray-500 mb-4">اكتشف أفضل الهاشتاغات لزيادة الوصول</p>
                <div className="max-w-md mx-auto">
                  <Input placeholder="أدخل موضوع المحتوى..." className="mb-3" />
                  <Button className="w-full">
                    <Sparkles className="h-4 w-4 ml-2" />
                    إنشاء هاشتاغات
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content-calendar" className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">تقويم المحتوى الذكي</h3>
                <p className="text-gray-500 mb-4">خطط ونظم محتواك بذكاء</p>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء خطة محتوى
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
