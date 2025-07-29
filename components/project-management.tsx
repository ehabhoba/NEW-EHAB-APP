"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, Calendar, User, Clock, CheckCircle, AlertCircle, Circle, MoreHorizontal } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  priority: "low" | "medium" | "high"
  dueDate: string
  client: string
  project: string
  status: "todo" | "in-progress" | "review" | "completed"
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "تصميم الشعار الجديد",
    description: "إنشاء شعار حديث ومميز للعلامة التجارية",
    assignee: "أحمد محمد",
    priority: "high",
    dueDate: "2024-02-15",
    client: "شركة الأحلام",
    project: "الهوية البصرية",
    status: "in-progress",
  },
  {
    id: "2",
    title: "كتابة المحتوى الإعلاني",
    description: "إنشاء نصوص إعلانية جذابة للحملة الجديدة",
    assignee: "فاطمة علي",
    priority: "medium",
    dueDate: "2024-02-10",
    client: "متجر الأناقة",
    project: "حملة التسويق",
    status: "todo",
  },
  {
    id: "3",
    title: "مراجعة التصاميم",
    description: "مراجعة والموافقة على التصاميم المقترحة",
    assignee: "محمد السعيد",
    priority: "high",
    dueDate: "2024-02-08",
    client: "مطعم الذوق",
    project: "تصميم القائمة",
    status: "review",
  },
  {
    id: "4",
    title: "إعداد التقرير الشهري",
    description: "تجميع وتحليل بيانات الأداء الشهري",
    assignee: "سارة أحمد",
    priority: "low",
    dueDate: "2024-02-20",
    client: "عيادة النور",
    project: "التقارير والتحليلات",
    status: "completed",
  },
]

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "قائمة المهام",
    tasks: initialTasks.filter((task) => task.status === "todo"),
  },
  {
    id: "in-progress",
    title: "قيد التنفيذ",
    tasks: initialTasks.filter((task) => task.status === "in-progress"),
  },
  {
    id: "review",
    title: "قيد المراجعة",
    tasks: initialTasks.filter((task) => task.status === "review"),
  },
  {
    id: "completed",
    title: "مكتملة",
    tasks: initialTasks.filter((task) => task.status === "completed"),
  },
]

export function ProjectManagement() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    dueDate: "",
    client: "",
    project: "",
  })

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns.find((col) => col.id === source.droppableId)
      const destColumn = columns.find((col) => col.id === destination.droppableId)

      if (sourceColumn && destColumn) {
        const sourceItems = [...sourceColumn.tasks]
        const destItems = [...destColumn.tasks]
        const [removed] = sourceItems.splice(source.index, 1)

        // Update task status based on destination column
        removed.status = destination.droppableId as Task["status"]
        destItems.splice(destination.index, 0, removed)

        setColumns(
          columns.map((col) => {
            if (col.id === source.droppableId) {
              return { ...col, tasks: sourceItems }
            }
            if (col.id === destination.droppableId) {
              return { ...col, tasks: destItems }
            }
            return col
          }),
        )
      }
    } else {
      const column = columns.find((col) => col.id === source.droppableId)
      if (column) {
        const copiedItems = [...column.tasks]
        const [removed] = copiedItems.splice(source.index, 1)
        copiedItems.splice(destination.index, 0, removed)

        setColumns(columns.map((col) => (col.id === source.droppableId ? { ...col, tasks: copiedItems } : col)))
      }
    }
  }

  const handleAddTask = () => {
    const taskId = Date.now().toString()
    const task: Task = {
      id: taskId,
      ...newTask,
      status: "todo",
      priority: newTask.priority as Task["priority"],
    }

    const todoColumn = columns.find((col) => col.id === "todo")
    if (todoColumn) {
      setColumns(columns.map((col) => (col.id === "todo" ? { ...col, tasks: [...col.tasks, task] } : col)))
    }

    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
      client: "",
      project: "",
    })
    setIsAddTaskOpen(false)
  }

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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "عالية"
      case "medium":
        return "متوسطة"
      case "low":
        return "منخفضة"
      default:
        return "غير محدد"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4 text-gray-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "review":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المشاريع</h2>
          <p className="text-muted-foreground">تنظيم ومتابعة المهام والمشاريع بنظام كانبان</p>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مهمة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مهمة جديدة</DialogTitle>
              <DialogDescription>أدخل تفاصيل المهمة الجديدة وسيتم إضافتها إلى قائمة المهام</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskTitle">عنوان المهمة</Label>
                <Input
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="أدخل عنوان المهمة"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDescription">وصف المهمة</Label>
                <Textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="أدخل وصف تفصيلي للمهمة"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignee">المسؤول</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المسؤول" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أحمد محمد">أحمد محمد</SelectItem>
                      <SelectItem value="فاطمة علي">فاطمة علي</SelectItem>
                      <SelectItem value="محمد السعيد">محمد السعيد</SelectItem>
                      <SelectItem value="سارة أحمد">سارة أحمد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">عالية</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="low">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">العميل</Label>
                  <Select value={newTask.client} onValueChange={(value) => setNewTask({ ...newTask, client: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شركة الأحلام">شركة الأحلام</SelectItem>
                      <SelectItem value="متجر الأناقة">متجر الأناقة</SelectItem>
                      <SelectItem value="مطعم الذوق">مطعم الذوق</SelectItem>
                      <SelectItem value="عيادة النور">عيادة النور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project">المشروع</Label>
                <Input
                  id="project"
                  value={newTask.project}
                  onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                  placeholder="اسم المشروع"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddTask}>إضافة المهمة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المهام</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialTasks.length}</div>
            <p className="text-xs text-muted-foreground">عبر جميع المشاريع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialTasks.filter((t) => t.status === "in-progress").length}</div>
            <p className="text-xs text-muted-foreground">مهمة نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialTasks.filter((t) => t.status === "review").length}</div>
            <p className="text-xs text-muted-foreground">تحتاج موافقة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialTasks.filter((t) => t.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">تم إنجازها</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <Card key={column.id} className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2 space-x-reverse">
                    {getStatusIcon(column.id)}
                    <span>{column.title}</span>
                  </CardTitle>
                  <Badge variant="secondary">{column.tasks.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? "bg-blue-50" : ""
                      }`}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-move transition-shadow ${
                                snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>

                                  <div className="flex items-center justify-between">
                                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                      {getPriorityLabel(task.priority)}
                                    </Badge>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Calendar className="h-3 w-3 ml-1" />
                                      {task.dueDate}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center text-xs text-gray-600">
                                      <User className="h-3 w-3 ml-1" />
                                      {task.assignee}
                                    </div>
                                    <span className="text-xs text-gray-500">{task.client}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
