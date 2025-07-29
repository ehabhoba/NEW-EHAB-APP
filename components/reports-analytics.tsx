"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, DollarSign, Users, Target, Eye, Download } from "lucide-react"

// Mock data for analytics
const campaignPerformanceData = [
  { month: "يناير", impressions: 125000, clicks: 3200, conversions: 85, spend: 8500 },
  { month: "فبراير", impressions: 145000, clicks: 3800, conversions: 102, spend: 9200 },
  { month: "مارس", impressions: 165000, clicks: 4200, conversions: 118, spend: 10100 },
  { month: "أبريل", impressions: 180000, clicks: 4600, conversions: 135, spend: 11500 },
  { month: "مايو", impressions: 195000, clicks: 5100, conversions: 148, spend: 12800 },
  { month: "يونيو", impressions: 210000, clicks: 5500, conversions: 162, spend: 13200 },
]

const platformDistribution = [
  { name: "فيسبوك", value: 40, color: "#1877F2", campaigns: 12 },
  { name: "إنستغرام", value: 30, color: "#E4405F", campaigns: 8 },
  { name: "تيك توك", value: 20, color: "#000000", campaigns: 6 },
  { name: "يوتيوب", value: 10, color: "#FF0000", campaigns: 3 },
]

const clientPerformance = [
  { client: "شركة الأحلام", revenue: 45000, campaigns: 5, satisfaction: 95 },
  { client: "متجر الأناقة", revenue: 38000, campaigns: 4, satisfaction: 92 },
  { client: "مطعم الذوق", revenue: 28000, campaigns: 3, satisfaction: 88 },
  { client: "عيادة النور", revenue: 22000, campaigns: 2, satisfaction: 96 },
]

const revenueData = [
  { month: "يناير", revenue: 45000, profit: 18000 },
  { month: "فبراير", revenue: 52000, profit: 21000 },
  { month: "مارس", revenue: 61000, profit: 25000 },
  { month: "أبريل", revenue: 73000, profit: 29000 },
  { month: "مايو", revenue: 84000, profit: 34000 },
  { month: "يونيو", revenue: 95000, profit: 38000 },
]

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedClient, setSelectedClient] = useState("all")

  const calculateGrowth = (current: number, previous: number) => {
    return (((current - previous) / previous) * 100).toFixed(1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">التقارير والتحليلات</h2>
          <p className="text-muted-foreground">رؤى شاملة وتحليلات ذكية لأداء الأعمال</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">الشهر الماضي</SelectItem>
              <SelectItem value="3months">آخر 3 أشهر</SelectItem>
              <SelectItem value="6months">آخر 6 أشهر</SelectItem>
              <SelectItem value="1year">السنة الماضية</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">410,000 ر.س</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 ml-1" />+{calculateGrowth(95000, 84000)}% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.02M</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 ml-1" />+{calculateGrowth(210000, 195000)}% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.95%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 ml-1" />
              +0.3% تحسن
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رضا العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 ml-1" />
              +1% تحسن
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">أداء الحملات</TabsTrigger>
          <TabsTrigger value="clients">تحليل العملاء</TabsTrigger>
          <TabsTrigger value="revenue">التحليل المالي</TabsTrigger>
          <TabsTrigger value="predictions">التنبؤات الذكية</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>أداء الحملات الشهري</CardTitle>
                <CardDescription>مقارنة المشاهدات والنقرات والتحويلات</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="impressions"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="مشاهدات"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="نقرات"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع المنصات</CardTitle>
                <CardDescription>نسبة الحملات حسب المنصة</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل أداء المنصات</CardTitle>
              <CardDescription>إحصائيات مفصلة لكل منصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformDistribution.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: platform.color }} />
                      <div>
                        <h4 className="font-medium">{platform.name}</h4>
                        <p className="text-sm text-gray-600">{platform.campaigns} حملة نشطة</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold">{platform.value}%</div>
                      <div className="text-sm text-gray-500">من إجمالي الحملات</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>إيرادات العملاء</CardTitle>
                <CardDescription>مقارنة الإيرادات حسب العميل</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientPerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="client" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" name="الإيرادات (ر.س)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Client Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle>رضا العملاء</CardTitle>
                <CardDescription>معدل الرضا لكل عميل</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientPerformance.map((client, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{client.client}</span>
                        <span className="text-sm text-gray-600">{client.satisfaction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${client.satisfaction}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Client Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>أداء العملاء التفصيلي</CardTitle>
              <CardDescription>إحصائيات شاملة لكل عميل</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientPerformance.map((client, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{client.client}</h4>
                      <p className="text-sm text-gray-600">عميل نشط</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{formatCurrency(client.revenue)}</div>
                      <div className="text-sm text-gray-500">إجمالي الإيرادات</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{client.campaigns}</div>
                      <div className="text-sm text-gray-500">عدد الحملات</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{client.satisfaction}%</div>
                      <div className="text-sm text-gray-500">معدل الرضا</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>اتجاه الإيرادات</CardTitle>
                <CardDescription>نمو الإيرادات والأرباح الشهرية</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="الإيرادات" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="الأرباح" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>الملخص المالي</CardTitle>
                <CardDescription>نظرة عامة على الأداء المالي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">410,000 ر.س</div>
                      <div className="text-sm text-gray-600">إجمالي الإيرادات</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">165,000 ر.س</div>
                      <div className="text-sm text-gray-600">إجمالي الأرباح</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>هامش الربح</span>
                      <span className="font-bold text-green-600">40.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>متوسط قيمة العميل</span>
                      <span className="font-bold">33,250 ر.س</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>النمو الشهري</span>
                      <span className="font-bold text-green-600">+13.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <TrendingUp className="h-5 w-5" />
                  <span>التنبؤات الذكية</span>
                </CardTitle>
                <CardDescription>توقعات مدعومة بالذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">توقع الإيرادات للشهر القادم</h4>
                    <p className="text-2xl font-bold text-blue-600">108,000 ر.س</p>
                    <p className="text-sm text-blue-700">نمو متوقع +13.7%</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">أفضل منصة للاستثمار</h4>
                    <p className="text-lg font-bold text-green-600">إنستغرام</p>
                    <p className="text-sm text-green-700">عائد استثمار متوقع +24%</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">تحذير من انخفاض الأداء</h4>
                    <p className="text-lg font-bold text-yellow-600">حملة مطعم الذوق</p>
                    <p className="text-sm text-yellow-700">يحتاج تحسين الاستهداف</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>التوصيات الذكية</CardTitle>
                <CardDescription>اقتراحات لتحسين الأداء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "زيادة الاستثمار في إنستغرام",
                      description: "معدل التحويل أعلى بـ 23% من المتوسط",
                      priority: "high",
                      impact: "+15% إيرادات متوقعة",
                    },
                    {
                      title: "تحسين استهداف الجمهور",
                      description: "تحسين الاستهداف يمكن أن يقلل التكلفة بـ 18%",
                      priority: "medium",
                      impact: "-18% تكلفة الاكتساب",
                    },
                    {
                      title: "إطلاق حملات فيديو",
                      description: "الفيديوهات تحقق تفاعل أعلى بـ 35%",
                      priority: "medium",
                      impact: "+35% تفاعل",
                    },
                  ].map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>
                          {rec.priority === "high" ? "عالية" : "متوسطة"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <p className="text-sm font-medium text-green-600">{rec.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
