'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, loginSchemaFields } from '@/schemas/loginSchema';
import TextFormEle from './form/text-form-element';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { LoginDto } from '@/types/auth/auth';
import { handleReqWithToaster } from '@/lib/handle-req-with-toaster';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<loginSchemaFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (data: loginSchemaFields) => {
    try {
      await login(data).unwrap();
      console.log('Login success, redirecting...');
      router.push('/');
    } catch (error) {
      console.log('Login failed', error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 📧 البريد الإلكتروني */}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <TextFormEle
              form={form}
              name="email"
              type="email"
              placeholder="ادخل بريدك الإلكتروني"
            />
          </div>

          {/* 🔐 كلمة المرور */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">كلمة المرور</Label>
              <Button
                variant="link"
                className="px-0 font-normal h-auto"
                type="button"
              >
                نسيت كلمة المرور؟
              </Button>
            </div>

            {/* الحقل مع زر إظهار/إخفاء */}
            <div className="relative">
              <TextFormEle
                type={showPassword ? 'text' : 'password'}
                form={form}
                name="password"
                placeholder="ادخل كلمة المرور"
              />

              <button
                type="button"
                className="absolute inset-y-0 left-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 🔘 زر الدخول */}
          <Button type="submit" className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
