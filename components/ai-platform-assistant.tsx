"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Send,
  Mic,
  Search,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Lightbulb,
  Zap,
  Brain,
  FileText,
  Calendar,
  Target,
  DollarSign,
} from "lucide-react"
import { generateContentWithGeminiFlash } from "@/lib/ai-services"

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: string
  type: "text" | "action" | "data" | "suggestion"
  metadata?: any
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  action: string
  category: "analytics" | "clients" | "campaigns" | "reports" | "automation"
}

export function AIPlatformAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "مرحباً! أنا مساعدك الذكي في منظم الأعمال. يمكنني مساعدتك في إدارة العملاء، تحليل الحملات، إنشاء التقارير، وأي شيء آخر تحتاجه. كيف يمكنني مساعدتك اليوم؟",
      isUser: false,
      timestamp: new Date().toLocaleString("ar-SA"),
      type: "text",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "تحليل الأداء العام",
      description: "احصل على تحليل شامل لأداء المنصة",
      icon: BarChart3,
      action: "analyze_performance",
      category: "analytics",
    },
    {
      id: "2",
      title: "قائمة العملاء النشطين",
      description: "عرض العملاء الأكثر تفاعلاً",
      icon: Users,
      action: "active_clients",
      category: "clients",
    },
    {
      id: "3",
      title: "حالة الحملات",
      description: "مراجعة حالة جميع الحملات الجارية",
      icon: Target,
      action: "campaign_status",
      category: "campaigns",
    },
    {
      id: "4",
      title: "تقرير الإيرادات",
      description: "تقرير مفصل عن الإيرادات والأرباح",
      icon: DollarSign,
      action: "revenue_report",
      category: "reports",
    },
    {
      id: "5",
      title: "اقتراحات التحسين",
      description: "اقتراحات ذكية لتحسين الأداء",
      icon: Lightbulb,
      action: "improvement_suggestions",
      category: "automation",
    },
    {
      id: "6",
      title: "جدولة المهام",
      description: "عرض وإدارة المهام المجدولة",
      icon: Calendar,
      action: "scheduled_tasks",
      category: "automation",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleString("ar-SA"),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Enhanced AI prompt for platform management
      const aiPrompt = `
        أنت مساعد ذكي متخصص في إدارة منصة "منظم الأعمال الذكي" للتسويق الرقمي في مصر.
        
        معلومات المنصة:
        - منصة إدارة أعمال تسويقية شاملة
        - تخدم العملاء في مصر بالجنيه المصري
        - تتضمن إدارة العملاء، الحملات، التقارير، واتساب، فيسبوك
        - مدعومة بالذكاء الاصطناعي والأتمتة
        
        قدراتك:
        1. تحليل البيانات والأداء
        2. إنشاء التقارير والإحصائيات
        3. إدارة العملاء والحملات
        4. اقتراح التحسينات
        5. البحث في البيانات
        6. أتمتة المهام
        7. إرشاد المدير خطوة بخطوة
        
        استفسار المدير: "${inputMessage}"
        
        قدم إجابة مفيدة وعملية باللغة العربية مع اقتراحات محددة إذا أمكن.
        إذا كان السؤال يتطلب بيانات محددة، اذكر أنك تحتاج للوصول للبيانات الفعلية.
      `

      const response = await generateContentWithGeminiFlash(aiPrompt, {
        model: "gemini-2.0-flash-exp",
        temperature: 0.7,
        maxTokens: 1500,
      })

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.success ? response.data : "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
        isUser: false,
        timestamp: new Date().toLocaleString("ar-SA"),
        type: "text",
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        isUser: false,
        timestamp: new Date().toLocaleString("ar-SA"),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action: QuickAction) => {
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      content: action.title,
      isUser: true,
      timestamp: new Date().toLocaleString("ar-SA"),
      type: "action",
    }

    setMessages((prev) => [...prev, actionMessage])
    setIsLoading(true)

    try {
      let aiPrompt = ""

      switch (action.action) {
        case "analyze_performance":
          aiPrompt = `
            قم بإنشاء تحليل شامل لأداء المنصة يتضمن:
            1. إحصائيات العملاء (العدد، النمو، النشاط)
            2. أداء الحملات (النجاح، الفشل، التحسينات)
            3. الإيرادات والأرباح
            4. معدلات التفاعل والرضا
            5. نقاط القوة والضعف
            6. توصيات للتحسين
            
            اكتب التحليل بشكل مفصل ومهني مع أرقام تقديرية واقعية للسوق المصري.
          `
          break

        case "active_clients":
          aiPrompt = `
            أنشئ قائمة بالعملاء النشطين تتضمن:
            1. أسماء العملاء الأكثر تفاعلاً
            2. مستوى نشاطهم وتفاعلهم
            3. آخر تفاعل لكل عميل
            4. الحملات النشطة لكل عميل
            5. قيمة كل عميل
            6. توصيات للتعامل مع كل عميل
            
            استخدم أسماء شركات مصرية واقعية وبيانات منطقية.
          `
          break

        case "campaign_status":
          aiPrompt = `
            قدم تقرير حالة الحملات يشمل:
            1. الحملات النشطة حالياً
            2. الحملات المكتملة مؤخراً
            3. الحملات المجدولة
            4. أداء كل حملة (مشاهدات، نقرات، تحويلات)
            5. الميزانية المستخدمة والمتبقية
            6. التحديات والمشاكل
            7. خطة العمل للأسبوع القادم
            
            اجعل التقرير مفصل وعملي للسوق المصري.
          `
          break

        case "revenue_report":
          aiPrompt = `
            أنشئ تقرير إيرادات شامل بالجنيه المصري يتضمن:
            1. إجمالي الإيرادات الشهرية والسنوية
            2. مصادر الإيرادات (حسب الخدمة والعميل)
            3. نمو الإيرادات مقارنة بالفترات السابقة
            4. هامش الربح والتكاليف
            5. توقعات الإيرادات القادمة
            6. فرص زيادة الإيرادات
            
            استخدم أرقام واقعية مناسبة للسوق المصري.
          `
          break

        case "improvement_suggestions":
          aiPrompt = `
            قدم اقتراحات تحسين ذكية للمنصة تشمل:
            1. تحسينات تقنية للنظام
            2. تطوير خدمات جديدة
            3. تحسين تجربة العملاء
            4. زيادة الكفاءة والإنتاجية
            5. توسيع قاعدة العملاء
            6. تحسين العمليات الداخلية
            7. استخدام أفضل للذكاء الاصطناعي
            
            اجعل الاقتراحات عملية وقابلة للتطبيق.
          `
          break

        case "scheduled_tasks":
          aiPrompt = `
            عرض المهام المجدولة وإدارتها:
            1. المهام اليومية والأسبوعية
            2. التقارير المجدولة للعملاء
            3. الحملات المبرمجة
            4. المتابعات والتذكيرات
            5. الصيانة والتحديثات
            6. اجتماعات العملاء
            7. مراجعة الأداء الدورية
            
            قدم جدول زمني منظم مع الأولويات.
          `
          break

        default:
          aiPrompt = `قدم معلومات مفيدة حول ${action.title} في سياق إدارة منصة الأعمال الذكية.`
      }

      const response = await generateContentWithGeminiFlash(aiPrompt, {
        model: "gemini-2.0-flash-exp",
        temperature: 0.8,
        maxTokens: 2000,
      })

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.success ? response.data : "عذراً، لم أتمكن من معالجة هذا الطلب حالياً.",
        isUser: false,
        timestamp: new Date().toLocaleString("ar-SA"),
        type: "data",
        metadata: { actionType: action.action },
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error processing quick action:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = "ar-SA"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert("المتصفح لا يدعم التعرف على الصوت")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center space-x-2 space-x-reverse">
            <Bot className="h-8 w-8 text-blue-600" />
            <span>المساعد الذكي للمنصة</span>
          </h2>
          <p className="text-muted-foreground">مساعد ذكي متخصص في إدارة منصة الأعمال ومساعدة المدير في جميع المهام</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Badge variant="default" className="flex items-center space-x-1 space-x-reverse">
            <Brain className="h-3 w-3" />
            <span>Gemini Flash 2.0</span>
          </Badge>
          <Badge variant="secondary">متصل</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الإجراءات السريعة</CardTitle>
              <CardDescription>اختصارات للمهام الشائعة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 bg-transparent"
                    onClick={() => handleQuickAction(action)}
                    disabled={isLoading}
                  >
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <action.icon className="h-5 w-5 mt-0.5 text-blue-600" />
                      <div className="text-right">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>محادثة المساعد الذكي</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 ml-2" />
                    بحث في المحادثة
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 ml-2" />
                    إعدادات
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isUser
                            ? "bg-blue-600 text-white"
                            : message.type === "data"
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-100"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className={`text-xs mt-2 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-600">المساعد يفكر...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="اسأل المساعد الذكي عن أي شيء..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isLoading}
                      className="pr-12"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={handleVoiceInput}
                      disabled={isLoading || isListening}
                    >
                      <Mic className={`h-4 w-4 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Suggested Questions */}
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">أسئلة مقترحة:</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "ما هو أداء الحملات هذا الشهر؟",
                      "من هم العملاء الأكثر ربحية؟",
                      "كيف يمكنني تحسين معدل التحويل؟",
                      "ما هي التوصيات لزيادة الإيرادات؟",
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                        onClick={() => setInputMessage(question)}
                        disabled={isLoading}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Capabilities Overview */}
      <Card>
        <CardHeader>
          <CardTitle>قدرات المساعد الذكي</CardTitle>
          <CardDescription>ما يمكن للمساعد الذكي مساعدتك فيه</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, title: "تحليل البيانات", desc: "تحليل شامل للأداء والإحصائيات" },
              { icon: Users, title: "إدارة العملاء", desc: "متابعة العملاء وتحليل سلوكهم" },
              { icon: Target, title: "إدارة الحملات", desc: "تحسين وإدارة الحملات الإعلانية" },
              { icon: FileText, title: "إنشاء التقارير", desc: "تقارير مفصلة وتحليلات ذكية" },
              { icon: MessageSquare, title: "إدارة التواصل", desc: "تحسين التواصل مع العملاء" },
              { icon: Zap, title: "الأتمتة الذكية", desc: "أتمتة المهام والعمليات" },
              { icon: Search, title: "البحث والاستعلام", desc: "البحث في البيانات والمعلومات" },
              { icon: Lightbulb, title: "الاقتراحات الذكية", desc: "اقتراحات لتحسين الأداء" },
            ].map((capability, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <capability.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium mb-1">{capability.title}</h4>
                <p className="text-sm text-gray-600">{capability.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
