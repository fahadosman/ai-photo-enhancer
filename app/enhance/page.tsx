import { EnhanceForm } from "@/components/upload/enhance-form";

export default function EnhancePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Enhance an Image</h1>
      <p className="mt-3 text-secondary">Upload an image and choose your AI enhancement options.</p>
      <EnhanceForm />
    </main>
  );
}
