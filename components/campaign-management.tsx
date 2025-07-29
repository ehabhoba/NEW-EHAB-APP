"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, TrendingUp, Eye, DollarSign, Play, Pause, Settings, BarChart3 } from "lucide-react"

interface Campaign {
  id: string
  name: string
  client: string
  platform: string
  status: "active" | "paused" | "completed" | "draft"
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
  objective: string
  currency: string
  country: string
  createdAt: Date
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "حملة إطلاق المنتج الجديد",
    client: "شركة الأحلام",
    platform: "Facebook",
    status: "active",
    budget: 15000,
    spent: 8500,
    impressions: 125000,
    clicks: 3200,
    conversions: 85,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    objective: "زيادة المبيعات",
    currency: "EGP",
    country: "مصر",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "حملة الوعي بالعلامة التجارية",
    client: "متجر الأناقة",
    platform: "Instagram",
    status: "active",
    budget: 25000,
    spent: 12000,
    impressions: 200000,
    clicks: 5500,
    conversions: 120,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    objective: "زيادة الوعي",
    currency: "EGP",
    country: "مصر",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "حملة العروض الموسمية",
    client: "مطعم الذوق",
    platform: "TikTok",
    status: "paused",
    budget: 8000,
    spent: 3500,
    impressions: 75000,
    clicks: 1800,
    conversions: 45,
    startDate: "2024-01-20",
    endDate: "2024-02-05",
    objective: "زيادة الطلبات",
    currency: "EGP",
    country: "مصر",
    createdAt: new Date(),
  },
]

