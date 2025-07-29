"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, FileText, BarChart3, MessageSquare, CheckCircle, Clock, AlertCircle, Download, Eye } from "lucide-react"

// Mock client data
const clientData = {
  name: "أحمد محمد",
  company: "شركة الأحلام",
  email: "ahmed@dreams-company.com",
  phone: "+966501234567",
  joinDate: "2024-01-15",
  totalSpent: 25000,
  activeProjects: 3,
  completedProjects: 5,
}

const projects = [
  {
    id: "1",
    name: "تصميم الهوية البصرية",
    status: "in-progress",
    progress: 75,
    dueDate: "2024-02-15",
    description: "تصميم شعار وهوية بصرية كاملة للشركة",
  },
  {
    id: "2",
    name: "حملة التسويق الرقمي",
    status: "review",
    progress: 90,
    dueDate: "2024-02-10",
    description: "حملة تسويقية شاملة عبر وسائل التواصل الاجتماعي",
  },
  {
    id: "3",
    name: "تطوير الموقع الإلكتروني",
    status: "completed",
    progress: 100,
    dueDate: "2024-01-30",
    description: "تطوير موقع إلكتروني متجاوب وحديث",
  },
]

const reports = [
  {
    id: "1",
    title: "تقرير أداء الحملة الإعلانية - يناير",
    date: "2024-01-31",
    type: "campaign",
    status: "ready",
  },
  {
    id: "2",
    title: "تحليل وسائل التواصل الاجتماعي",
    date: "2024-01-28",
    type: "social",
    status: "ready",
  },
  {
    id: "3",
    title: "تقرير الأداء الشهري",
    date: "2024-02-01",
    type: "monthly",
    status: "processing",
  },
]

const supportTickets = [
  {
    id: "1",
    subject: "طلب تعديل على التصميم",
    status: "open",
    priority: "medium",
    date: "2024-01-28",
    lastUpdate: "2024-01-29",
  },
  {
    id: "2",
    subject: "استفسار حول الحملة الإعلانية",
    status: "resolved",
    priority: "low",
    date: "2024-01-25",
    lastUpdate: "2024-01-26",
  },
]

export function ClientPortal() {
  const [selectedClient] = useState(clientData)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    priority: "medium",
    description: "",
  })
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">قيد التنفيذ</Badge>
      case "review":
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
      case "open":
        return <Badge className="bg-red-100 text-red-800">مفتوح</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">محلول</Badge>
      case "ready":
        return <Badge className="bg-green-100 text-green-800">جاهز</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المعالجة</Badge>
      default:
        return <Badge>غير محدد</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "review":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSubmitTicket = async () => {
    setIsSubmittingTicket(true)
    // Simulate API call
    setTimeout(() => {
      setNewTicket({ subject: "", priority: "medium", description: "" })
      setIsSubmittingTicket(false)
      // Show success message
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">بوابة العميل</h2>
          <p className="text-muted-foreground">مرحباً {selectedClient.name} - تابع مشاريعك وتقاريرك</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Badge variant="secondary">عميل نشط</Badge>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 ml-2" />
            تواصل معنا
          </Button>
        </div>
      </div>

      {/* Client Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإنفاق</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedClient.totalSpent.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground">منذ {selectedClient.joinDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع النشطة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedClient.activeProjects}</div>
            <p className="text-xs text-muted-foreground">قيد التنفيذ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع المكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedClient.completedProjects}</div>
            <p className="text-xs text-muted-foreground">تم إنجازها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الرضا</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">تقييم ممتاز</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">مشاريعي</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="support">الدعم الفني</TabsTrigger>
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>التقدم</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {getStatusIcon(project.status)}
                        <span>تاريخ التسليم: {project.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-3 border-t">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 ml-1" />
                        عرض التفاصيل
                      </Button>
                      {project.status === "review" && (
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 ml-1" />
                          موافقة
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>تاريخ الإنشاء: {report.date}</CardDescription>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                      <BarChart3 className="h-4 w-4" />
                      <span>
                        تقرير{" "}
                        {report.type === "campaign" ? "حملة" : report.type === "social" ? "وسائل التواصل" : "شهري"}
                      </span>
                    </div>
                    {report.status === "ready" && (
                      <Button size="sm">
                        <Download className="h-4 w-4 ml-1" />
                        تحميل
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create New Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>إنشاء تذكرة دعم جديدة</CardTitle>
                <CardDescription>أرسل استفسارك أو طلبك وسنرد عليك في أقرب وقت</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input
                    id="subject"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="أدخل موضوع الاستفسار"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="اكتب تفاصيل استفسارك أو طلبك..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmitTicket}
                  disabled={isSubmittingTicket || !newTicket.subject.trim()}
                  className="w-full"
                >
                  {isSubmittingTicket ? "جاري الإرسال..." : "إرسال التذكرة"}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>تذاكر الدعم السابقة</CardTitle>
                <CardDescription>تابع حالة استفساراتك وطلباتك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{ticket.subject}</h4>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>تاريخ الإنشاء: {ticket.date}</p>
                        <p>آخر تحديث: {ticket.lastUpdate}</p>
                        <p>
                          الأولوية:{" "}
                          {ticket.priority === "high" ? "عالية" : ticket.priority === "medium" ? "متوسطة" : "منخفضة"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الملف الشخصي</CardTitle>
              <CardDescription>عرض وتحديث بياناتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>الاسم الكامل</Label>
                    <Input value={selectedClient.name} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>اسم الشركة</Label>
                    <Input value={selectedClient.company} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input value={selectedClient.email} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <Label>رقم الهاتف</Label>
                    <Input value={selectedClient.phone} readOnly />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">إحصائيات الحساب</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>تاريخ الانضمام:</span>
                        <span>{selectedClient.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>إجمالي المشاريع:</span>
                        <span>{selectedClient.activeProjects + selectedClient.completedProjects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>إجمالي الإنفاق:</span>
                        <span>{selectedClient.totalSpent.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-transparent" variant="outline">
                    <User className="h-4 w-4 ml-2" />
                    طلب تحديث البيانات
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
