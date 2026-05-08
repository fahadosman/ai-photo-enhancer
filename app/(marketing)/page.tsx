import Link from "next/link";
import { Navbar } from "@/components/common/navbar";

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 inline-flex rounded-full border border-purple-500/30 px-3 py-1 text-xs text-purple-300">
          Fast AI image enhancement
        </p>
        <h1 className="max-w-3xl font-display text-5xl font-semibold leading-tight">
          Turn low-quality photos into crisp, professional images.
        </h1>
        <p className="mt-5 max-w-2xl text-secondary">
          Upload your image, choose enhancement options, and download the result in seconds.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/enhance" className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white">
            Start Enhancing
          </Link>
          <Link href="/pricing" className="rounded-lg border border-border px-5 py-3 font-medium">
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
