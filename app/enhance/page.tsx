import { EnhanceForm } from "@/components/upload/enhance-form";

export default function EnhancePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-900/60 via-black to-green-900/60 p-10">
        <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-red-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-green-500/30 blur-3xl" />
        <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90">
          AI Quality Booster
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          Make your photo crystal clear in seconds
        </h1>
        <p className="mt-3 max-w-2xl text-white/80">
          Upload any image and our enhancer sharpens details, improves contrast, and upscales
          quality with a single click.
        </p>
      </div>
      <EnhanceForm />
    </main>
  );
}
