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
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Users, Zap, Settings } from "lucide-react"
import { sendWhatsAppMessage, generateContentWithGemini } from "@/lib/ai-services"

interface WhatsAppMessage {
  id: string
  recipient: string
  message: string
  status: "pending" | "sent" | "delivered" | "failed"
  timestamp: string
  type: "welcome" | "campaign" | "reminder" | "custom"
}

export function WhatsAppAutomation() {
  // إزالة البيانات الوهمية
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]) // بدء بقائمة فارغة

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    message: "",
    type: "custom",
  })

  const [bulkMessage, setBulkMessage] = useState({
    recipients: "",
    message: "",
    type: "campaign",
  })

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("connected")

  // تحديث رسائل الترحيب للسوق المصري
  const generateAIMessage = async (messageType: string, clientName?: string) => {
    setIsGeneratingMessage(true)

    try {
      let prompt = ""

      switch (messageType) {
        case "welcome":
          prompt = `أنشئ رسالة ترحيب احترافية وودودة لعميل مصري جديد ${clientName ? `اسمه ${clientName}` : ""} انضم إلى خدماتنا في التسويق الرقمي والتصميم. يجب أن تكون الرسالة:
        - مرحبة وودودة باللهجة المصرية المهذبة
        - تشرح الخدمات المتاحة
        - تذكر أننا نخدم جميع أنحاء مصر
        - تتضمن معلومات التواصل المصرية
        - لا تزيد عن 300 حرف`
          break

        case "campaign":
          prompt = `أنشئ رسالة إشعار بإطلاق حملة إعلانية جديدة لعميل مصري. يجب أن تتضمن:
        - إشعار بنجاح إطلاق الحملة
        - دعوة لمتابعة الأداء
        - ذكر أن الحملة تستهدف السوق المصري
        - رابط للتواصل في حالة الاستفسارات
        - نبرة احترافية ومتفائلة مناسبة للثقافة المصرية`
          break

        case "reminder":
          prompt = `أنشئ رسالة تذكير مهذبة لعميل مصري بخصوص:
        - موافقة على تصميم أو محتوى
        - أو دفع مستحقات بالجنيه المصري
        - أو تقديم معلومات مطلوبة
        يجب أن تكون مهذبة وغير مزعجة ومناسبة للثقافة المصرية`
          break

        default:
          prompt = "أنشئ رسالة واتساب احترافية ومناسبة للعملاء المصريين"
      }

      const result = await generateContentWithGemini(prompt)

      if (result.success) {
        setNewMessage((prev) => ({ ...prev, message: result.data }))
      }
    } catch (error) {
      console.error("خطأ في إنشاء الرسالة:", error)
    } finally {
      setIsGeneratingMessage(false)
    }
  }

  const sendSingleMessage = async () => {
    if (!newMessage.recipient || !newMessage.message) return

    setIsSending(true)

    try {
      const result = await sendWhatsAppMessage(newMessage.recipient, newMessage.message)

      const messageId = Date.now().toString()
      const newMsg: WhatsAppMessage = {
        id: messageId,
        recipient: newMessage.recipient,
        message: newMessage.message,
        status: result.success ? "sent" : "failed",
        timestamp: new Date().toLocaleString("ar-SA"),
        type: newMessage.type as any,
      }

      setMessages((prev) => [newMsg, ...prev])

      if (result.success) {
        setNewMessage({ recipient: "", message: "", type: "custom" })
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const sendBulkMessages = async () => {
    if (!bulkMessage.recipients || !bulkMessage.message) return

    setIsSending(true)

    try {
      const recipients = bulkMessage.recipients.split("\n").filter((r) => r.trim())

      for (const recipient of recipients) {
        const result = await sendWhatsAppMessage(recipient.trim(), bulkMessage.message)

        const messageId = Date.now().toString() + Math.random()
        const newMsg: WhatsAppMessage = {
          id: messageId,
          recipient: recipient.trim(),
          message: bulkMessage.message,
          status: result.success ? "sent" : "failed",
          timestamp: new Date().toLocaleString("ar-SA"),
          type: bulkMessage.type as any,
        }

        setMessages((prev) => [newMsg, ...prev])

        // Add delay between messages to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      setBulkMessage({ recipients: "", message: "", type: "campaign" })
    } catch (error) {
      console.error("Error sending bulk messages:", error)
    } finally {
      setIsSending(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sent":
        return "تم الإرسال"
      case "delivered":
        return "تم التسليم"
      case "failed":
        return "فشل الإرسال"
      default:
        return "في الانتظار"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "welcome":
        return "ترحيب"
      case "campaign":
        return "حملة"
      case "reminder":
        return "تذكير"
      default:
        return "مخصص"
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "welcome":
        return "bg-green-100 text-green-800"
      case "campaign":
        return "bg-blue-100 text-blue-800"
      case "reminder":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">أتمتة واتساب</h2>
          <p className="text-muted-foreground">إرسال رسائل واتساب تلقائية ومخصصة للعملاء</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge
            variant={connectionStatus === "connected" ? "default" : "secondary"}
            className="flex items-center space-x-1 space-x-reverse"
          >
            <MessageSquare className="h-3 w-3" />
            <span>{connectionStatus === "connected" ? "متصل" : "غير متصل"}</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 ml-2" />
            الإعدادات
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرسائل</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">رسالة مرسلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم التسليم</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {messages.filter((m) => m.status === "delivered").length}
            </div>
            <p className="text-xs text-muted-foreground">رسالة مسلمة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {messages.length > 0
                ? Math.round((messages.filter((m) => m.status !== "failed").length / messages.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">نسبة النجاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء المستهدفين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{new Set(messages.map((m) => m.recipient)).size}</div>
            <p className="text-xs text-muted-foreground">عميل فريد</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">إرسال رسائل</TabsTrigger>
          <TabsTrigger value="bulk">الإرسال المجمع</TabsTrigger>
          <TabsTrigger value="history">سجل الرسائل</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Single Message Form */}
            <Card>
              <CardHeader>
                <CardTitle>إرسال رسالة واحدة</CardTitle>
                <CardDescription>إرسال رسالة مخصصة لعميل واحد</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipient">رقم الهاتف</Label>
                  <Input
                    id="recipient"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, recipient: e.target.value }))}
                    placeholder="+966501234567"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="messageType">نوع الرسالة</Label>
                  <Select
                    value={newMessage.type}
                    onValueChange={(value) => setNewMessage((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الرسالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">رسالة ترحيب</SelectItem>
                      <SelectItem value="campaign">إشعار حملة</SelectItem>
                      <SelectItem value="reminder">تذكير</SelectItem>
                      <SelectItem value="custom">رسالة مخصصة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="message">نص الرسالة</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateAIMessage(newMessage.type)}
                      disabled={isGeneratingMessage}
                    >
                      {isGeneratingMessage ? (
                        <>
                          <Zap className="h-3 w-3 ml-1 animate-spin" />
                          جاري الإنشاء...
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3 ml-1" />
                          إنشاء بالذكاء الاصطناعي
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="message"
                    value={newMessage.message}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                  />
                  <div className="text-xs text-gray-500 text-left">{newMessage.message.length} / 1000 حرف</div>
                </div>

                <Button
                  onClick={sendSingleMessage}
                  disabled={isSending || !newMessage.recipient || !newMessage.message}
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
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Message Templates */}
            <Card>
              <CardHeader>
                <CardTitle>قوالب الرسائل الذكية</CardTitle>
                <CardDescription>قوالب جاهزة مدعومة بالذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    type: "welcome",
                    title: "رسالة ترحيب مصرية",
                    description: "رسالة ترحيب للعملاء الجدد في مصر",
                    icon: "🇪🇬",
                  },
                  {
                    type: "campaign",
                    title: "إشعار حملة",
                    description: "إشعار بإطلاق حملة للسوق المصري",
                    icon: "🚀",
                  },
                  {
                    type: "reminder",
                    title: "تذكير مهذب",
                    description: "تذكير مناسب للثقافة المصرية",
                    icon: "⏰",
                  },
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <h4 className="font-medium">{template.title}</h4>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewMessage((prev) => ({ ...prev, type: template.type }))
                            generateAIMessage(template.type)
                          }}
                          disabled={isGeneratingMessage}
                        >
                          استخدام
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الإرسال المجمع</CardTitle>
              <CardDescription>إرسال رسالة واحدة لعدة عملاء في نفس الوقت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bulkRecipients">أرقام الهواتف (رقم واحد في كل سطر)</Label>
                <Textarea
                  id="bulkRecipients"
                  value={bulkMessage.recipients}
                  onChange={(e) => setBulkMessage((prev) => ({ ...prev, recipients: e.target.value }))}
                  placeholder="+966501234567&#10;+966507654321&#10;+966509876543"
                  rows={6}
                />
                <div className="text-xs text-gray-500">
                  عدد المستلمين: {bulkMessage.recipients.split("\n").filter((r) => r.trim()).length}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bulkMessageType">نوع الرسالة</Label>
                <Select
                  value={bulkMessage.type}
                  onValueChange={(value) => setBulkMessage((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الرسالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campaign">إشعار حملة</SelectItem>
                    <SelectItem value="reminder">تذكير</SelectItem>
                    <SelectItem value="announcement">إعلان</SelectItem>
                    <SelectItem value="custom">رسالة مخصصة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bulkMessage">نص الرسالة</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateAIMessage(bulkMessage.type)}
                    disabled={isGeneratingMessage}
                  >
                    {isGeneratingMessage ? (
                      <>
                        <Zap className="h-3 w-3 ml-1 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3 ml-1" />
                        إنشاء بالذكاء الاصطناعي
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="bulkMessage"
                  value={bulkMessage.message}
                  onChange={(e) => setBulkMessage((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="اكتب رسالتك هنا..."
                  rows={6}
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">تنبيه مهم</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• سيتم إرسال الرسالة لجميع الأرقام المدرجة</li>
                  <li>• تأكد من صحة أرقام الهواتف</li>
                  <li>• قد يستغرق الإرسال بعض الوقت حسب عدد المستلمين</li>
                </ul>
              </div>

              <Button
                onClick={sendBulkMessages}
                disabled={isSending || !bulkMessage.recipients || !bulkMessage.message}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Send className="h-4 w-4 ml-2 animate-pulse" />
                    جاري الإرسال المجمع...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 ml-2" />
                    إرسال لجميع المستلمين ({bulkMessage.recipients.split("\n").filter((r) => r.trim()).length})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل الرسائل</CardTitle>
              <CardDescription>جميع الرسائل المرسلة وحالتها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <Badge className={getTypeBadgeColor(message.type)}>{getTypeLabel(message.type)}</Badge>
                        <span className="text-sm text-gray-600">{message.recipient}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">{message.message}</p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getStatusIcon(message.status)}
                      <span className="text-xs text-gray-600">{getStatusLabel(message.status)}</span>
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">لا توجد رسائل مرسلة بعد</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
