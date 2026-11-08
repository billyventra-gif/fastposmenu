"use client";

import { useRef, useState } from "react";
import type { Menu, PosTarget } from "@/lib/menu/schema";
import { POS_INFO } from "@/lib/export/registry";

const ACCEPT = "image/png,image/jpeg,image/webp,application/pdf,.pdf,.csv,.xlsx,text/csv";
// Vercel functions cap request bodies around 4.5 MB. Large PDFs go to storage first (TODO).
const MAX_BODY = 4_300_000;
const MAX_EDGE = 2000; // px; keeps image tokens down without hurting legibility

async function shrinkImage(file: File): Promise<File> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 1_500_000) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.85));
  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

export default function Uploader({
  target,
  onDone,
  onBack,
  onManual,
}: {
  target: PosTarget;
  onDone: (m: Menu) => void;
  onBack: () => void;
  onManual: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [linkMsg, setLinkMsg] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const add = (list: FileList | null) => {
    if (!list) return;
    const arr = [...list];
    const heic = arr.find((f) => /heic|heif/i.test(f.type) || /\.hei[cf]$/i.test(f.name));
    if (heic) setError(`${heic.name} is HEIC. On iPhone: Settings → Camera → Formats → Most Compatible, or screenshot it.`);
    setFiles((f) => [...f, ...arr.filter((x) => x !== heic)]);
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const prepared = await Promise.all(files.map(shrinkImage));
      const size = prepared.reduce((a, f) => a + f.size, 0);
      if (size > MAX_BODY) {
        throw new Error("Files are too big for one upload (4 MB max for now). Split the PDF or send fewer photos.");
      }
      const fd = new FormData();
      fd.set("target", target);
      prepared.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onDone(data.menu as Menu);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const checkLink = async () => {
    setLinkMsg(null);
    const res = await fetch("/api/link", { method: "POST", body: JSON.stringify({ url: link }) });
    const data = await res.json();
    setLinkMsg(data.message);
  };

  return (
    <section>
      <button onClick={onBack} className="text-sm text-neutral-500">
        ← {POS_INFO[target].label}
      </button>
      <h1 className="mt-1 text-2xl font-bold">Drop in the menu</h1>
      <p className="mt-1 text-neutral-600">Photos, PDF, CSV, XLSX, or an export from the old POS. Multiple pages are fine.</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-white px-4 py-10 text-center hover:border-brand"
      >
        <span className="text-lg font-semibold">Tap to add files</span>
        <span className="mt-1 text-sm text-neutral-500">or drag them here</span>
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
              <span className="truncate">{f.name}</span>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-neutral-500" aria-label={`Remove ${f.name}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        disabled={!files.length || busy}
        onClick={submit}
        className="mt-4 h-12 w-full rounded-lg bg-brand font-semibold text-white disabled:opacity-40"
      >
        {busy ? "Reading the menu… (about a minute)" : "Build the menu"}
      </button>

      <details className="mt-8 rounded-xl border border-neutral-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold">Have a link instead?</summary>
        <p className="mt-2 text-sm text-neutral-600">DoorDash, Uber Eats or Grubhub? Screenshot the menu and upload it above.</p>
        <div className="mt-3 flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://"
            className="h-11 min-w-0 flex-1 rounded-lg border border-neutral-300 px-3"
          />
          <button onClick={checkLink} disabled={!link} className="h-11 rounded-lg border border-neutral-300 px-4 font-medium disabled:opacity-40">
            Check
          </button>
        </div>
        {linkMsg && <p className="mt-2 text-sm text-neutral-700">{linkMsg}</p>}
      </details>

      <button onClick={onManual} className="mt-4 text-sm text-neutral-500 underline">
        Or start from scratch
      </button>
    </section>
  );
}
