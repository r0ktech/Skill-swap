"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "My Skills (Offered)", href: "/dashboard/my-skills" },
  { name: "Skills I Want", href: "/dashboard/wanted-skills" },
  { name: "Matches", href: "/dashboard/matches" },
  { name: "Messages", href: "/dashboard/messages" },
  { name: "Profile Settings", href: "/dashboard/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r bg-white h-full hidden md:block">
        <div className="flex flex-col h-full py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile Horizontal Navigation */}
      <nav className="md:hidden border-b bg-white overflow-x-auto sticky top-0 z-40" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex items-center min-w-max px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "text-primary border-primary"
                    : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
