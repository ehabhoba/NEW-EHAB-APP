"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { BarChart } from "lucide-react"
import {
  Brain,
  Wand2,
  CalendarIcon,
  FileText,
  ImageIcon,
  Video,
  MessageSquare,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Download,
  Share,
  Copy,
  Eye,
} from "lucide-react"
import { generateContentWithGeminiFlash, generateContentCalendar } from "@/lib/ai-services"

interface GeneratedContent {
  id: string
  title: string
  content: string
  type: "post" | "story" | "video_script" | "ad_copy" | "email" | "blog"
  platform: string
  hashtags: string[]
  createdAt: string
  engagement?: number
  reach?: number
  status: "draft" | "scheduled" | "published"
}

interface ContentCalendarItem {
  id: string
  date: string
  content: string
  platform: string
  type: string
  time: string
  hashtags: string[]
  status: "scheduled" | "published" | "draft"
}

export function AutoContentGenerator() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [contentCalendar, setContentCalendar] = useState<ContentCalendarItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const [contentSettings, setContentSettings] = useState({
    businessType: "",
    targetAudience: "",
    tone: "friendly",
    platform: "facebook",
    contentType: "post",
    keywords: "",
    includeHashtags: true,
    includeEmojis: true,
  })

  const generateSingleContent = async () => {
    if (!contentSettings.businessType) return

    setIsGenerating(true)

    try {
      const prompt = `
        أنشئ محتوى ${contentSettings.contentType} احترافي للسوق المصري:
        
        نوع النشاط: ${contentSettings.businessType}
        الجمهور المستهدف: ${contentSettings.targetAudience || "الجمهور العام"}
        المنصة: ${contentSettings.platform}
        النبرة: ${contentSettings.tone === "friendly" ? "ودودة" : contentSettings.tone === "professional" ? "مهنية" : "مرحة"}
        الكلمات المفتاحية: ${contentSettings.keywords}
        
        المطلوب:
        1. محتوى جذاب ومناسب للثقافة المصرية
        2. يتضمن دعوة للعمل واضحة
        3. مناسب لمنصة ${contentSettings.platform}
        4. ${contentSettings.includeEmojis ? "يتضمن إيموجي مناسبة" : "بدون إيموجي"}
        5. ${contentSettings.includeHashtags ? "مع هاشتاغات مناسبة" : "بدون هاشتاغات"}
        
        اكتب المحتوى بشكل إبداعي وجذاب.
      `

      const result = await generateContentWithGeminiFlash(prompt, {
        model: "gemini-2.0-flash-exp",
        temperature: 0.8,
        maxTokens: 1000,
      })

      if (result.success) {
        const newContent: GeneratedContent = {
          id: Date.now().toString(),
          title: `محتوى ${contentSettings.contentType} - ${contentSettings.businessType}`,
          content: result.data,
          type: contentSettings.contentType as any,
          platform: contentSettings.platform,
          hashtags: extractHashtags(result.data),
          createdAt: new Date().toLocaleString("ar-SA"),
          status: "draft",
        }

        setGeneratedContent((prev) => [newContent, ...prev])
      }
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateCalendar = async () => {
    if (!contentSettings.businessType) return

    setIsGenerating(true)

    try {
      const result = await generateContentCalendar(contentSettings.businessType, 30, contentSettings.platform)

      if (result.success) {
        // Parse calendar data from AI response
        const calendarItems: ContentCalendarItem[] = []
        const lines = result.data.split("\n").filter((line) => line.includes("|"))

        lines.forEach((line, index) => {
          if (index > 0 && line.trim()) {
            // Skip header row
            const parts = line.split("|").map((part) => part.trim())
            if (parts.length >= 6) {
              calendarItems.push({
                id: `cal-${Date.now()}-${index}`,
                date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                content: parts[5] || "محتوى مُنشأ بالذكاء الاصطناعي",
                platform: parts[3] || contentSettings.platform,
                type: parts[2] || "منشور",
                time: parts[4] || "12:00",
                hashtags: parts[6] ? parts[6].split(" ") : [],
                status: "scheduled",
              })
            }
          }
        })

        setContentCalendar(calendarItems)
      }
    } catch (error) {
      console.error("Error generating calendar:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#[\u0600-\u06FFa-zA-Z0-9_]+/g
    return content.match(hashtagRegex) || []
  }

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return MessageSquare
      case "story":
        return ImageIcon
      case "video_script":
        return Video
      case "ad_copy":
        return Target
      case "email":
        return FileText
      case "blog":
        return FileText
      default:
        return MessageSquare
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "bg-blue-100 text-blue-800"
      case "instagram":
        return "bg-pink-100 text-pink-800"
      case "twitter":
        return "bg-sky-100 text-sky-800"
      case "linkedin":
        return "bg-indigo-100 text-indigo-800"
      case "tiktok":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">مولد المحتوى التلقائي</h2>
          <p className="text-muted-foreground">إنشاء محتوى إبداعي وتقويم شامل بالذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge variant="default" className="flex items-center space-x-1 space-x-reverse">
            <Brain className="h-3 w-3" />
            <span>{generatedContent.length} محتوى مُنشأ</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1 space-x-reverse">
            <CalendarIcon className="h-3 w-3" />
            <span>{contentCalendar.length} مجدول</span>
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المحتوى المُنشأ</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedContent.length}</div>
            <p className="text-xs text-muted-foreground">قطعة محتوى</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المحتوى المجدول</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentCalendar.length}</div>
            <p className="text-xs text-muted-foreground">منشور مجدول</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التفاعل</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8.5%</div>
            <p className="text-xs text-muted-foreground">متوسط التفاعل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الوصول الإجمالي</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">45.2K</div>
            <p className="text-xs text-muted-foreground">مشاهدة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">مولد المحتوى</TabsTrigger>
          <TabsTrigger value="calendar">تقويم المحتوى</TabsTrigger>
          <TabsTrigger value="library">مكتبة المحتوى</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Settings */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>إعدادات المحتوى</CardTitle>
                <CardDescription>تخصيص المحتوى المُنشأ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessType">نوع النشاط التجاري</Label>
                  <Input
                    id="businessType"
                    value={contentSettings.businessType}
                    onChange={(e) => setContentSettings((prev) => ({ ...prev, businessType: e.target.value }))}
                    placeholder="مثال: مطعم، متجر أزياء، عيادة"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="targetAudience">الجمهور المستهدف</Label>
                  <Input
                    id="targetAudience"
                    value={contentSettings.targetAudience}
                    onChange={(e) => setContentSettings((prev) => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="مثال: الشباب، العائلات، رجال الأعمال"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="platform">المنصة</Label>
                  <Select
                    value={contentSettings.platform}
                    onValueChange={(value) => setContentSettings((prev) => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنصة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">فيسبوك</SelectItem>
                      <SelectItem value="instagram">إنستغرام</SelectItem>
                      <SelectItem value="twitter">تويتر</SelectItem>
                      <SelectItem value="linkedin">لينكد إن</SelectItem>
                      <SelectItem value="tiktok">تيك توك</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contentType">نوع المحتوى</Label>
                  <Select
                    value={contentSettings.contentType}
                    onValueChange={(value) => setContentSettings((prev) => ({ ...prev, contentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المحتوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">منشور</SelectItem>
                      <SelectItem value="story">ستوري</SelectItem>
                      <SelectItem value="video_script">سكريبت فيديو</SelectItem>
                      <SelectItem value="ad_copy">إعلان</SelectItem>
                      <SelectItem value="email">إيميل</SelectItem>
                      <SelectItem value="blog">مقال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tone">نبرة المحتوى</Label>
                  <Select
                    value={contentSettings.tone}
                    onValueChange={(value) => setContentSettings((prev) => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النبرة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">ودودة</SelectItem>
                      <SelectItem value="professional">مهنية</SelectItem>
                      <SelectItem value="casual">غير رسمية</SelectItem>
                      <SelectItem value="humorous">مرحة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="keywords">الكلمات المفتاحية</Label>
                  <Input
                    id="keywords"
                    value={contentSettings.keywords}
                    onChange={(e) => setContentSettings((prev) => ({ ...prev, keywords: e.target.value }))}
                    placeholder="كلمات مفصولة بفواصل"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeHashtags">تضمين هاشتاغات</Label>
                    <input
                      type="checkbox"
                      id="includeHashtags"
                      checked={contentSettings.includeHashtags}
                      onChange={(e) => setContentSettings((prev) => ({ ...prev, includeHashtags: e.target.checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeEmojis">تضمين إيموجي</Label>
                    <input
                      type="checkbox"
                      id="includeEmojis"
                      checked={contentSettings.includeEmojis}
                      onChange={(e) => setContentSettings((prev) => ({ ...prev, includeEmojis: e.target.checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={generateSingleContent} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Wand2 className="h-4 w-4 ml-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 ml-2" />
                        إنشاء محتوى
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={generateCalendar}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <CalendarIcon className="h-4 w-4 ml-2" />
                    إنشاء تقويم شهري
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Content Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>المحتوى المُنشأ</CardTitle>
                <CardDescription>آخر المحتوى المُنشأ بالذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContent.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا يوجد محتوى بعد</h3>
                    <p className="text-gray-500 mb-4">ابدأ بإنشاء محتوى باستخدام الإعدادات</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedContent.slice(0, 3).map((content) => {
                      const ContentIcon = getContentTypeIcon(content.type)
                      return (
                        <Card key={content.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <ContentIcon className="h-5 w-5 text-blue-600" />
                                <h4 className="font-medium">{content.title}</h4>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Badge className={getPlatformColor(content.platform)}>{content.platform}</Badge>
                                <Badge variant="outline">{content.status}</Badge>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <p className="text-sm whitespace-pre-wrap line-clamp-4">{content.content}</p>
                            </div>
                            {content.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {content.hashtags.slice(0, 5).map((hashtag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {hashtag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{content.createdAt}</span>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Button size="sm" variant="outline" onClick={() => copyContent(content.content)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar View */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>التقويم</CardTitle>
                <CardDescription>اختر تاريخ لعرض المحتوى المجدول</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md" />
              </CardContent>
            </Card>

            {/* Scheduled Content */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>المحتوى المجدول</CardTitle>
                <CardDescription>
                  {selectedDate
                    ? `المحتوى المجدول لتاريخ ${selectedDate.toLocaleDateString("ar-SA")}`
                    : "جميع المحتوى المجدول"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contentCalendar.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا يوجد محتوى مجدول</h3>
                    <p className="text-gray-500 mb-4">أنشئ تقويم محتوى لرؤية المنشورات المجدولة</p>
                    <Button onClick={generateCalendar} disabled={isGenerating}>
                      <CalendarIcon className="h-4 w-4 ml-2" />
                      إنشاء تقويم
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contentCalendar.slice(0, 10).map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <CalendarIcon className="h-5 w-5 text-green-600" />
                              <div>
                                <h4 className="font-medium">{item.type}</h4>
                                <p className="text-sm text-gray-600">
                                  {item.date} - {item.time}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Badge className={getPlatformColor(item.platform)}>{item.platform}</Badge>
                              <Badge variant={item.status === "published" ? "default" : "secondary"}>
                                {item.status === "scheduled"
                                  ? "مجدول"
                                  : item.status === "published"
                                    ? "منشور"
                                    : "مسودة"}
                              </Badge>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm line-clamp-2">{item.content}</p>
                          </div>
                          {item.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.hashtags.slice(0, 3).map((hashtag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {hashtag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مكتبة المحتوى</CardTitle>
              <CardDescription>جميع المحتوى المُنشأ والمحفوظ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedContent.map((content) => {
                  const ContentIcon = getContentTypeIcon(content.type)
                  return (
                    <Card key={content.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <ContentIcon className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium text-sm">{content.title}</h4>
                          </div>
                          <Badge className={getPlatformColor(content.platform)} className="text-xs">
                            {content.platform}
                          </Badge>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-xs line-clamp-3">{content.content}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{content.createdAt}</span>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-transparent">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-transparent">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-transparent">
                              <Share className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">أفضل محتوى</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">منشور فيسبوك</div>
                <p className="text-xs text-muted-foreground">12.5% معدل تفاعل</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">أفضل منصة</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">إنستغرام</div>
                <p className="text-xs text-muted-foreground">8.9% معدل تفاعل</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">أفضل وقت</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8:00 م</div>
                <p className="text-xs text-muted-foreground">أعلى تفاعل</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">معدل النشر</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2</div>
                <p className="text-xs text-muted-foreground">منشور يومياً</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تحليل الأداء</CardTitle>
              <CardDescription>أداء المحتوى المُنشأ خلال الشهر الماضي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">تحليلات الأداء ستظهر هنا بعد نشر المحتوى</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
