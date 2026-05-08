"use client";

import Image from "next/image";
import { useState } from "react";

type UploadResult = { image: { id: string; filename: string; originalUrl: string } };

type EnhancementResponse = {
  enhancement: { id: string; status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" };
  async: boolean;
};

type EnhancementStatusResponse = {
  enhancement: {
    id: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    image?: { enhancedUrl?: string | null; originalUrl?: string | null };
  };
};

export function EnhanceForm() {
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<UploadResult | null>(null);
  const [message, setMessage] = useState("");
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pollEnhancement = async (enhancementId: string) => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(`/api/enhance/${enhancementId}`, { method: "GET" });
      if (!response.ok) {
        setMessage("Could not read enhancement status.");
        return;
      }
      const data = (await response.json()) as EnhancementStatusResponse;
      if (data.enhancement.status === "COMPLETED") {
        setEnhancedUrl(data.enhancement.image?.enhancedUrl ?? null);
        setMessage("Enhancement completed.");
        return;
      }
      if (data.enhancement.status === "FAILED") {
        setMessage("Enhancement failed. Please try again.");
        return;
      }
      setMessage(`Processing... (${attempt + 1}/30)`);
    }
    setMessage("Enhancement is still running. Check history in dashboard.");
  };

  const runUpload = async () => {
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }
    setLoading(true);
    setEnhancedUrl(null);

    const uploadForm = new FormData();
    uploadForm.set("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadForm
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ? JSON.stringify(data.error) : "Upload failed");
      setLoading(false);
      return;
    }
    setUpload(data);
    setMessage("Upload saved. Ready to enhance.");
    setLoading(false);
  };

  const runEnhance = async () => {
    if (!upload?.image.id) return;
    setLoading(true);
    const response = await fetch("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: upload.image.id, type: "FULL_ENHANCE" })
    });
    const data = (await response.json()) as EnhancementResponse & { error?: string };
    if (!response.ok) {
      setMessage(data.error ? JSON.stringify(data.error) : "Enhancement failed");
      setLoading(false);
      return;
    }
    if (data.async) {
      setMessage("Enhancement started. Waiting for completion...");
      await pollEnhancement(data.enhancement.id);
    } else {
      setMessage("Enhancement completed.");
      const statusResponse = await fetch(`/api/enhance/${data.enhancement.id}`);
      if (statusResponse.ok) {
        const statusData = (await statusResponse.json()) as EnhancementStatusResponse;
        setEnhancedUrl(statusData.enhancement.image?.enhancedUrl ?? null);
      }
    }
    setLoading(false);
  };

  return (
    <div className="card-vine mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-white/80">Choose your photo</span>
        <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-3">
          <span className="truncate text-sm text-white/80">{file ? file.name : "No file selected yet"}</span>
          <span className="btn-vine px-3 py-1.5 text-xs">Browse</span>
        </div>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <div className="flex gap-3">
        <button
          className="btn-vine"
          onClick={runUpload}
          type="button"
          disabled={!file || loading}
        >
          Upload Photo
        </button>
        <button
          className="btn-vine-alt"
          onClick={runEnhance}
          type="button"
          disabled={!upload?.image.id || loading}
        >
          Enhance Quality
        </button>
      </div>
      {upload?.image.originalUrl ? (
        <Image
          src={upload.image.originalUrl}
          alt="Uploaded preview"
          width={1200}
          height={800}
          className="max-h-64 w-full rounded-md object-contain"
        />
      ) : null}
      {enhancedUrl ? (
        <Image
          src={enhancedUrl}
          alt="Enhanced preview"
          width={1200}
          height={800}
          className="max-h-64 w-full rounded-md object-contain"
        />
      ) : null}
      {message ? <p className="text-sm text-secondary">{message}</p> : null}
    </div>
  );
}
