'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetCategoriesQuery } from '@/redux/features/categores/categoresApi';
import { useGetFacilitiesQuery } from '@/redux/features/facility/facilityApi';
import { useGetLocationsQuery } from '@/redux/features/location/locationApi';
import { useGetTagsQuery } from '@/redux/features/tags/tagsApi';
import { Activity, MapPin, Tag, Layers } from 'lucide-react';

export default function DashboardPage() {
  // جلب البيانات من الـ APIs
  const { data: categoriesData, isLoading: loadingCategories } =
    useGetCategoriesQuery();
  const { data: facilitiesData, isLoading: loadingFacilities } =
    useGetFacilitiesQuery({ page: 1, limit: 10 });
  const { data: locationsData, isLoading: loadingLocations } =
    useGetLocationsQuery();
  const { data: tagsData, isLoading: loadingTags } = useGetTagsQuery();

  const categoriesCount = categoriesData?.total || 0;
  const facilitiesCount = facilitiesData?.total || 0;
  const locationsCount = locationsData?.total || 0;
  const tagsCount = tagsData?.total || 0;

  const recentLocations = Array.isArray(locationsData?.data)
    ? locationsData.data.slice(0, 5)
    : [];

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            لوحة التحكم - بسهولة
          </h2>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('ar-SA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التصنيفات</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingCategories ? '...' : categoriesCount}
              </div>
              <p className="text-xs text-muted-foreground">
                إجمالي التصنيفات المتاحة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المرافق</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingFacilities ? '...' : facilitiesCount}
              </div>
              <p className="text-xs text-muted-foreground">
                إجمالي المرافق المسجلة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المواقع</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingLocations ? '...' : locationsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                إجمالي المواقع المتاحة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الوسوم</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingTags ? '...' : tagsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                إجمالي الوسوم المستخدمة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>نظرة عامة</CardTitle>
              <CardDescription>إحصائيات سريعة عن محتوى المنصة</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                  <div>
                    <p className="text-sm font-medium">التصنيفات النشطة</p>
                    <p className="text-2xl font-bold">{categoriesCount}</p>
                  </div>
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                  <div>
                    <p className="text-sm font-medium">المرافق المسجلة</p>
                    <p className="text-2xl font-bold">{facilitiesCount}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                  <div>
                    <p className="text-sm font-medium">المواقع الجغرافية</p>
                    <p className="text-2xl font-bold">{locationsCount}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>آخر المواقع المضافة</CardTitle>
              <CardDescription>
                إجمالي {locationsCount} موقع مسجل في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLocations ? (
                <div className="text-center text-muted-foreground py-4">
                  جاري التحميل...
                </div>
              ) : recentLocations.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  لا توجد مواقع مضافة بعد
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLocations.map((location) => (
                    <div
                      key={location._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {location.name.ar}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {location.type.ar}
                        </p>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
