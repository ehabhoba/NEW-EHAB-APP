"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Clock,
  Brain,
  Zap,
  CheckCircle,
  X,
  RefreshCw,
  Star,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import { generateSmartSuggestions } from "@/lib/ai-services"

interface Suggestion {
  id: string
  title: string
  description: string
  category: "campaign" | "content" | "audience" | "budget" | "timing"
  priority: "high" | "medium" | "low"
  impact: "high" | "medium" | "low"
  effort: "low" | "medium" | "high"
  confidence: number
  estimatedROI?: string
  timeToImplement?: string
  steps: string[]
  isImplemented: boolean
  createdAt: string
}

export function IntelligentSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      title: "زيادة الاستثمار في إعلانات إنستغرام",
      description: "تحليل البيانات يظهر أن إعلانات إنستغرام تحقق معدل تحويل أعلى بـ 23% من فيسبوك للجمهور المصري",
      category: "campaign",
      priority: "high",
      impact: "high",
      effort: "low",
      confidence: 92,
      estimatedROI: "+15% زيادة في الإيرادات",
      timeToImplement: "3-5 أيام",
      steps: [
        "تحليل أداء الحملات الحالية على إنستغرام",
        "زيادة ميزانية إنستغرام بنسبة 30%",
        "إنشاء محتوى بصري جذاب للمنصة",
        "مراقبة الأداء وتحسين الاستهداف",
      ],
      isImplemented: false,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "تحسين أوقات النشر للجمهور المصري",
      description: "البيانات تشير إلى أن النشر بين 7-9 مساءً يحقق تفاعل أعلى بـ 40% في مصر",
      category: "timing",
      priority: "medium",
      impact: "medium",
      effort: "low",
      confidence: 88,
      estimatedROI: "+25% زيادة في التفاعل",
      timeToImplement: "1-2 أيام",
      steps: [
        "تحليل أوقات تفاعل الجمهور المصري",
        "إعادة جدولة المنشورات للأوقات المثلى",
        "اختبار أوقات مختلفة لمدة أسبوع",
        "تطبيق الجدولة الجديدة على جميع الحسابات",
      ],
      isImplemented: false,
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      title: "إطلاق حملة فيديو للمنتجات الأكثر مبيعاً",
      description: "الفيديوهات تحقق معدل مشاهدة أعلى بـ 35% وتكلفة أقل بـ 18% للوصول في السوق المصري",
      category: "content",
      priority: "high",
      impact: "high",
      effort: "medium",
      confidence: 85,
      estimatedROI: "+30% زيادة في المبيعات",
      timeToImplement: "1-2 أسابيع",
      steps: [
        "تحديد المنتجات الأكثر مبيعاً",
        "إنتاج فيديوهات قصيرة وجذابة",
        "إنشاء حملة فيديو متعددة المنصات",
        "تحسين الاستهداف للجمهور المهتم",
      ],
      isImplemented: false,
      createdAt: "2024-01-14",
    },
  ])

  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const generateNewSuggestions = async (category: string) => {
    setIsGenerating(true)

    try {
      const context = "منصة تسويق رقمي تخدم العملاء في مصر مع التركيز على فيسبوك وإنستغرام وواتساب"
      const result = await generateSmartSuggestions(context, category as any)

      if (result.success) {
        // Parse AI response and create suggestions
        const newSuggestion: Suggestion = {
          id: Date.now().toString(),
          title: `اقتراح ذكي جديد - ${category}`,
          description: result.data.substring(0, 200) + "...",
          category: category as any,
          priority: "medium",
          impact: "medium",
          effort: "medium",
          confidence: Math.floor(Math.random() * 20) + 80,
          estimatedROI: "+10-20% تحسن متوقع",
          timeToImplement: "3-7 أيام",
          steps: result.data
            .split("\n")
            .filter((line) => line.trim().startsWith("-"))
            .slice(0, 4),
          isImplemented: false,
          createdAt: new Date().toISOString().split("T")[0],
        }

        setSuggestions((prev) => [newSuggestion, ...prev])
      }
    } catch (error) {
      console.error("Error generating suggestions:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const implementSuggestion = (suggestionId: string) => {
    setSuggestions((prev) =>
      prev.map((suggestion) => (suggestion.id === suggestionId ? { ...suggestion, isImplemented: true } : suggestion)),
    )
  }

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions((prev) => prev.filter((suggestion) => suggestion.id !== suggestionId))
  }

  const filteredSuggestions =
    selectedCategory === "all" ? suggestions : suggestions.filter((s) => s.category === selectedCategory)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "medium":
        return <BarChart3 className="h-4 w-4 text-yellow-600" />
      case "low":
        return <Target className="h-4 w-4 text-gray-600" />
      default:
        return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "campaign":
        return Target
      case "content":
        return MessageSquare
      case "audience":
        return Users
      case "budget":
        return DollarSign
      case "timing":
        return Clock
      default:
        return Lightbulb
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "campaign":
        return "حملات"
      case "content":
        return "محتوى"
      case "audience":
        return "جمهور"
      case "budget":
        return "ميزانية"
      case "timing":
        return "توقيت"
      default:
        return "عام"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الاقتراحات الذكية</h2>
          <p className="text-muted-foreground">اقتراحات مدعومة بالذكاء الاصطناعي لتحسين أداء أعمالك</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge variant="default" className="flex items-center space-x-1 space-x-reverse">
            <Brain className="h-3 w-3" />
            <span>{suggestions.filter((s) => !s.isImplemented).length} اقتراح جديد</span>
          </Badge>
          <Button onClick={() => generateNewSuggestions("campaign")} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 ml-2" />
                اقتراحات جديدة
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاقتراحات</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestions.length}</div>
            <p className="text-xs text-muted-foreground">
              {suggestions.filter((s) => !s.isImplemented).length} غير مطبق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التطبيق</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((suggestions.filter((s) => s.isImplemented).length / suggestions.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">من الاقتراحات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الثقة</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)}%
            </div>
            <p className="text-xs text-muted-foreground">ثقة الذكاء الاصطناعي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التأثير المتوقع</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {suggestions.filter((s) => s.impact === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">اقتراح عالي التأثير</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">جميع الاقتراحات</TabsTrigger>
          <TabsTrigger value="campaign">حملات</TabsTrigger>
          <TabsTrigger value="content">محتوى</TabsTrigger>
          <TabsTrigger value="audience">جمهور</TabsTrigger>
          <TabsTrigger value="budget">ميزانية</TabsTrigger>
          <TabsTrigger value="timing">توقيت</TabsTrigger>
        </TabsList>

        {["all", "campaign", "content", "audience", "budget", "timing"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {category === "all" ? "جميع الاقتراحات" : `اقتراحات ${getCategoryLabel(category)}`}
              </h3>
              <Button
                variant="outline"
                onClick={() => generateNewSuggestions(category === "all" ? "campaign" : category)}
                disabled={isGenerating}
              >
                <Zap className="h-4 w-4 ml-2" />
                اقتراحات جديدة
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {(category === "all" ? suggestions : suggestions.filter((s) => s.category === category)).map(
                (suggestion) => {
                  const CategoryIcon = getCategoryIcon(suggestion.category)
                  return (
                    <Card
                      key={suggestion.id}
                      className={`hover:shadow-lg transition-shadow ${suggestion.isImplemented ? "opacity-75" : ""}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 space-x-reverse flex-1">
                            <div className="p-2 rounded-lg bg-blue-100">
                              <CategoryIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 space-x-reverse mb-2">
                                <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                                <Badge className={getPriorityColor(suggestion.priority)}>
                                  {suggestion.priority === "high"
                                    ? "عالي"
                                    : suggestion.priority === "medium"
                                      ? "متوسط"
                                      : "منخفض"}
                                </Badge>
                                {suggestion.isImplemented && (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 ml-1" />
                                    مطبق
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mb-4">{suggestion.description}</p>

                              {/* Metrics */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  {getImpactIcon(suggestion.impact)}
                                  <div>
                                    <div className="text-sm font-medium">التأثير</div>
                                    <div className="text-xs text-gray-600">
                                      {suggestion.impact === "high"
                                        ? "عالي"
                                        : suggestion.impact === "medium"
                                          ? "متوسط"
                                          : "منخفض"}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <div className="text-sm font-medium">الجهد</div>
                                    <div className="text-xs text-gray-600">
                                      {suggestion.effort === "low"
                                        ? "قليل"
                                        : suggestion.effort === "medium"
                                          ? "متوسط"
                                          : "كبير"}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Star className="h-4 w-4 text-yellow-600" />
                                  <div>
                                    <div className="text-sm font-medium">الثقة</div>
                                    <div className="text-xs text-gray-600">{suggestion.confidence}%</div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                  <div>
                                    <div className="text-sm font-medium">العائد المتوقع</div>
                                    <div className="text-xs text-gray-600">{suggestion.estimatedROI}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Implementation Steps */}
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">خطوات التطبيق:</h4>
                                <ul className="space-y-1">
                                  {suggestion.steps.map((step, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-start">
                                      <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mt-0.5 ml-2 flex-shrink-0">
                                        {index + 1}
                                      </span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2">
                            {!suggestion.isImplemented ? (
                              <>
                                <Button
                                  onClick={() => implementSuggestion(suggestion.id)}
                                  className="whitespace-nowrap"
                                >
                                  <CheckCircle className="h-4 w-4 ml-2" />
                                  تطبيق
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => dismissSuggestion(suggestion.id)}
                                  className="whitespace-nowrap"
                                >
                                  <X className="h-4 w-4 ml-2" />
                                  تجاهل
                                </Button>
                              </>
                            ) : (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                تم التطبيق
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                },
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
