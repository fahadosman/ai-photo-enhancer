import Link from "next/link";
import { Navbar } from "@/components/common/navbar";

export default function MarketingHomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/90">
          Fast AI image enhancement
        </p>
        <h1 className="max-w-3xl bg-gradient-to-r from-red-300 via-white to-green-300 bg-clip-text font-display text-5xl font-semibold leading-tight text-transparent">
          Turn low-quality photos into crisp, professional images.
        </h1>
        <p className="mt-5 max-w-2xl text-secondary">
          Upload your image, choose enhancement options, and download the result in seconds.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/enhance" className="btn-vine">
            Start Enhancing
          </Link>
          <Link href="/pricing" className="btn-vine-alt">
            View Pricing
          </Link>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <article className="card-vine">
            <h3 className="text-lg font-semibold text-white">Clean Upscale</h3>
            <p className="mt-2 text-sm text-white/70">Smartly increases resolution while preserving detail.</p>
          </article>
          <article className="card-vine">
            <h3 className="text-lg font-semibold text-white">Face Clarity</h3>
            <p className="mt-2 text-sm text-white/70">Improves portrait sharpness and skin detail naturally.</p>
          </article>
          <article className="card-vine">
            <h3 className="text-lg font-semibold text-white">One Click Result</h3>
            <p className="mt-2 text-sm text-white/70">Upload, enhance, and download in seconds.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
