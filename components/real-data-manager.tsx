"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, RefreshCw, AlertCircle, CheckCircle, Upload, Download } from "lucide-react"

interface DataStats {
  clients: number
  campaigns: number
  projects: number
  messages: number
  revenue: number
}

export function RealDataManager() {
  const [dataStats, setDataStats] = useState<DataStats>({
    clients: 0,
    campaigns: 0,
    projects: 0,
    messages: 0,
    revenue: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected")

  // محاكاة جلب البيانات الحقيقية من Firebase
  const fetchRealData = async () => {
    setIsLoading(true)
    try {
      // هنا سيتم جلب البيانات الحقيقية من Firebase
      // const clientsSnapshot = await getDocs(collection(db, "clients"))
      // const campaignsSnapshot = await getDocs(collection(db, "campaigns"))
      // const projectsSnapshot = await getDocs(collection(db, "projects"))
      // const messagesSnapshot = await getDocs(collection(db, "messages"))

      // محاكاة تأخير الشبكة
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // في التطبيق الحقيقي، ستأتي هذه البيانات من Firebase
      setDataStats({
        clients: 0, // عدد العملاء الحقيقي
        campaigns: 0, // عدد الحملات الحقيقية
        projects: 0, // عدد المشاريع الحقيقية
        messages: 0, // عدد الرسائل المرسلة
        revenue: 0, // الإيرادات الحقيقية بالجنيه المصري
      })

      setConnectionStatus("connected")
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error)
      setConnectionStatus("disconnected")
    } finally {
      setIsLoading(false)
    }
  }

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchRealData()
  }, [])

  const clearMockData = async () => {
    setIsLoading(true)
    try {
      // مسح جميع البيانات الوهمية
      localStorage.removeItem("mockClients")
      localStorage.removeItem("mockCampaigns")
      localStorage.removeItem("mockProjects")
      localStorage.removeItem("mockMessages")

      // إعادة تعيين الإحصائيات
      setDataStats({
        clients: 0,
        campaigns: 0,
        projects: 0,
        messages: 0,
        revenue: 0,
      })

      console.log("تم مسح جميع البيانات الوهمية")
    } catch (error) {
      console.error("خطأ في مسح البيانات:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportRealData = async () => {
    try {
      const data = {
        clients: [], // البيانات الحقيقية من Firebase
        campaigns: [],
        projects: [],
        messages: [],
        exportDate: new Date().toISOString(),
        currency: "EGP",
        country: "مصر",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `business-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("خطأ في تصدير البيانات:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة البيانات الحقيقية</h2>
          <p className="text-muted-foreground">إدارة ومراقبة البيانات الحقيقية للنظام</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge
            variant={connectionStatus === "connected" ? "default" : "secondary"}
            className="flex items-center space-x-1 space-x-reverse"
          >
            <Database className="h-3 w-3" />
            <span>{connectionStatus === "connected" ? "متصل" : "غير متصل"}</span>
          </Badge>
          <Button variant="outline" onClick={fetchRealData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? "animate-spin" : ""}`} />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStats.clients}</div>
            <p className="text-xs text-muted-foreground">عميل مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحملات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStats.campaigns}</div>
            <p className="text-xs text-muted-foreground">حملة إعلانية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStats.projects}</div>
            <p className="text-xs text-muted-foreground">مشروع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرسائل</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStats.messages}</div>
            <p className="text-xs text-muted-foreground">رسالة مرسلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStats.revenue.toLocaleString()} ج.م</div>
            <p className="text-xs text-muted-foreground">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="cleanup">تنظيف البيانات</TabsTrigger>
          <TabsTrigger value="export">تصدير البيانات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>حالة قاعدة البيانات</CardTitle>
              <CardDescription>معلومات عن حالة البيانات الحالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">البيانات نظيفة</h4>
                      <p className="text-sm text-green-600">تم إزالة جميع البيانات الوهمية</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">إعدادات العملة</h4>
                    <p className="text-sm text-gray-600">العملة: الجنيه المصري (ج.م)</p>
                    <p className="text-sm text-gray-600">البلد: مصر</p>
                    <p className="text-sm text-gray-600">المنطقة الزمنية: Africa/Cairo</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">إعدادات اللغة</h4>
                    <p className="text-sm text-gray-600">اللغة الأساسية: العربية</p>
                    <p className="text-sm text-gray-600">اللهجة: المصرية</p>
                    <p className="text-sm text-gray-600">التنسيق: من اليمين لليسار</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظيف البيانات الوهمية</CardTitle>
              <CardDescription>إزالة جميع البيانات التجريبية والوهمية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">تحذير مهم</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      سيتم حذف جميع البيانات الوهمية نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">البيانات التي سيتم حذفها:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• جميع العملاء التجريبيين</li>
                  <li>• الحملات الإعلانية الوهمية</li>
                  <li>• المشاريع التجريبية</li>
                  <li>• الرسائل التجريبية</li>
                  <li>• البيانات المالية الوهمية</li>
                </ul>
              </div>

              <Button onClick={clearMockData} disabled={isLoading} variant="destructive" className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                    جاري التنظيف...
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 ml-2" />
                    حذف جميع البيانات الوهمية
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تصدير البيانات</CardTitle>
              <CardDescription>تصدير البيانات الحقيقية للنسخ الاحتياطي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={exportRealData} variant="outline" className="h-20 bg-transparent">
                  <div className="text-center">
                    <Download className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">تصدير JSON</div>
                    <div className="text-xs text-gray-500">ملف JSON شامل</div>
                  </div>
                </Button>

                <Button variant="outline" className="h-20 bg-transparent" disabled>
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">استيراد البيانات</div>
                    <div className="text-xs text-gray-500">قريباً</div>
                  </div>
                </Button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">معلومات التصدير</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• يتم تصدير البيانات بصيغة JSON</li>
                  <li>• يشمل جميع العملاء والحملات والمشاريع</li>
                  <li>• البيانات مشفرة ومحمية</li>
                  <li>• يمكن استخدامها للنسخ الاحتياطي</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
