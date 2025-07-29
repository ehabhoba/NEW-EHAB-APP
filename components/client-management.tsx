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
import { Plus, Search, Phone, Mail, MessageSquare, FileText } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  serviceType: string
  status: "active" | "inactive" | "pending"
  totalSpent: number
  campaignsCount: number
  joinDate: string
  lastActivity: string
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]) // بدء بقائمة فارغة
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
  })

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // تحديث دالة إضافة العميل لتستخدم Firebase
  const handleAddClient = async () => {
    try {
      // إضافة العميل إلى Firebase
      const clientData = {
        ...newClient,
        id: Date.now().toString(),
        status: "active",
        totalSpent: 0,
        campaignsCount: 0,
        joinDate: new Date().toISOString().split("T")[0],
        lastActivity: new Date().toISOString().split("T")[0],
        currency: "EGP",
        country: "مصر",
        createdAt: new Date(),
      }

      // في التطبيق الحقيقي، سيتم حفظ البيانات في Firebase
      // await addDoc(collection(db, "clients"), clientData)

      setClients([...clients, clientData])
      setNewClient({ name: "", email: "", phone: "", company: "", serviceType: "" })
      setIsAddDialogOpen(false)

      // إرسال رسالة ترحيب عبر واتساب
      await generateWelcomeMessage(clientData)
    } catch (error) {
      console.error("خطأ في إضافة العميل:", error)
    }
  }

  // تحديث رسالة الترحيب للسوق المصري
  const generateWelcomeMessage = async (client: Client) => {
    const welcomeMessage = `أهلاً وسهلاً ${client.name}! 🎉

نحن سعداء جداً بانضمامك إلى عائلة عملائنا في منظم الأعمال الذكي.

✅ تم إنشاء حسابك بنجاح
✅ يمكنك الآن متابعة مشاريعك وحملاتك
✅ مراجعة التقارير والتحليلات التفصيلية
✅ التواصل المباشر مع فريق العمل المتخصص

📞 للتواصل والاستفسارات:
- واتساب: +20 1234567890
- إيميل: support@smartbusiness.com

نتطلع للعمل معك وتحقيق أهدافك التسويقية! 🚀

فريق منظم الأعمال الذكي`

    console.log("تم إنشاء رسالة الترحيب:", welcomeMessage)
    // هنا سيتم الإرسال عبر واتساب باستخدام GreenAPI
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">غير نشط</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>
      default:
        return <Badge>غير محدد</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة العملاء</h2>
          <p className="text-muted-foreground">إدارة شاملة لجميع العملاء والتفاعل معهم</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات العميل الجديد. سيتم إنشاء بطاقة هوية رقمية وإرسال رسالة ترحيب تلقائياً.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="example@domain.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+966501234567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">اسم الشركة</Label>
                <Input
                  id="company"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="اسم الشركة أو المؤسسة"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serviceType">نوع الخدمة</Label>
                <Select
                  value={newClient.serviceType}
                  onValueChange={(value) => setNewClient({ ...newClient, serviceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تصميم جرافيك وهوية بصرية">تصميم جرافيك وهوية بصرية</SelectItem>
                    <SelectItem value="تسويق إلكتروني ووسائل التواصل">تسويق إلكتروني ووسائل التواصل</SelectItem>
                    <SelectItem value="إعلانات ممولة فيسبوك وجوجل">إعلانات ممولة فيسبوك وجوجل</SelectItem>
                    <SelectItem value="تطوير مواقع ومتاجر إلكترونية">تطوير مواقع ومتاجر إلكترونية</SelectItem>
                    <SelectItem value="إنتاج محتوى وفيديوهات">إنتاج محتوى وفيديوهات</SelectItem>
                    <SelectItem value="استشارات تسويقية">استشارات تسويقية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddClient}>إضافة العميل</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث عن العملاء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع العملاء</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
            <SelectItem value="pending">في الانتظار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedClient(client)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <CardDescription>{client.company}</CardDescription>
                </div>
                {getStatusBadge(client.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 ml-2" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 ml-2" />
                  {client.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 ml-2" />
                  {client.serviceType}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    {/* تحديث عرض المبالغ بالجنيه المصري */}
                    <div className="text-2xl font-bold text-green-600">{client.totalSpent.toLocaleString()} ج.م</div>
                    <div className="text-xs text-gray-500">إجمالي الإنفاق</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{client.campaignsCount}</div>
                    <div className="text-xs text-gray-500">عدد الحملات</div>
                  </div>
                </div>
                <div className="flex justify-between pt-3">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 ml-1" />
                    رسالة
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-1" />
                    حملة جديدة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Details Dialog */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>تفاصيل العميل: {selectedClient.name}</DialogTitle>
              <DialogDescription>معلومات شاملة عن العميل وأنشطته</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">الشركة</Label>
                  <p className="text-sm text-gray-600">{selectedClient.company}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">نوع الخدمة</Label>
                  <p className="text-sm text-gray-600">{selectedClient.serviceType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ الانضمام</Label>
                  <p className="text-sm text-gray-600">{selectedClient.joinDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">آخر نشاط</Label>
                  <p className="text-sm text-gray-600">{selectedClient.lastActivity}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedClient.totalSpent.toLocaleString()} ر.س
                  </div>
                  <div className="text-sm text-gray-500">إجمالي الإنفاق</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedClient.campaignsCount}</div>
                  <div className="text-sm text-gray-500">عدد الحملات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-gray-500">معدل الرضا</div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 ml-2" />
                  إرسال رسالة واتساب
                </Button>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء حملة جديدة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