export function CampaignManagement() {
  // إزالة البيانات الوهمية
  const [campaigns, setCampaigns] = useState<Campaign[]>([]) // بدء بقائمة فارغة
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    client: "",
    platform: "",
    budget: "",
    objective: "",
    startDate: "",
    endDate: "",
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">نشطة</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">متوقفة</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">مكتملة</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">مسودة</Badge>
      default:
        return <Badge>غير محدد</Badge>
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return "📘"
      case "Instagram":
        return "📷"
      case "TikTok":
        return "🎵"
      case "YouTube":
        return "📺"
      default:
        return "🌐"
    }
  }

  const calculateCTR = (clicks: number, impressions: number) => {
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00"
  }

  const calculateCVR = (conversions: number, clicks: number) => {
    return clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : "0.00"
  }

  // تحديث دالة إنشاء الحملة لتستخدم بيانات حقيقية
  const handleCreateCampaign = async () => {
    try {
      const campaignData = {
        id: Date.now().toString(),
        name: newCampaign.name,
        client: newCampaign.client,
        platform: newCampaign.platform,
        status: "draft" as const,
        budget: Number.parseInt(newCampaign.budget),
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        objective: newCampaign.objective,
        currency: "EGP",
        country: "مصر",
        createdAt: new Date(),
      }

      // في التطبيق الحقيقي، سيتم حفظ البيانات في Firebase
      // await addDoc(collection(db, "campaigns"), campaignData)

      setCampaigns([...campaigns, campaignData])
      setNewCampaign({
        name: "",
        client: "",
        platform: "",
        budget: "",
        objective: "",
        startDate: "",
        endDate: "",
      })
      setIsCreateDialogOpen(false)

      // إنشاء اقتراحات الحملة بالذكاء الاصطناعي
      await generateCampaignSuggestions(campaignData)
    } catch (error) {
      console.error("خطأ في إنشاء الحملة:", error)
    }
  }

  // تحديث اقتراحات الحملة للسوق المصري
  const generateCampaignSuggestions = async (campaign: Campaign) => {
    console.log("إنشاء اقتراحات ذكية للحملة:", campaign.name)

    const suggestions = {
      audienceTargeting: [
        "الفئة العمرية: 18-45 سنة",
        "الاهتمامات: التسوق الإلكتروني، المنتجات المحلية",
        "الموقع الجغرافي: مصر (القاهرة، الجيزة، الإسكندرية)",
        "السلوك: متسوقون نشطون، مهتمون بالعروض والخصومات",
        "اللغة: العربية",
        "الجهاز: موبايل (85%)، كمبيوتر (15%)",
      ],
      budgetDistribution: {
        facebook: 45, // فيسبوك الأكثر استخداماً في مصر
        instagram: 30,
        youtube: 15,
        google: 10,
      },
      adCopyVariations: [
        "اكتشف أحدث العروض والخصومات الحصرية! 🔥 توصيل مجاني لجميع أنحاء مصر",
        "عروض محدودة الوقت - وفر حتى 50%! 💰 اطلب الآن وادفع عند الاستلام",
        "منتجات عالية الجودة بأسعار لا تُقاوم! ✨ خدمة عملاء 24/7",
      ],
      bestTimes: [
        "الأحد - الخميس: 7-10 مساءً",
        "الجمعة - السبت: 2-5 عصراً و 8-11 مساءً",
        "رمضان: 9-12 مساءً (بعد الإفطار)",
      ],
      egyptianHolidays: [
        "عيد الفطر",
        "عيد الأضحى",
        "رأس السنة الهجرية",
        "المولد النبوي",
        "عيد الأم",
        "شم النسيم",
        "عيد العمال",
      ],
    }

    console.log("اقتراحات الحملة للسوق المصري:", suggestions)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة الحملات</h2>
          <p className="text-muted-foreground">إدارة ومتابعة جميع الحملات الإعلانية بذكاء اصطناعي</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء حملة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء حملة إعلانية جديدة</DialogTitle>
              <DialogDescription>أدخل بيانات الحملة وسيقوم الذكاء الاصطناعي بتقديم اقتراحات محسنة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="client">العميل</Label>
                <Select
                  value={newCampaign.client}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, client: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="شركة الأحلام">شركة الأحلام</SelectItem>
                    <SelectItem value="متجر الأناقة">متجر الأناقة</SelectItem>
                    <SelectItem value="مطعم الذوق">مطعم الذوق</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform">المنصة</Label>
                <Select
                  value={newCampaign.platform}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budget">الميزانية (ر.س)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                    placeholder="15000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="objective">الهدف</Label>
                  <Select
                    value={newCampaign.objective}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, objective: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الهدف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="زيادة المبيعات">زيادة المبيعات</SelectItem>
                      <SelectItem value="زيادة الوعي">زيادة الوعي</SelectItem>
                      <SelectItem value="جذب العملاء">جذب العملاء</SelectItem>
                      <SelectItem value="زيادة التفاعل">زيادة التفاعل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">تاريخ البداية</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">تاريخ النهاية</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateCampaign}>إنشاء الحملة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحملات النشطة</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">من إجمالي {campaigns.length} حملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإنفاق</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* تحديث عرض المبالغ بالجنيه المصري */}
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              من إجمالي {campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()} ر.س
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">عبر جميع المنصات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateCVR(
                campaigns.reduce((sum, c) => sum + c.conversions, 0),
                campaigns.reduce((sum, c) => sum + c.clicks, 0),
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">متوسط عام</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-2xl">{getPlatformIcon(campaign.platform)}</span>
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription>
                      {campaign.client} • {campaign.platform}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(campaign.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>الميزانية المستخدمة</span>
                    <span>
                      {campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()} ر.س
                    </span>
                  </div>
                  <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{campaign.impressions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">مشاهدات</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{campaign.clicks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">نقرات</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{campaign.conversions}</div>
                    <div className="text-xs text-gray-500">تحويلات</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-3 border-t">
                  <div className="flex space-x-2 space-x-reverse">
                    {campaign.status === "active" ? (
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 ml-1" />
                        إيقاف
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 ml-1" />
                        تشغيل
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                  </div>
                  <Button size="sm">
                    <BarChart3 className="h-4 w-4 ml-1" />
                    التقرير
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Details Dialog */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="sm:max-w-[700px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3 space-x-reverse">
                <span className="text-2xl">{getPlatformIcon(selectedCampaign.platform)}</span>
                <span>{selectedCampaign.name}</span>
              </DialogTitle>
              <DialogDescription>تفاصيل شاملة عن أداء الحملة والإحصائيات</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="performance">الأداء</TabsTrigger>
                <TabsTrigger value="settings">الإعدادات</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">العميل</Label>
                    <p className="text-sm text-gray-600">{selectedCampaign.client}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">الهدف</Label>
                    <p className="text-sm text-gray-600">{selectedCampaign.objective}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">تاريخ البداية</Label>
                    <p className="text-sm text-gray-600">{selectedCampaign.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">تاريخ النهاية</Label>
                    <p className="text-sm text-gray-600">{selectedCampaign.endDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedCampaign.impressions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">مشاهدات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedCampaign.clicks.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">نقرات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedCampaign.conversions}</div>
                    <div className="text-sm text-gray-500">تحويلات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {calculateCTR(selectedCampaign.clicks, selectedCampaign.impressions)}%
                    </div>
                    <div className="text-sm text-gray-500">معدل النقر</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">سيتم عرض الرسوم البيانية التفصيلية هنا</p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">إعدادات الحملة والتحكم المتقدم</p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
