import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">iDegin Cloud</h1>
          <p className="text-muted-foreground">Professional hosting management platform</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
