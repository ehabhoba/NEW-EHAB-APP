"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Facebook,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  DollarSign,
  Settings,
  FolderSyncIcon as Sync,
} from "lucide-react"
import { getFacebookAdAccountData, createFacebookCampaign } from "@/lib/ai-services"

interface FacebookAdData {
  impressions: number
  clicks: number
  spend: number
  reach: number
  frequency: number
  cpm: number
  cpc: number
  ctr: number
  conversions: number
}

export function FacebookIntegration() {
  const [adAccountId, setAdAccountId] = useState("")
  const [selectedApp, setSelectedApp] = useState("monazem")
  const [adData, setAdData] = useState<FacebookAdData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")

  // New Campaign Creation State
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    objective: "CONVERSIONS",
    budget: "",
    adAccountId: "",
  })

  const connectToFacebook = async () => {
    setIsLoading(true)
    setConnectionStatus("connecting")

    try {
      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would handle OAuth flow
      setConnectionStatus("connected")
    } catch (error) {
      console.error("Facebook connection error:", error)
      setConnectionStatus("disconnected")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAdAccountData = async () => {
    if (!adAccountId) return

    setIsLoading(true)
    try {
      const result = await getFacebookAdAccountData(adAccountId, selectedApp)

      if (result.success && result.data && result.data.length > 0) {
        // Process the data from Facebook API
        const data = result.data[0] // Get first result
        setAdData({
          impressions: data.impressions || 0,
          clicks: data.clicks || 0,
          spend: Number.parseFloat(data.spend) || 0,
          reach: data.reach || 0,
          frequency: Number.parseFloat(data.frequency) || 0,
          cpm: Number.parseFloat(data.cpm) || 0,
          cpc: Number.parseFloat(data.cpc) || 0,
          ctr: Number.parseFloat(data.ctr) || 0,
          conversions: data.conversions || 0,
        })
      } else {
        // Mock data for demonstration
        setAdData({
          impressions: 125000,
          clicks: 3200,
          spend: 8500,
          reach: 95000,
          frequency: 1.32,
          cpm: 68,
          cpc: 2.66,
          ctr: 2.56,
          conversions: 85,
        })
      }
    } catch (error) {
      console.error("Error fetching ad data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createCampaign = async () => {
    if (!newCampaign.name || !newCampaign.adAccountId) return

    setIsLoading(true)
    try {
      const result = await createFacebookCampaign(
        {
          name: newCampaign.name,
          objective: newCampaign.objective,
          adAccountId: newCampaign.adAccountId,
        },
        selectedApp,
      )

      if (result.success) {
        // Campaign created successfully
        console.log("Campaign created:", result.data)
        setNewCampaign({ name: "", objective: "CONVERSIONS", budget: "", adAccountId: "" })
      } else {
        console.error("Campaign creation failed:", result.error)
      }
    } catch (error) {
      console.error("Campaign creation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = adData
    ? [
        { name: "المشاهدات", value: adData.impressions, color: "#1877F2" },
        { name: "النقرات", value: adData.clicks, color: "#42A5F5" },
        { name: "الوصول", value: adData.reach, color: "#66BB6A" },
        { name: "التحويلات", value: adData.conversions, color: "#FFA726" },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">تكامل فيسبوك للأعمال</h2>
          <p className="text-muted-foreground">ربط وإدارة حسابات فيسبوك الإعلانية</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge
            variant={connectionStatus === "connected" ? "default" : "secondary"}
            className="flex items-center space-x-1 space-x-reverse"
          >
            <Facebook className="h-3 w-3" />
            <span>{connectionStatus === "connected" ? "متصل" : "غير متصل"}</span>
          </Badge>
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر التطبيق" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monazem">Monazem-ehab</SelectItem>
              <SelectItem value="onlineServices">Online Services Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Facebook className="h-5 w-5" />
            <span>حالة الاتصال بفيسبوك</span>
          </CardTitle>
          <CardDescription>إدارة الاتصال مع Facebook Business API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div
                className={`w-3 h-3 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                }`}
              />
              <div>
                <p className="font-medium">
                  {connectionStatus === "connected"
                    ? "متصل بنجاح"
                    : connectionStatus === "connecting"
                      ? "جاري الاتصال..."
                      : "غير متصل"}
                </p>
                <p className="text-sm text-gray-600">
                  التطبيق المحدد: {selectedApp === "monazem" ? "Monazem-ehab" : "Online Services Free"}
                </p>
              </div>
            </div>
            <Button
              onClick={connectToFacebook}
              disabled={isLoading || connectionStatus === "connected"}
              variant={connectionStatus === "connected" ? "outline" : "default"}
            >
              {connectionStatus === "connecting" ? (
                <>
                  <Sync className="h-4 w-4 ml-2 animate-spin" />
                  جاري الاتصال...
                </>
              ) : connectionStatus === "connected" ? (
                <>
                  <Settings className="h-4 w-4 ml-2" />
                  إعادة الاتصال
                </>
              ) : (
                <>
                  <Facebook className="h-4 w-4 ml-2" />
                  الاتصال بفيسبوك
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">تحليلات الإعلانات</TabsTrigger>
          <TabsTrigger value="campaigns">إدارة الحملات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Ad Account Data Fetcher */}
          <Card>
            <CardHeader>
              <CardTitle>جلب بيانات الحساب الإعلاني</CardTitle>
              <CardDescription>أدخل معرف الحساب الإعلاني لجلب البيانات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4 space-x-reverse">
                <div className="flex-1">
                  <Label htmlFor="adAccountId">معرف الحساب الإعلاني</Label>
                  <Input
                    id="adAccountId"
                    value={adAccountId}
                    onChange={(e) => setAdAccountId(e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={fetchAdAccountData}
                    disabled={isLoading || !adAccountId || connectionStatus !== "connected"}
                  >
                    {isLoading ? (
                      <>
                        <Sync className="h-4 w-4 ml-2 animate-spin" />
                        جاري الجلب...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 ml-2" />
                        جلب البيانات
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          {adData && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">المشاهدات</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{adData.impressions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">إجمالي المشاهدات</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">النقرات</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{adData.clicks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">معدل النقر: {adData.ctr}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الإنفاق</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{adData.spend.toLocaleString()} ر.س</div>
                    <p className="text-xs text-muted-foreground">تكلفة النقرة: {adData.cpc} ر.س</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الوصول</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{adData.reach.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">التكرار: {adData.frequency}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>أداء الإعلانات</CardTitle>
                  <CardDescription>مقارنة المقاييس الرئيسية للأداء</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1877F2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Detailed Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>المقاييس التفصيلية</CardTitle>
                  <CardDescription>تحليل شامل لأداء الحملات الإعلانية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">تكلفة الألف مشاهدة (CPM)</span>
                        <span className="text-lg font-bold">{adData.cpm} ر.س</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">تكلفة النقرة (CPC)</span>
                        <span className="text-lg font-bold">{adData.cpc} ر.س</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">معدل النقر (CTR)</span>
                        <span className="text-lg font-bold">{adData.ctr}%</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">التحويلات</span>
                        <span className="text-lg font-bold">{adData.conversions}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">معدل التحويل</span>
                        <span className="text-lg font-bold">
                          {adData.clicks > 0 ? ((adData.conversions / adData.clicks) * 100).toFixed(2) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">التكرار</span>
                        <span className="text-lg font-bold">{adData.frequency}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Create New Campaign */}
          <Card>
            <CardHeader>
              <CardTitle>إنشاء حملة إعلانية جديدة</CardTitle>
              <CardDescription>إنشاء حملة جديدة على فيسبوك مباشرة من النظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="campaignName">اسم الحملة</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="أدخل اسم الحملة"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="campaignObjective">هدف الحملة</Label>
                  <Select
                    value={newCampaign.objective}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, objective: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الهدف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONVERSIONS">التحويلات</SelectItem>
                      <SelectItem value="TRAFFIC">زيادة الزيارات</SelectItem>
                      <SelectItem value="REACH">زيادة الوصول</SelectItem>
                      <SelectItem value="BRAND_AWARENESS">الوعي بالعلامة التجارية</SelectItem>
                      <SelectItem value="LEAD_GENERATION">جذب العملاء المحتملين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="campaignBudget">الميزانية اليومية (ر.س)</Label>
                  <Input
                    id="campaignBudget"
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="campaignAdAccount">معرف الحساب الإعلاني</Label>
                  <Input
                    id="campaignAdAccount"
                    value={newCampaign.adAccountId}
                    onChange={(e) => setNewCampaign({ ...newCampaign, adAccountId: e.target.value })}
                    placeholder="123456789"
                  />
                </div>
              </div>
              <Button
                onClick={createCampaign}
                disabled={
                  isLoading || !newCampaign.name || !newCampaign.adAccountId || connectionStatus !== "connected"
                }
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Sync className="h-4 w-4 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Facebook className="h-4 w-4 ml-2" />
                    إنشاء الحملة
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التكامل</CardTitle>
              <CardDescription>إدارة إعدادات الاتصال مع فيسبوك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>التطبيق المحدد</Label>
                  <Select value={selectedApp} onValueChange={setSelectedApp}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monazem">
                        <div className="flex flex-col">
                          <span>Monazem-ehab</span>
                          <span className="text-xs text-gray-500">App ID: 1459615555396584</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="onlineServices">
                        <div className="flex flex-col">
                          <span>Online Services Free</span>
                          <span className="text-xs text-gray-500">App ID: 1459615555396584</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">معلومات مهمة</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• تأكد من أن لديك صلاحيات الإدارة على الحساب الإعلاني</li>
                    <li>• يجب الموافقة على أذونات التطبيق في فيسبوك</li>
                    <li>• قد تحتاج إلى تجديد رمز الوصول بشكل دوري</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="font-medium">حالة الاتصال</p>
                    <p className="text-sm text-gray-600">
                      {connectionStatus === "connected" ? "متصل ويعمل بشكل طبيعي" : "غير متصل"}
                    </p>
                  </div>
                  <Button variant="outline" onClick={connectToFacebook} disabled={isLoading}>
                    <Settings className="h-4 w-4 ml-2" />
                    اختبار الاتصال
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
