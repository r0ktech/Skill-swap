import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start text-center md:text-left">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-slate-500 hover:text-primary">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-slate-500 hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
