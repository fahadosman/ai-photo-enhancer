"use client";

import Image from "next/image";
import { useState } from "react";

type UploadResult = { image: { id: string; filename: string; originalUrl: string } };

type SignatureResponse = {
  ok: boolean;
  timestamp: number;
  folder: string;
  signature: string;
  apiKey: string;
  cloudName: string;
};

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

    const signatureResponse = await fetch("/api/upload/signature", { method: "POST" });
    const signatureData = (await signatureResponse.json()) as SignatureResponse;
    if (!signatureResponse.ok || !signatureData.ok) {
      setMessage("Could not create upload signature.");
      setLoading(false);
      return;
    }

    const uploadForm = new FormData();
    uploadForm.set("file", file);
    uploadForm.set("api_key", signatureData.apiKey);
    uploadForm.set("timestamp", String(signatureData.timestamp));
    uploadForm.set("folder", signatureData.folder);
    uploadForm.set("signature", signatureData.signature);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadForm
      }
    );
    const cloudinaryData = await cloudinaryResponse.json();
    if (!cloudinaryResponse.ok || !cloudinaryData.secure_url) {
      setMessage("Cloudinary upload failed.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalUrl: cloudinaryData.secure_url as string,
        filename: file.name,
        mimeType: file.type || "image/jpeg",
        size: file.size
      })
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
    <div className="glass mt-8 space-y-4 rounded-xl p-6">
      <input
        type="file"
        accept="image/*"
        className="w-full rounded-md border border-border bg-transparent p-2"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="flex gap-3">
        <button
          className="rounded-md bg-blue-600 px-4 py-2 disabled:opacity-50"
          onClick={runUpload}
          type="button"
          disabled={!file || loading}
        >
          Save Upload
        </button>
        <button
          className="rounded-md bg-purple-600 px-4 py-2 disabled:opacity-50"
          onClick={runEnhance}
          type="button"
          disabled={!upload?.image.id || loading}
        >
          Enhance
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
