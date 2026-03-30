import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-white flex items-center justify-center overflow-hidden">
        {/* Background centered transparent image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full max-w-4xl flex items-center justify-center opacity-20 pointer-events-none mix-blend-multiply">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-[100px] -z-10" />
          <Image 
            src="/hero.png" 
            alt="Users exchanging skills" 
            width={800} 
            height={800} 
            className="object-contain"
            priority
          />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 leading-tight pb-2">
              Exchange Skills,<br /> Learn for Free
            </h1>
            <p className="max-w-[750px] text-slate-600 md:text-2xl font-medium mt-4">
              Join the world&apos;s first completely free skill-trading marketplace. Stop spending money, start exchanging knowledge today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
              <Button asChild size="lg" className="rounded-full shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity text-lg px-8 py-6 h-auto">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-white/80 backdrop-blur-sm text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm text-lg px-8 py-6 h-auto">
                <Link href="/browse">Browse Skills</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-neutral-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full">
                <svg
                  className=" h-8 w-8 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Save Money</h2>
              <p className="text-slate-500">
                Learn valuable skills from experts without spending a dime. Just trade what you know.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full">
                <svg
                  className=" h-8 w-8 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="M7 21h10" />
                  <path d="M12 3v18" />
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Fair Exchange</h2>
              <p className="text-slate-500">
                Match with users whose needs align perfectly with what you offer.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full">
                <svg
                  className=" h-8 w-8 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Build Network</h2>
              <p className="text-slate-500">
                Meet passionate individuals from around the world and grow your professional network.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
