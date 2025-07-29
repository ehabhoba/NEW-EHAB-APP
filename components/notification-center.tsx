"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react"

interface Notification {
  id: number
  type: "success" | "warning" | "info" | "error"
  message: string
  time: string
  read?: boolean
}

interface NotificationCenterProps {
  notifications: Notification[]
}

export function NotificationCenter({ notifications: initialNotifications }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" dir="rtl">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">الإشعارات</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  تحديد الكل كمقروء
                </Button>
              )}
            </div>
            <CardDescription>{unreadCount > 0 ? `${unreadCount} إشعار جديد` : "لا توجد إشعارات جديدة"}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 space-x-reverse flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">منذ {notification.time}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
