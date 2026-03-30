import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r bg-white h-[calc(100vh-64px)] hidden md:block">
      <div className="flex flex-col h-full py-6 px-4 space-y-2">
        <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
          Overview
        </Link>
        <Link href="/dashboard/my-skills" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          My Skills (Offered)
        </Link>
        <Link href="/dashboard/wanted-skills" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          Skills I Want
        </Link>
        <Link href="/dashboard/matches" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          Matches
        </Link>
        <Link href="/chat" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          Messages
        </Link>
        <Link href="/profile" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors mt-auto">
          Profile Settings
        </Link>
      </div>
    </aside>
  );
}
