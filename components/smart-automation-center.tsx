"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  Zap,
  Plus,
  Trash2,
  Edit,
  Clock,
  Target,
  MessageSquare,
  BarChart3,
  Users,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import { createAutomationRule } from "@/lib/ai-services"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  condition: any
  action: string
  parameters: any
  isActive: boolean
  category: "campaigns" | "clients" | "reports" | "whatsapp" | "general"
  lastRun?: string
  runCount: number
  successRate: number
}

export function SmartAutomationCenter() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "إيقاف الحملات عند نفاد الميزانية",
      description: "إيقاف تلقائي للحملات عندما تصل إلى 95% من الميزانية المحددة",
      trigger: "budget_threshold",
      condition: { threshold: 95, metric: "budget_spent" },
      action: "pause_campaign",
      parameters: { notify_manager: true, send_whatsapp: true },
      isActive: true,
      category: "campaigns",
      lastRun: "2024-01-15 14:30",
      runCount: 12,
      successRate: 100,
    },
    {
      id: "2",
      name: "رسائل ترحيب تلقائية",
      description: "إرسال رسالة ترحيب عبر واتساب للعملاء الجدد خلال 5 دقائق من التسجيل",
      trigger: "new_client",
      condition: { delay_minutes: 5 },
      action: "send_whatsapp_welcome",
      parameters: { template: "welcome_egyptian", personalized: true },
      isActive: true,
      category: "whatsapp",
      lastRun: "2024-01-15 16:45",
      runCount: 28,
      successRate: 96,
    },
    {
      id: "3",
      name: "تقارير أداء أسبوعية",
      description: "إرسال تقرير أداء شامل للعملاء كل يوم أحد الساعة 9 صباحاً",
      trigger: "schedule",
      condition: { day: "sunday", time: "09:00", timezone: "Africa/Cairo" },
      action: "generate_send_report",
      parameters: { report_type: "weekly_performance", include_charts: true },
      isActive: true,
      category: "reports",
      lastRun: "2024-01-14 09:00",
      runCount: 8,
      successRate: 100,
    },
    {
      id: "4",
      name: "تنبيه انخفاض الأداء",
      description: "إرسال تنبيه عندما ينخفض معدل النقر للحملة تحت 1%",
      trigger: "performance_drop",
      condition: { metric: "ctr", threshold: 1, comparison: "less_than" },
      action: "send_alert",
      parameters: { alert_type: "performance_warning", suggest_optimization: true },
      isActive: true,
      category: "campaigns",
      lastRun: "2024-01-15 11:20",
      runCount: 5,
      successRate: 100,
    },
  ])

  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    trigger: "",
    action: "",
    category: "general" as const,
  })

  const [isCreatingRule, setIsCreatingRule] = useState(false)
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)

  const toggleRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)),
    )
  }

  const deleteRule = (ruleId: string) => {
    setAutomationRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const createNewRule = async () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) return

    setIsCreatingRule(true)

    try {
      const ruleAnalysis = await createAutomationRule(newRule.trigger, {}, newRule.action, {})

      const rule: AutomationRule = {
        id: Date.now().toString(),
        name: newRule.name,
        description: newRule.description,
        trigger: newRule.trigger,
        condition: {},
        action: newRule.action,
        parameters: {},
        isActive: false,
        category: newRule.category,
        runCount: 0,
        successRate: 0,
      }

      setAutomationRules((prev) => [...prev, rule])
      setNewRule({ name: "", description: "", trigger: "", action: "", category: "general" })
    } catch (error) {
      console.error("Error creating automation rule:", error)
    } finally {
      setIsCreatingRule(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "campaigns":
        return Target
      case "clients":
        return Users
      case "reports":
        return BarChart3
      case "whatsapp":
        return MessageSquare
      default:
        return Bot
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "campaigns":
        return "bg-blue-100 text-blue-800"
      case "clients":
        return "bg-green-100 text-green-800"
      case "reports":
        return "bg-purple-100 text-purple-800"
      case "whatsapp":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600"
    if (rate >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">مركز الأتمتة الذكية</h2>
          <p className="text-muted-foreground">إدارة وإنشاء قواعد الأتمتة لتحسين كفاءة العمل</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge variant="default" className="flex items-center space-x-1 space-x-reverse">
            <Bot className="h-3 w-3" />
            <span>{automationRules.filter((r) => r.isActive).length} قاعدة نشطة</span>
          </Badge>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            قاعدة جديدة
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القواعد</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationRules.length}</div>
            <p className="text-xs text-muted-foreground">{automationRules.filter((r) => r.isActive).length} نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(automationRules.reduce((acc, rule) => acc + rule.successRate, 0) / automationRules.length)}%
            </div>
            <p className="text-xs text-muted-foreground">متوسط عام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التشغيلات اليوم</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {automationRules.reduce((acc, rule) => acc + (rule.runCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">إجمالي التشغيلات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الوقت المُوفر</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">24</div>
            <p className="text-xs text-muted-foreground">ساعة أسبوعياً</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">قواعد الأتمتة</TabsTrigger>
          <TabsTrigger value="create">إنشاء قاعدة جديدة</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {automationRules.map((rule) => {
              const CategoryIcon = getCategoryIcon(rule.category)
              return (
                <Card key={rule.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 space-x-reverse flex-1">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <CategoryIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 space-x-reverse mb-2">
                            <h3 className="font-semibold text-lg">{rule.name}</h3>
                            <Badge className={getCategoryColor(rule.category)}>
                              {rule.category === "campaigns"
                                ? "حملات"
                                : rule.category === "clients"
                                  ? "عملاء"
                                  : rule.category === "reports"
                                    ? "تقارير"
                                    : rule.category === "whatsapp"
                                      ? "واتساب"
                                      : "عام"}
                            </Badge>
                            <Badge variant={rule.isActive ? "default" : "secondary"}>
                              {rule.isActive ? "نشط" : "متوقف"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{rule.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">آخر تشغيل:</span>
                              <div className="font-medium">{rule.lastRun || "لم يتم التشغيل"}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">عدد التشغيلات:</span>
                              <div className="font-medium">{rule.runCount}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">معدل النجاح:</span>
                              <div className={`font-medium ${getSuccessRateColor(rule.successRate)}`}>
                                {rule.successRate}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} />
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء قاعدة أتمتة جديدة</CardTitle>
              <CardDescription>أنشئ قاعدة أتمتة مخصصة لتحسين سير العمل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ruleName">اسم القاعدة</Label>
                    <Input
                      id="ruleName"
                      value={newRule.name}
                      onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="مثال: إرسال تقرير أداء يومي"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ruleDescription">الوصف</Label>
                    <Textarea
                      id="ruleDescription"
                      value={newRule.description}
                      onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف مفصل لما تفعله هذه القاعدة"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">الفئة</Label>
                    <Select
                      value={newRule.category}
                      onValueChange={(value: any) => setNewRule((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaigns">إدارة الحملات</SelectItem>
                        <SelectItem value="clients">إدارة العملاء</SelectItem>
                        <SelectItem value="reports">التقارير</SelectItem>
                        <SelectItem value="whatsapp">واتساب</SelectItem>
                        <SelectItem value="general">عام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="trigger">المحفز</Label>
                    <Select
                      value={newRule.trigger}
                      onValueChange={(value) => setNewRule((prev) => ({ ...prev, trigger: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المحفز" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="schedule">جدولة زمنية</SelectItem>
                        <SelectItem value="budget_threshold">حد الميزانية</SelectItem>
                        <SelectItem value="performance_drop">انخفاض الأداء</SelectItem>
                        <SelectItem value="new_client">عميل جديد</SelectItem>
                        <SelectItem value="campaign_end">انتهاء الحملة</SelectItem>
                        <SelectItem value="low_engagement">تفاعل منخفض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="action">الإجراء</Label>
                    <Select
                      value={newRule.action}
                      onValueChange={(value) => setNewRule((prev) => ({ ...prev, action: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الإجراء" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_whatsapp">إرسال رسالة واتساب</SelectItem>
                        <SelectItem value="pause_campaign">إيقاف الحملة</SelectItem>
                        <SelectItem value="send_email">إرسال إيميل</SelectItem>
                        <SelectItem value="generate_report">إنشاء تقرير</SelectItem>
                        <SelectItem value="send_alert">إرسال تنبيه</SelectItem>
                        <SelectItem value="adjust_budget">تعديل الميزانية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={createNewRule}
                    disabled={isCreatingRule || !newRule.name || !newRule.trigger || !newRule.action}
                    className="w-full"
                  >
                    {isCreatingRule ? (
                      <>
                        <Bot className="h-4 w-4 ml-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 ml-2" />
                        إنشاء القاعدة
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Pre-built Templates */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">قوالب جاهزة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "تنبيه نفاد الميزانية",
                      description: "تنبيه عند وصول الحملة لـ 90% من الميزانية",
                      trigger: "budget_threshold",
                      action: "send_alert",
                      category: "campaigns",
                    },
                    {
                      name: "ترحيب العملاء الجدد",
                      description: "رسالة ترحيب تلقائية للعملاء الجدد",
                      trigger: "new_client",
                      action: "send_whatsapp",
                      category: "whatsapp",
                    },
                    {
                      name: "تقرير أداء أسبوعي",
                      description: "إرسال تقرير أداء كل يوم أحد",
                      trigger: "schedule",
                      action: "generate_report",
                      category: "reports",
                    },
                  ].map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{template.name}</h5>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setNewRule({
                              name: template.name,
                              description: template.description,
                              trigger: template.trigger,
                              action: template.action,
                              category: template.category as any,
                            })
                          }
                        >
                          استخدام القالب
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>أداء قواعد الأتمتة</CardTitle>
                <CardDescription>معدل نجاح القواعد خلال الشهر الماضي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{rule.name}</span>
                          <span className="text-sm text-gray-600">{rule.successRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              rule.successRate >= 95
                                ? "bg-green-500"
                                : rule.successRate >= 80
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${rule.successRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع القواعد حسب الفئة</CardTitle>
                <CardDescription>عدد القواعد في كل فئة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    automationRules.reduce(
                      (acc, rule) => {
                        acc[rule.category] = (acc[rule.category] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([category, count]) => {
                    const CategoryIcon = getCategoryIcon(category)
                    return (
                      <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <CategoryIcon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">
                            {category === "campaigns"
                              ? "حملات"
                              : category === "clients"
                                ? "عملاء"
                                : category === "reports"
                                  ? "تقارير"
                                  : category === "whatsapp"
                                    ? "واتساب"
                                    : "عام"}
                          </span>
                        </div>
                        <Badge variant="secondary">{count} قاعدة</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
              <CardDescription>آخر تشغيلات قواعد الأتمتة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules
                  .filter((rule) => rule.lastRun)
                  .sort((a, b) => new Date(b.lastRun!).getTime() - new Date(a.lastRun!).getTime())
                  .slice(0, 5)
                  .map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-gray-600">تم التشغيل بنجاح</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{rule.lastRun}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
