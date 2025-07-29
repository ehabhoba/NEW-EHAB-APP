"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Settings,
  Search,
  Bot,
  Zap,
  Brain,
  Lightbulb,
  MessageSquare,
} from "lucide-react"
import { ClientManagement } from "@/components/client-management"
import { CampaignManagement } from "@/components/campaign-management"
import { ProjectManagement } from "@/components/project-management"
import { ReportsAnalytics } from "@/components/reports-analytics"
import { NotificationCenter } from "@/components/notification-center"
import { ClientPortal } from "@/components/client-portal"
import { EnhancedAIStudio } from "@/components/enhanced-ai-studio"
import { FacebookIntegration } from "@/components/facebook-integration"
import { EnhancedWhatsAppIntegration } from "@/components/enhanced-whatsapp-integration"
import { SmartAutomationCenter } from "@/components/smart-automation-center"
import { IntelligentSuggestions } from "@/components/intelligent-suggestions"
import { AIPlatformAssistant } from "@/components/ai-platform-assistant"

export default function Dashboard() {
  const [campaignData, setCampaignData] = useState([]) // بيانات فارغة
  const [platformData, setPlatformData] = useState([]) // بيانات فارغة
  const [activeTab, setActiveTab] = useState("dashboard")
  const [notifications, setNotifications] = useState([
    { id: 1, type: "success", message: "تم إطلاق حملة جديدة بنجاح", time: "5 دقائق" },
    { id: 2, type: "warning", message: "يتطلب موافقة العميل على التصميم", time: "15 دقيقة" },
    { id: 3, type: "info", message: "تقرير أداء الحملة جاهز", time: "30 دقيقة" },
  ])

  const [recentActivities, setRecentActivities] = useState([]) // بيانات فارغة

  // Smart Dashboard Stats
  const [smartStats, setSmartStats] = useState({
    aiSuggestions: 12,
    automationRules: 8,
    contentGenerated: 45,
    timeSaved: 24,
    whatsappMessages: 156,
    aiAssistantQueries: 89,
  })

  return (
    <div className="min-h-screen bg-gray-50 rtl" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-2xl font-bold text-gray-900">منظم الأعمال الذكي</h1>
              <Badge variant="secondary">نسخة متقدمة</Badge>
              <Badge variant="outline" className="flex items-center space-x-1 space-x-reverse">
                <Bot className="h-3 w-3" />
                <span>مدعوم بـ AI</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1 space-x-reverse">
                <MessageSquare className="h-3 w-3" />
                <span>واتساب متقدم</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 ml-2" />
                بحث ذكي
              </Button>
              <NotificationCenter notifications={notifications} />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-12">
              <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
              <TabsTrigger value="clients">إدارة العملاء</TabsTrigger>
              <TabsTrigger value="campaigns">إدارة الحملات</TabsTrigger>
              <TabsTrigger value="projects">إدارة المشاريع</TabsTrigger>
              <TabsTrigger value="ai-studio">استوديو الذكاء الاصطناعي</TabsTrigger>
              <TabsTrigger value="automation">الأتمتة الذكية</TabsTrigger>
              <TabsTrigger value="suggestions">الاقتراحات الذكية</TabsTrigger>
              <TabsTrigger value="reports">التقارير والتحليلات</TabsTrigger>
              <TabsTrigger value="facebook">تكامل فيسبوك</TabsTrigger>
              <TabsTrigger value="whatsapp">واتساب المتقدم</TabsTrigger>
              <TabsTrigger value="ai-assistant">المساعد الذكي</TabsTrigger>
              <TabsTrigger value="client-portal">بوابة العميل</TabsTrigger>
            </TabsList>

            {/* Dashboard Content */}
            <TabsContent value="dashboard" className="mt-6">
              {/* Enhanced Stats with AI Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الحملات النشطة</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">28</div>
                    <p className="text-xs text-muted-foreground">+5 حملات جديدة</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">95,000 ج.م</div>
                    <p className="text-xs text-muted-foreground">+18% من الشهر الماضي</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">معدل الرضا</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-muted-foreground">+2% تحسن</p>
                  </CardContent>
                </Card>
              </div>

              {/* AI-Powered Features Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الاقتراحات الذكية</CardTitle>
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{smartStats.aiSuggestions}</div>
                    <p className="text-xs text-muted-foreground">اقتراح جديد</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">قواعد الأتمتة</CardTitle>
                    <Bot className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{smartStats.automationRules}</div>
                    <p className="text-xs text-muted-foreground">قاعدة نشطة</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">المحتوى المُنشأ</CardTitle>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{smartStats.contentGenerated}</div>
                    <p className="text-xs text-muted-foreground">قطعة محتوى</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الوقت المُوفر</CardTitle>
                    <Zap className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{smartStats.timeSaved}</div>
                    <p className="text-xs text-muted-foreground">ساعة أسبوعياً</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">رسائل واتساب</CardTitle>
                    <MessageSquare className="h-4 w-4 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-600">{smartStats.whatsappMessages}</div>
                    <p className="text-xs text-muted-foreground">رسالة هذا الشهر</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">استفسارات المساعد</CardTitle>
                    <Bot className="h-4 w-4 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">{smartStats.aiAssistantQueries}</div>
                    <p className="text-xs text-muted-foreground">استفسار هذا الأسبوع</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>أداء الحملات الشهرية</CardTitle>
                    <CardDescription>عدد الحملات والإيرادات خلال الأشهر الماضية</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={campaignData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="campaigns" fill="#3b82f6" name="عدد الحملات" />
                        <Bar dataKey="revenue" fill="#10b981" name="الإيرادات" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>توزيع المنصات</CardTitle>
                    <CardDescription>نسبة الحملات حسب المنصة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* AI-Powered Quick Actions */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Brain className="h-5 w-5" />
                    <span>الإجراءات الذكية السريعة</span>
                  </CardTitle>
                  <CardDescription>إجراءات مدعومة بالذكاء الاصطناعي لتحسين أداءك</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                      <Lightbulb className="h-6 w-6" />
                      <span className="text-sm">اقتراحات ذكية</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                      <Bot className="h-6 w-6" />
                      <span className="text-sm">أتمتة المهام</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                      <Brain className="h-6 w-6" />
                      <span className="text-sm">إنشاء محتوى</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                      <MessageSquare className="h-6 w-6" />
                      <span className="text-sm">واتساب ذكي</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>الأنشطة الأخيرة</CardTitle>
                  <CardDescription>آخر التحديثات والأنشطة في النظام</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">لا توجد أنشطة حتى الآن</p>
                      <p className="text-sm text-gray-400">ابدأ بإضافة عملاء وحملات لرؤية الأنشطة هنا</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { action: "تم إنشاء حملة جديدة", client: "شركة الأحلام", time: "5 دقائق", status: "success" },
                        { action: "تم تسليم التصميم", client: "متجر الأناقة", time: "15 دقيقة", status: "info" },
                        {
                          action: "في انتظار موافقة العميل",
                          client: "مطعم الذوق",
                          time: "30 دقيقة",
                          status: "warning",
                        },
                        { action: "تم إكمال المشروع", client: "عيادة النور", time: "1 ساعة", status: "success" },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.status === "success"
                                  ? "bg-green-500"
                                  : activity.status === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}
                            />
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-600">{activity.client}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <ClientManagement />
            </TabsContent>

            <TabsContent value="campaigns">
              <CampaignManagement />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectManagement />
            </TabsContent>

            <TabsContent value="ai-studio">
              <EnhancedAIStudio />
            </TabsContent>

            <TabsContent value="automation">
              <SmartAutomationCenter />
            </TabsContent>

            <TabsContent value="suggestions">
              <IntelligentSuggestions />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsAnalytics />
            </TabsContent>

            <TabsContent value="facebook">
              <FacebookIntegration />
            </TabsContent>

            <TabsContent value="whatsapp">
              <EnhancedWhatsAppIntegration />
            </TabsContent>

            <TabsContent value="ai-assistant">
              <AIPlatformAssistant />
            </TabsContent>

            <TabsContent value="client-portal">
              <ClientPortal />
            </TabsContent>
          </Tabs>
        </div>
      </nav>
    </div>
  )
}
