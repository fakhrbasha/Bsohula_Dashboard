'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllSubjectsQuery } from '@/redux/features/subjectApi/subjectApi';

const lectureSchema = z.object({
  name: z.string().min(1, 'اسم المحاضرة مطلوب'),
  description: z.string().optional(),
  duration: z.string().optional(),
  orderIndex: z.string().optional(),
  subjectId: z.string().min(1, 'المادة مطلوبة'),
  video: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, 'ملف الفيديو غير صالح'),
  isActive: z.boolean(),
});

export type LectureFormValues = z.infer<typeof lectureSchema>;

interface LectureFormProps {
  mode: 'add' | 'edit';
  initialData?: LectureFormValues;
  lectureId?: string;
  onSuccess?: () => void;
}

export default function LectureForm({
  mode,
  initialData,
  lectureId,
  onSuccess,
}: LectureFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: subjectsData } = useGetAllSubjectsQuery();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<LectureFormValues>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: '',
      orderIndex: '',
      subjectId: '',
      video: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [initialData]);

  const onSubmit = async (values: LectureFormValues) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('duration', values.duration || '');
      formData.append('orderIndex', values.orderIndex || '0');
      formData.append('subjectId', values.subjectId);
      if (values.video) formData.append('video', values.video);

      const token = localStorage.getItem('token');
      const xhr = new XMLHttpRequest();
      const url =
        mode === 'add'
          ? 'https://takween-api.klexagency.com/api/lecture'
          : `https://takween-api.klexagency.com/api/lecture/${lectureId}`;

      xhr.open(mode === 'add' ? 'POST' : 'PATCH', url);
      xhr.setRequestHeader('Accept', 'application/json');
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        const res = JSON.parse(xhr.responseText);
        if (xhr.status === 200 || xhr.status === 201) {
          toast({
            title:
              mode === 'add'
                ? '✅ تم إضافة المحاضرة بنجاح'
                : '✅ تم تحديث المحاضرة بنجاح',
            description: res.message || '',
          });
          if (onSuccess) onSuccess();
          else router.push('/lectures');
        } else {
          toast({
            title: '❌ فشل العملية',
            description:
              res?.message ||
              res?.error ||
              xhr.responseText ||
              'حدث خطأ أثناء العملية',
            variant: 'destructive',
          });
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        toast({
          title: '❌ خطأ في الاتصال',
          description: 'حدث خطأ أثناء العملية',
          variant: 'destructive',
        });
      };

      xhr.send(formData);
    } catch (error) {
      setIsUploading(false);
      console.error(error);
      toast({
        title: '❌ خطأ غير متوقع',
        description: 'تعذر إتمام العملية، تحقق من الاتصال.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex py-10 px-10 justify-center">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-right">
          {mode === 'add' ? 'إضافة محاضرة جديدة' : 'تعديل المحاضرة'}
        </h1>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 text-right"
        >
          {/* الاسم */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">اسم المحاضرة *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="مثلاً: مقدمة"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* الوصف */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="اختياري"
            />
          </div>

          {/* المدة */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="duration">المدة (بالدقائق)</Label>
            <Input
              id="duration"
              {...form.register('duration')}
              placeholder="مثلاً: 45 دقيقة"
            />
          </div>

          {/* الترتيب */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="orderIndex">الترتيب</Label>
            <Input
              id="orderIndex"
              type="number"
              {...form.register('orderIndex')}
              placeholder="مثلاً: 1"
            />
          </div>

          {/* اختيار المادة */}
          <Controller
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor="subjectId">المادة *</Label>
                <select
                  id="subjectId"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="border p-2 rounded-md"
                >
                  <option value="">اختر المادة</option>
                  {subjectsData?.data?.subjects?.map((subject: any) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
                {form.formState.errors.subjectId && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.subjectId.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* ملف الفيديو */}
          <Controller
            control={form.control}
            name="video"
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor="video">
                  {mode === 'add' ? 'ملف الفيديو *' : 'ملف الفيديو'}
                </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
                {form.formState.errors.video && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.video.message}
                  </p>
                )}
                {mode === 'edit' && (
                  <p className="text-sm text-gray-500">
                    اتركه فارغًا إذا كنت لا تريد تغييره
                  </p>
                )}
              </div>
            )}
          />

          {/* الحالة النشطة */}

          {/* progress bar */}
          {isUploading && (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                ⏳ جاري {mode === 'add' ? 'الرفع' : 'التحديث'}...{' '}
                {uploadProgress}%
              </p>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading
              ? `جاري ${
                  mode === 'add' ? 'الرفع' : 'التحديث'
                } ${uploadProgress}%`
              : mode === 'add'
              ? 'إضافة المحاضرة'
              : 'حفظ التعديلات'}
          </Button>
        </form>
      </div>
    </div>
  );
}
