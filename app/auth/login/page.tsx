import LoginForm from '@/components/login-form'
import React from 'react'

const Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
    <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold">مرحباً بعودتك</h1>
        <p className="text-muted-foreground mt-2">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
      </div>
      <LoginForm />
    </div>
    <div className="fixed bottom-4">
      <h3 className="text-md font-bold text-muted-foreground/90">
        Powered By <span className="font-extrabold text-primary">KLEX</span>
      </h3>
    </div>
  </div>
  )
}

export default Page
