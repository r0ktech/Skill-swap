import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const isLogin = type === "login";

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-sm text-slate-500">
          {isLogin
            ? "Enter your email to sign in to your account"
            : "Enter your details below to create your account"}
        </p>
      </div>
      <div className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-slate-700">Full Name</label>
            <Input id="name" placeholder="John Doe" required />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-slate-700">Email</label>
          <Input id="email" placeholder="m@example.com" required type="email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-slate-700">Password</label>
          <Input id="password" required type="password" />
        </div>
        <Button className="w-full rounded-full" size="lg">
          {isLogin ? "Sign In" : "Sign Up"}
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full rounded-full" type="button">
           Google
        </Button>
        <Button variant="outline" className="w-full rounded-full" type="button">
           Github
        </Button>
      </div>
      <div className="text-center text-sm text-slate-500">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-primary hover:underline">
          {isLogin ? "Sign up" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}
