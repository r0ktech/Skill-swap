import AuthForm from "@/components/forms/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50/50">
      <AuthForm type="login" />
    </div>
  );
}
