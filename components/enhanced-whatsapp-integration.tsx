"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  MessageSquare,
  Send,
  Bot,
  BarChart3,
  FileText,
  Users,
  Settings,
  Webhook,
  ImageIcon,
  Video,
  File,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { generateContentWithGeminiFlash, sendWhatsAppMessage } from "@/lib/ai-services"

interface WhatsAppMessage {
  id: string
  clientId: string
  clientName: string
  message: string
  type: "text" | "image" | "video" | "document" | "report" | "analytics"
  status: "pending" | "sent" | "delivered" | "read" | "failed"
  timestamp: string
  isIncoming: boolean
  metadata?: any
}

interface WebhookConfig {
  url: string
  authHeader: string
  incomingMessages: boolean
  sentMessages: boolean
  apiMessages: boolean
  deletedMessages: boolean
  editedMessages: boolean
  messageStatuses: boolean
  accountChanges: boolean
  chatBlocks: boolean
  surveys: boolean
  calls: boolean
}

export function EnhancedWhatsAppIntegration() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    url: "",
    authHeader: "",
    incomingMessages: true,
    sentMessages: true,
    apiMessages: true,
    deletedMessages: false,
    editedMessages: false,
    messageStatuses: true,
    accountChanges: true,
    chatBlocks: true,
    surveys: true,
    calls: true,
  })

  const [selectedClient, setSelectedClient] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messageType, setMessageType] = useState<"text" | "report" | "analytics" | "campaign">("text")
  const [isConnected, setIsConnected] = useState(true)
  const [isSending, setIsSending] = useState(false)

  // Mock client data
  const clients = [
    { id: "1", name: "شركة الأحلام", phone: "+201234567890", campaigns: 5, revenue: 45000 },
    { id: "2", name: "متجر الأناقة", phone: "+201234567891", campaigns: 3, revenue: 32000 },
    { id: "3", name: "مطعم الذوق", phone: "+201234567892", campaigns: 4, revenue: 28000 },
  ]

  // Enhanced message sending with different types
  const sendEnhancedMessage = async (type: string, clientId: string, customContent?: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return

    setIsSending(true)

    try {
      let messageContent = customContent || ""

      // Generate content based on type
      switch (type) {
        case "welcome":
          const welcomeResult = await generateContentWithGeminiFlash(`
            أنشئ رسالة ترحيب احترافية للعميل ${client.name} في مصر تتضمن:
            - ترحيب حار باللهجة المصرية المهذبة
            - شرح مختصر لخدماتنا
            - معلومات التواصل
            - تأكيد على خدمة جميع أنحاء مصر
            - دعوة للتفاعل
            الرسالة يجب أن تكون ودودة ومهنية ولا تزيد عن 250 كلمة.
          `)
          messageContent = welcomeResult.success ? welcomeResult.data : "مرحباً بك في منظم الأعمال الذكي!"
          break

        case "report":
          const reportResult = await generateContentWithGeminiFlash(`
            أنشئ تقرير أداء شامل للعميل ${client.name} يتضمن:
            - عدد الحملات النشطة: ${client.campaigns}
            - إجمالي الإيرادات: ${client.revenue} ج.م
            - معدل النمو الشهري
            - أهم الإنجازات
            - التوصيات للشهر القادم
            - إحصائيات التفاعل
            اكتب التقرير بشكل مهني ومفصل باللغة العربية.
          `)
          messageContent = reportResult.success ? reportResult.data : "تقرير الأداء جاهز للمراجعة"
          break

        case "analytics":
          const analyticsResult = await generateContentWithGeminiFlash(`
            أنشئ تحليل تفصيلي لأداء حملات ${client.name} يشمل:
            - تحليل المشاهدات والنقرات
            - معدل التحويل والعائد على الاستثمار
            - أفضل المنصات أداءً
            - الجمهور الأكثر تفاعلاً
            - اقتراحات التحسين
            - توقعات الأداء المستقبلي
            قدم التحليل بأسلوب واضح ومفهوم مع أرقام محددة.
          `)
          messageContent = analyticsResult.success ? analyticsResult.data : "تحليل الأداء متاح للمراجعة"
          break

        case "campaign_update":
          const campaignResult = await generateContentWithGeminiFlash(`
            أنشئ تحديث حملة إعلانية للعميل ${client.name} يتضمن:
            - حالة الحملات الحالية
            - النتائج المحققة حتى الآن
            - التعديلات المطلوبة
            - الخطوات القادمة
            - موعد التقرير التالي
            اكتب التحديث بنبرة إيجابية ومشجعة.
          `)
          messageContent = campaignResult.success ? campaignResult.data : "تحديث الحملة متاح"
          break

        default:
          messageContent = customContent || "رسالة من منظم الأعمال الذكي"
      }

      // Send via WhatsApp
      const result = await sendWhatsAppMessage(client.phone, messageContent)

      // Add to messages history
      const newMessage: WhatsAppMessage = {
        id: Date.now().toString(),
        clientId: clientId,
        clientName: client.name,
        message: messageContent,
        type: type as any,
        status: result.success ? "sent" : "failed",
        timestamp: new Date().toLocaleString("ar-SA"),
        isIncoming: false,
      }

      setMessages((prev) => [newMessage, ...prev])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  // Webhook configuration update
  const updateWebhookConfig = async () => {
    try {
      // In real implementation, this would update the webhook settings
      console.log("Updating webhook configuration:", webhookConfig)
      // API call to update webhook settings
    } catch (error) {
      console.error("Error updating webhook config:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "read":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="h-4 w-4" />
      case "analytics":
        return <BarChart3 className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <File className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">تكامل واتساب المتقدم</h2>
          <p className="text-muted-foreground">إدارة شاملة لتواصل العملاء عبر واتساب مع webhooks والذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="flex items-center space-x-1 space-x-reverse"
          >
            <MessageSquare className="h-3 w-3" />
            <span>{isConnected ? "متصل" : "غير متصل"}</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 ml-2" />
            إعدادات متقدمة
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرسائل المرسلة</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter((m) => !m.isIncoming).length}</div>
            <p className="text-xs text-muted-foreground">+12% من الأسبوع الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرسائل الواردة</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter((m) => m.isIncoming).length}</div>
            <p className="text-xs text-muted-foreground">معدل الرد 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التسليم</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-muted-foreground">معدل ممتاز</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء النشطين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
            <p className="text-xs text-muted-foreground">متفاعلين هذا الأسبوع</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="messaging" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="messaging">المراسلة المتقدمة</TabsTrigger>
          <TabsTrigger value="webhooks">إعدادات Webhooks</TabsTrigger>
          <TabsTrigger value="automation">الأتمتة الذكية</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات والتقارير</TabsTrigger>
          <TabsTrigger value="history">سجل المحادثات</TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Messaging Panel */}
            <Card>
              <CardHeader>
                <CardTitle>إرسال رسائل متقدمة</CardTitle>
                <CardDescription>إرسال تقارير وتحليلات ومحتوى مخصص للعملاء</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">اختر العميل</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="messageType">نوع الرسالة</Label>
                  <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الرسالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">رسالة نصية</SelectItem>
                      <SelectItem value="report">تقرير أداء</SelectItem>
                      <SelectItem value="analytics">تحليلات مفصلة</SelectItem>
                      <SelectItem value="campaign">تحديث حملة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {messageType === "text" && (
                  <div className="grid gap-2">
                    <Label htmlFor="content">محتوى الرسالة</Label>
                    <Textarea
                      id="content"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      rows={4}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => sendEnhancedMessage(messageType, selectedClient, messageContent)}
                    disabled={isSending || !selectedClient}
                    className="w-full"
                  >
                    {isSending ? (
                      <>
                        <Send className="h-4 w-4 ml-2 animate-pulse" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 ml-2" />
                        إرسال
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => sendEnhancedMessage("welcome", selectedClient)}
                    disabled={isSending || !selectedClient}
                  >
                    <Bot className="h-4 w-4 ml-2" />
                    رسالة ترحيب
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات السريعة</CardTitle>
                <CardDescription>إرسال محتوى جاهز بنقرة واحدة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { type: "report", title: "تقرير الأداء الشهري", desc: "تقرير شامل لأداء العميل", icon: FileText },
                    { type: "analytics", title: "تحليلات مفصلة", desc: "تحليل عميق للحملات والنتائج", icon: BarChart3 },
                    {
                      type: "campaign_update",
                      title: "تحديث الحملة",
                      desc: "آخر تطورات الحملات الإعلانية",
                      icon: TrendingUp,
                    },
                  ].map((action, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <action.icon className="h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{action.title}</h4>
                              <p className="text-sm text-gray-600">{action.desc}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => sendEnhancedMessage(action.type, selectedClient)}
                            disabled={!selectedClient || isSending}
                          >
                            إرسال
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Bulk Actions */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">إرسال جماعي</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        clients.forEach((client) => {
                          setTimeout(() => sendEnhancedMessage("welcome", client.id), Math.random() * 2000)
                        })
                      }}
                      disabled={isSending}
                    >
                      <Users className="h-4 w-4 ml-2" />
                      ترحيب جماعي
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        clients.forEach((client) => {
                          setTimeout(() => sendEnhancedMessage("report", client.id), Math.random() * 3000)
                        })
                      }}
                      disabled={isSending}
                    >
                      <FileText className="h-4 w-4 ml-2" />
                      تقارير جماعية
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Webhook className="h-5 w-5" />
                <span>إعدادات Webhooks</span>
              </CardTitle>
              <CardDescription>تكوين webhooks لاستقبال التحديثات التلقائية من واتساب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Webhook URL Configuration */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="webhookUrl">رابط Webhook</Label>
                  <Input
                    id="webhookUrl"
                    value={webhookConfig.url}
                    onChange={(e) => setWebhookConfig((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="authHeader">رأس التفويض</Label>
                  <Input
                    id="authHeader"
                    value={webhookConfig.authHeader}
                    onChange={(e) => setWebhookConfig((prev) => ({ ...prev, authHeader: e.target.value }))}
                    placeholder="Bearer your-token"
                    type="password"
                  />
                </div>
              </div>

              {/* Webhook Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">إعدادات الاستقبال</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "incomingMessages", label: "الرسائل الواردة", desc: "استقبال الرسائل من العملاء" },
                    { key: "sentMessages", label: "الرسائل المرسلة", desc: "تأكيد إرسال الرسائل" },
                    { key: "apiMessages", label: "رسائل API", desc: "الرسائل المرسلة عبر API" },
                    { key: "messageStatuses", label: "حالة الرسائل", desc: "تحديثات حالة التسليم والقراءة" },
                    { key: "accountChanges", label: "تغييرات الحساب", desc: "تحديثات حالة الحساب" },
                    { key: "chatBlocks", label: "حظر المحادثات", desc: "إشعارات الحظر وإلغاء الحظر" },
                    { key: "surveys", label: "الاستطلاعات", desc: "ردود الاستطلاعات والتقييمات" },
                    { key: "calls", label: "المكالمات", desc: "إشعارات المكالمات الصوتية والمرئية" },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium">{setting.label}</h5>
                        <p className="text-sm text-gray-600">{setting.desc}</p>
                      </div>
                      <Switch
                        checked={webhookConfig[setting.key as keyof WebhookConfig] as boolean}
                        onCheckedChange={(checked) => setWebhookConfig((prev) => ({ ...prev, [setting.key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline">اختبار الاتصال</Button>
                <Button onClick={updateWebhookConfig}>
                  <Settings className="h-4 w-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Auto-Response Rules */}
            <Card>
              <CardHeader>
                <CardTitle>قواعد الرد التلقائي</CardTitle>
                <CardDescription>إعداد ردود تلقائية ذكية للرسائل الواردة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { trigger: "مرحبا", response: "أهلاً وسهلاً! كيف يمكنني مساعدتك؟", active: true },
                  { trigger: "السعر", response: "سأرسل لك قائمة الأسعار المحدثة", active: true },
                  { trigger: "التقرير", response: "جاري إعداد تقرير الأداء الخاص بك", active: false },
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium">عند كتابة: "{rule.trigger}"</h5>
                      <p className="text-sm text-gray-600">الرد: {rule.response}</p>
                    </div>
                    <Switch checked={rule.active} />
                  </div>
                ))}
                <Button className="w-full bg-transparent" variant="outline">
                  <Bot className="h-4 w-4 ml-2" />
                  إضافة قاعدة جديدة
                </Button>
              </CardContent>
            </Card>

            {/* Scheduled Messages */}
            <Card>
              <CardHeader>
                <CardTitle>الرسائل المجدولة</CardTitle>
                <CardDescription>جدولة إرسال التقارير والتحديثات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { type: "تقرير أسبوعي", schedule: "كل يوم أحد 9:00 ص", clients: 12 },
                  { type: "تحديث الحملة", schedule: "يومياً 6:00 م", clients: 8 },
                  { type: "تذكير الدفع", schedule: "يوم 25 من كل شهر", clients: 5 },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <h5 className="font-medium">{schedule.type}</h5>
                        <p className="text-sm text-gray-600">{schedule.schedule}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{schedule.clients} عميل</Badge>
                  </div>
                ))}
                <Button className="w-full bg-transparent" variant="outline">
                  <Calendar className="h-4 w-4 ml-2" />
                  إضافة جدولة جديدة
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>تحليل الرسائل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>معدل الفتح</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل الرد</span>
                    <span className="font-bold text-blue-600">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>وقت الرد المتوسط</span>
                    <span className="font-bold">12 دقيقة</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>تفاعل العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex justify-between items-center">
                      <span className="text-sm">{client.name}</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-sm text-gray-600">معدل التسليم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">رسالة هذا الأسبوع</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">24</div>
                    <div className="text-sm text-gray-600">عميل نشط</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل المحادثات</CardTitle>
              <CardDescription>جميع الرسائل المرسلة والمستقبلة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">لا توجد رسائل بعد</p>
                    <p className="text-sm text-gray-400">ابدأ بإرسال رسائل للعملاء لرؤية السجل هنا</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        {getMessageTypeIcon(message.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <span className="font-medium">{message.clientName}</span>
                            <Badge variant={message.isIncoming ? "secondary" : "default"}>
                              {message.isIncoming ? "وارد" : "صادر"}
                            </Badge>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-800 line-clamp-2">{message.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">{getStatusIcon(message.status)}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
