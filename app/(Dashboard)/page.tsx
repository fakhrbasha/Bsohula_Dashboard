"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"



export default function DashboardPage() {


  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString("ar-SA")}</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العملاء</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{}</div>
              <p className="text-xs text-muted-foreground">إجمالي العملاء المسجلين</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المقالات</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{}</div>
              <p className="text-xs text-muted-foreground">إجمالي المقالات المنشورة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{}</div>
              <p className="text-xs text-muted-foreground">إجمالي المنتجات المتاحة</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>نظرة عامة</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] bg-muted/50 rounded-md flex items-center justify-center">
                مكان الرسم البياني
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>العملاء الأخيرين</CardTitle>
              <CardDescription>إجمالي {} عميل مسجل في النظام.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
    </div>
  )
}
