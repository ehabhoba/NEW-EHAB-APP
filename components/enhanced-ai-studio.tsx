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
import { Progress } from "@/components/ui/progress"
import { Brain, Sparkles, MessageSquare, BarChart3, Target, Users, Zap, Download, Copy, RefreshCw } from "lucide-react"
import {
  generateContentWithGeminiFlash,
  generateSmartHashtags,
  generateAutoResponse,
  optimizeBudgetIntelligently,
  analyzeCompetitorsIntelligently,
} from "@/lib/ai-services"
import { AutoContentGenerator } from "@/components/auto-content-generator"

interface AITask {
  id: string
  type: "content" | "analysis" | "optimization" | "response" | "hashtags"
  title: string
  input: string
  output: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  createdAt: string
}

export function EnhancedAIStudio() {
  const [aiTasks, setAiTasks] = useState<AITask[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTask, setCurrentTask] = useState("")

  const [contentInput, setContentInput] = useState({
    type: "social_post",
    topic: "",
    tone: "friendly",
    platform: "facebook",
    keywords: "",
    length: "medium",
  })

  const [analysisInput, setAnalysisInput] = useState({
    type: "competitor",
    businessName: "",
    industry: "",
    competitors: "",
    focus: "strategy",
  })

  const [optimizationInput, setOptimizationInput] = useState({
    type: "budget",
    totalBudget: "",
    objectives: "",
    platforms: "",
    duration: "",
  })

  const executeAITask = async (taskType: string, input: any) => {
    const taskId = Date.now().toString()
    const newTask: AITask = {
      id: taskId,
      type: taskType as any,
      title: getTaskTitle(taskType),
      input: JSON.stringify(input),
      output: "",
      status: "processing",
      progress: 0,
      createdAt: new Date().toLocaleString("ar-SA"),
    }

    setAiTasks((prev) => [newTask, ...prev])
    setIsProcessing(true)
    setCurrentTask(taskId)

    try {
      let result: any = null
      const progress = 0

      // Update progress
      const updateProgress = (value: number) => {
        setAiTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, progress: value } : task)))
      }

      updateProgress(25)

      switch (taskType) {
        case "content":
          const contentPrompt = `
            أنشئ محتوى ${input.type} احترافي للسوق المصري:
            
            الموضوع: ${input.topic}
            النبرة: ${input.tone === "friendly" ? "ودودة" : input.tone === "professional" ? "مهنية" : "مرحة"}
            المنصة: ${input.platform}
            الكلمات المفتاحية: ${input.keywords}
            الطول: ${input.length === "short" ? "قصير (50-100 كلمة)" : input.length === "medium" ? "متوسط (100-200 كلمة)" : "طويل (200-300 كلمة)"}
            
            اكتب محتوى جذاب ومناسب للثقافة المصرية مع دعوة واضحة للعمل.
          `
          updateProgress(50)
          result = await generateContentWithGeminiFlash(contentPrompt, {
            model: "gemini-2.0-flash-exp",
            temperature: 0.8,
            maxTokens: 1500,
          })
          break

        case "analysis":
          updateProgress(50)
          if (input.type === "competitor") {
            result = await analyzeCompetitorsIntelligently(
              input.businessName,
              input.industry,
              input.competitors.split(",").map((c: string) => c.trim()),
            )
          }
          break

        case "optimization":
          updateProgress(50)
          if (input.type === "budget") {
            result = await optimizeBudgetIntelligently(
              Number.parseFloat(input.totalBudget),
              input.objectives.split(",").map((o: string) => o.trim()),
              input.platforms.split(",").map((p: string) => p.trim()),
              Number.parseInt(input.duration),
            )
          }
          break

        case "hashtags":
          updateProgress(50)
          result = await generateSmartHashtags(input.content, input.platform, input.industry, "مصر")
          break

        case "response":
          updateProgress(50)
          result = await generateAutoResponse(input.message, input.businessType, input.tone)
          break

        default:
          throw new Error("نوع مهمة غير مدعوم")
      }

      updateProgress(75)

      if (result && result.success) {
        updateProgress(100)
        setAiTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, output: result.data, status: "completed", progress: 100 } : task,
          ),
        )
      } else {
        throw new Error(result?.error || "فشل في تنفيذ المهمة")
      }
    } catch (error) {
      console.error("AI Task Error:", error)
      setAiTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: "error", output: "حدث خطأ في تنفيذ المهمة" } : task,
        ),
      )
    } finally {
      setIsProcessing(false)
      setCurrentTask("")
    }
  }

  const getTaskTitle = (taskType: string): string => {
    switch (taskType) {
      case "content":
        return "إنشاء محتوى"
      case "analysis":
        return "تحليل ذكي"
      case "optimization":
        return "تحسين الأداء"
      case "hashtags":
        return "إنشاء هاشتاغات"
      case "response":
        return "رد تلقائي"
      default:
        return "مهمة ذكية"
    }
  }

  const copyOutput = (output: string) => {
    navigator.clipboard.writeText(output)
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "content":
        return MessageSquare
      case "analysis":
        return BarChart3
      case "optimization":
        return Target
      case "hashtags":
        return Sparkles
      case "response":
        return Users
      default:
        return Brain
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">استوديو الذكاء الاصطناعي المتقدم</h2>
          <p className="text-muted-foreground">مجموعة شاملة من أدوات الذكاء الاصطناعي لتحسين أعمالك</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge variant="default" className="flex items-center space-x-1 space-x-reverse">
            <Brain className="h-3 w-3" />
            <span>Gemini Flash 2.0</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1 space-x-reverse">
            <Zap className="h-3 w-3" />
            <span>{aiTasks.length} مهمة منجزة</span>
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المهام المكتملة</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiTasks.filter((t) => t.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">مهمة ذكية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {aiTasks.length > 0
                ? Math.round((aiTasks.filter((t) => t.status === "completed").length / aiTasks.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">نسبة النجاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الوقت المُوفر</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{aiTasks.length * 15}</div>
            <p className="text-xs text-muted-foreground">دقيقة أسبوعياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المهام النشطة</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {aiTasks.filter((t) => t.status === "processing").length}
            </div>
            <p className="text-xs text-muted-foreground">قيد التنفيذ</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="content">إنشاء المحتوى</TabsTrigger>
          <TabsTrigger value="analysis">التحليل الذكي</TabsTrigger>
          <TabsTrigger value="optimization">التحسين</TabsTrigger>
          <TabsTrigger value="hashtags">الهاشتاغات</TabsTrigger>
          <TabsTrigger value="responses">الردود التلقائية</TabsTrigger>
          <TabsTrigger value="tasks">سجل المهام</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <AutoContentGenerator />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <BarChart3 className="h-5 w-5" />
                <span>التحليل الذكي</span>
              </CardTitle>
              <CardDescription>تحليل المنافسين والسوق بالذكاء الاصطناعي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="businessName">اسم النشاط التجاري</Label>
                    <Input
                      id="businessName"
                      value={analysisInput.businessName}
                      onChange={(e) => setAnalysisInput((prev) => ({ ...prev, businessName: e.target.value }))}
                      placeholder="اسم شركتك أو نشاطك"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="industry">المجال</Label>
                    <Select
                      value={analysisInput.industry}
                      onValueChange={(value) => setAnalysisInput((prev) => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المجال" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">مطاعم وكافيهات</SelectItem>
                        <SelectItem value="fashion">ملابس وأزياء</SelectItem>
                        <SelectItem value="electronics">إلكترونيات</SelectItem>
                        <SelectItem value="healthcare">رعاية صحية</SelectItem>
                        <SelectItem value="education">تعليم</SelectItem>
                        <SelectItem value="real_estate">عقارات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="competitors">المنافسين</Label>
                    <Textarea
                      id="competitors"
                      value={analysisInput.competitors}
                      onChange={(e) => setAnalysisInput((prev) => ({ ...prev, competitors: e.target.value }))}
                      placeholder="أسماء المنافسين مفصولة بفواصل"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="focus">نوع التحليل</Label>
                    <Select
                      value={analysisInput.focus}
                      onValueChange={(value) => setAnalysisInput((prev) => ({ ...prev, focus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع التحليل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strategy">تحليل الاستراتيجية</SelectItem>
                        <SelectItem value="content">تحليل المحتوى</SelectItem>
                        <SelectItem value="pricing">تحليل الأسعار</SelectItem>
                        <SelectItem value="audience">تحليل الجمهور</SelectItem>
                        <SelectItem value="performance">تحليل الأداء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => executeAITask("analysis", analysisInput)}
                    disabled={isProcessing || !analysisInput.businessName || !analysisInput.competitors}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                        جاري التحليل...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 ml-2" />
                        بدء التحليل الذكي
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Target className="h-5 w-5" />
                <span>تحسين الأداء</span>
              </CardTitle>
              <CardDescription>تحسين الميزانية والحملات بالذكاء الاصطناعي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="totalBudget">إجمالي الميزانية (ج.م)</Label>
                    <Input
                      id="totalBudget"
                      type="number"
                      value={optimizationInput.totalBudget}
                      onChange={(e) => setOptimizationInput((prev) => ({ ...prev, totalBudget: e.target.value }))}
                      placeholder="مثال: 10000"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="objectives">أهداف الحملة</Label>
                    <Textarea
                      id="objectives"
                      value={optimizationInput.objectives}
                      onChange={(e) => setOptimizationInput((prev) => ({ ...prev, objectives: e.target.value }))}
                      placeholder="مثال: زيادة المبيعات, تحسين الوعي بالعلامة التجارية"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="platforms">المنصات</Label>
                    <Input
                      id="platforms"
                      value={optimizationInput.platforms}
                      onChange={(e) => setOptimizationInput((prev) => ({ ...prev, platforms: e.target.value }))}
                      placeholder="مثال: فيسبوك, إنستغرام, جوجل"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="duration">مدة الحملة (أيام)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={optimizationInput.duration}
                      onChange={(e) => setOptimizationInput((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="مثال: 30"
                    />
                  </div>

                  <Button
                    onClick={() => executeAITask("optimization", optimizationInput)}
                    disabled={isProcessing || !optimizationInput.totalBudget}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                        جاري التحسين...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 ml-2" />
                        تحسين الميزانية
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Sparkles className="h-5 w-5" />
                <span>مولد الهاشتاغات الذكي</span>
              </CardTitle>
              <CardDescription>إنشاء هاشتاغات محسنة للسوق المصري</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hashtagContent">المحتوى</Label>
                    <Textarea id="hashtagContent" placeholder="اكتب المحتوى الذي تريد إنشاء هاشتاغات له" rows={4} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="hashtagPlatform">المنصة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنصة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">فيسبوك</SelectItem>
                        <SelectItem value="instagram">إنستغرام</SelectItem>
                        <SelectItem value="twitter">تويتر</SelectItem>
                        <SelectItem value="linkedin">لينكد إن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hashtagIndustry">المجال</Label>
                    <Input id="hashtagIndustry" placeholder="مثال: مطعم, متجر أزياء, عيادة" />
                  </div>

                  <Button disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 ml-2" />
                        إنشاء هاشتاغات ذكية
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Users className="h-5 w-5" />
                <span>مولد الردود التلقائية</span>
              </CardTitle>
              <CardDescription>إنشاء ردود احترافية لخدمة العملاء</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customerMessage">رسالة العميل</Label>
                    <Textarea id="customerMessage" placeholder="اكتب رسالة العميل التي تريد الرد عليها" rows={4} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="responseBusinessType">نوع النشاط</Label>
                    <Input id="responseBusinessType" placeholder="مثال: مطعم, متجر, عيادة" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="responseTone">نبرة الرد</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نبرة الرد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">ودودة</SelectItem>
                        <SelectItem value="professional">مهنية</SelectItem>
                        <SelectItem value="formal">رسمية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 ml-2" />
                        إنشاء رد تلقائي
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل المهام الذكية</CardTitle>
              <CardDescription>جميع المهام المنفذة بالذكاء الاصطناعي</CardDescription>
            </CardHeader>
            <CardContent>
              {aiTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد مهام بعد</h3>
                  <p className="text-gray-500">ابدأ بتنفيذ مهام ذكية لرؤية السجل هنا</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiTasks.map((task) => {
                    const TaskIcon = getTaskIcon(task.type)
                    return (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <div className="p-2 rounded-lg bg-blue-100">
                                <TaskIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-600">{task.createdAt}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === "completed"
                                ? "مكتمل"
                                : task.status === "processing"
                                  ? "قيد التنفيذ"
                                  : task.status === "error"
                                    ? "خطأ"
                                    : "في الانتظار"}
                            </Badge>
                          </div>

                          {task.status === "processing" && (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>التقدم</span>
                                <span>{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} className="h-2" />
                            </div>
                          )}

                          {task.output && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <p className="text-sm whitespace-pre-wrap line-clamp-3">{task.output}</p>
                            </div>
                          )}

                          {task.status === "completed" && (
                            <div className="flex justify-end space-x-2 space-x-reverse">
                              <Button size="sm" variant="outline" onClick={() => copyOutput(task.output)}>
                                <Copy className="h-4 w-4 ml-1" />
                                نسخ
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 ml-1" />
                                تحميل
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
