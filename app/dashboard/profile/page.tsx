"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvatarUpload from "@/components/forms/AvatarUpload";

export default function ProfilePage() {
  const { user } = useStore();

  if (!user) {
    return <div className="p-8 text-center text-slate-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-2">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-8">
        <AvatarUpload />

        <div className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <Input defaultValue={user.name} className="h-11 rounded-xl bg-slate-50/50" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <Input defaultValue={user.email} type="email" className="h-11 rounded-xl bg-slate-50/50" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <Input defaultValue={user.location} className="h-11 rounded-xl bg-slate-50/50" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Bio</label>
            <textarea 
              defaultValue={user.bio}
              className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-slate-500 mt-1">Briefly describe yourself and what you're passionate about learning.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="ghost" className="rounded-full w-full sm:w-auto">Cancel</Button>
          <Button className="rounded-full shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity w-full sm:w-auto">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
