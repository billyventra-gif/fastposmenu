"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, FileSpreadsheet, FileText, Link2, Loader2, Plus, Upload, X } from "lucide-react";
import type { Menu, PosTarget } from "@/lib/menu/schema";
import { POS_INFO } from "@/lib/export/registry";
import { BottomBar, Button, PosMark, cx, inputCls } from "./ui";

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

const fmtSize = (b: number) => (b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1000))} KB`);

const STAGES = ["Uploading", "Reading every page", "Finding items and prices", "Grouping sizes and modifiers", "Double-checking"];
// Rough timing (seconds) for when each stage "starts". Real read takes ~20-60s.
const STAGE_AT = [0, 2, 8, 18, 30];

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
  const [dragging, setDragging] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState("");
  const [linkMsg, setLinkMsg] = useState<string | null>(null);
  const pick = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => files.map((f) => (f.type.startsWith("image/") ? URL.createObjectURL(f) : null)), [files]);
  useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews]);

  const add = (list: FileList | null) => {
    if (!list) return;
    const arr = [...list];
    const heic = arr.find((f) => /heic|heif/i.test(f.type) || /\.hei[cf]$/i.test(f.name));
    setError(heic ? `${heic.name} is an iPhone HEIC photo. Use the camera button here, or set Settings → Camera → Formats → Most Compatible.` : null);
    setFiles((f) => [...f, ...arr.filter((x) => x !== heic)]);
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const prepared = await Promise.all(files.map(shrinkImage));
      const size = prepared.reduce((a, f) => a + f.size, 0);
      if (size > MAX_BODY) throw new Error("That's more than 4 MB in one go. Split the PDF or send fewer photos.");
      const fd = new FormData();
      fd.set("target", target);
      prepared.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed. Try again.");
      onDone(data.menu as Menu);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setBusy(false);
    }
  };

  const checkLink = async () => {
    setLinkMsg(null);
    const res = await fetch("/api/link", { method: "POST", body: JSON.stringify({ url: link }) });
    const data = await res.json().catch(() => ({}));
    setLinkMsg(data.message ?? "Couldn't check that link.");
  };

  if (busy) return <Reading files={files} previews={previews} />;

  return (
    <section className="mx-auto max-w-3xl animate-rise">
      <button onClick={onBack} className="-ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-muted hover:bg-ink/5">
        <ArrowLeft className="size-4" />
        <PosMark pos={target} className="size-5 rounded-md text-[10px]" />
        {POS_INFO[target].label}
      </button>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Add the menu</h1>
      <p className="mt-2 text-muted">Photos of each page, a PDF, a spreadsheet, or an export from the old POS.</p>

      {/* Phones: big camera + files buttons. Tablet/desktop: drop zone. */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
        <button onClick={() => camera.current?.click()} className="flex flex-col items-center gap-2 rounded-3xl bg-ink px-4 py-6 font-semibold text-white active:scale-[0.98]">
          <Camera className="size-7" />
          Take photos
        </button>
        <button onClick={() => pick.current?.click()} className="flex flex-col items-center gap-2 rounded-3xl bg-surface px-4 py-6 font-semibold ring-1 ring-line active:scale-[0.98]">
          <Upload className="size-7" />
          Choose files
        </button>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        onClick={() => pick.current?.click()}
        className={cx(
          "mt-6 hidden cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-14 text-center transition md:flex",
          dragging ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-ink/30",
        )}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Upload className="size-7" />
        </span>
        <span className="mt-4 text-lg font-semibold">Drop menu files here</span>
        <span className="mt-1 text-sm text-muted">or click to browse · JPG, PNG, PDF, CSV, XLSX</span>
      </div>
      <input ref={pick} type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => (add(e.target.files), (e.target.value = ""))} />
      <input ref={camera} type="file" multiple accept="image/*" capture="environment" className="hidden" onChange={(e) => (add(e.target.files), (e.target.value = ""))} />

      {files.length > 0 && (
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="relative animate-rise overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
              <div className="aspect-[3/4] w-full">
                {previews[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                  <img src={previews[i]!} alt={f.name} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center bg-bg text-muted">
                    {/\.(csv|xlsx)$/i.test(f.name) ? <FileSpreadsheet className="size-9" /> : <FileText className="size-9" />}
                  </div>
                )}
              </div>
              <div className="px-2 py-1.5">
                <p className="truncate text-xs font-medium">{f.name}</p>
                <p className="text-[11px] text-muted">{fmtSize(f.size)}</p>
              </div>
              <button
                onClick={() => setFiles(files.filter((_, j) => j !== i))}
                aria-label={`Remove ${f.name}`}
                className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-full bg-ink/70 text-white backdrop-blur"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => pick.current?.click()}
              className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line text-sm text-muted hover:border-ink/30"
            >
              <Plus className="size-6" />
              Add more
            </button>
          </li>
        </ul>
      )}

      {error && <p className="mt-4 animate-rise rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</p>}

      <p className="mt-5 text-sm text-muted">Tip: shoot each page straight on, in good light, edge to edge.</p>

      <div className="mt-8 rounded-3xl bg-surface p-4 ring-1 ring-line">
        <button onClick={() => setShowLink(!showLink)} className="flex w-full items-center gap-3 text-left">
          <span className="grid size-10 place-items-center rounded-xl bg-bg">
            <Link2 className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Have a link?</span>
            <span className="block text-sm text-muted">DoorDash, Uber Eats or Grubhub: screenshot it and upload instead.</span>
          </span>
        </button>
        {showLink && (
          <div className="mt-3 animate-rise">
            <div className="flex gap-2">
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" inputMode="url" className={inputCls} />
              <Button variant="secondary" onClick={checkLink} disabled={!link}>
                Check
              </Button>
            </div>
            {linkMsg && <p className="mt-2 text-sm">{linkMsg}</p>}
          </div>
        )}
      </div>

      <button onClick={onManual} className="mt-4 text-sm text-muted underline underline-offset-4">
        Or start from scratch
      </button>

      <BottomBar className="max-w-3xl">
        <Button size="lg" className="w-full" disabled={!files.length} onClick={submit}>
          {files.length ? `Build the menu · ${files.length} file${files.length > 1 ? "s" : ""}` : "Add a file to start"}
        </Button>
      </BottomBar>
    </section>
  );
}

/** Progress view while Claude reads the menu. Stages are paced by time; the request is one call. */
function Reading({ files, previews }: { files: File[]; previews: (string | null)[] }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const stage = STAGE_AT.filter((s) => t >= s).length - 1;
  const cover = previews.find(Boolean);

  return (
    <section className="mx-auto flex max-w-md animate-rise flex-col items-center pt-2 text-center sm:pt-10">
      <div className="relative w-32 sm:w-56">
        {files.length > 1 && <div className="absolute inset-0 translate-x-3 translate-y-2 rotate-3 rounded-3xl bg-surface ring-1 ring-line" />}
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-surface shadow-xl ring-1 ring-line">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img src={cover} alt="" className="size-full object-cover" />
          ) : (
            <div className="space-y-3 p-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="skeleton h-3 rounded-full" style={{ width: `${55 + ((i * 37) % 40)}%` }} />
              ))}
            </div>
          )}
          <div className="absolute inset-x-0 h-16 animate-scan bg-gradient-to-b from-transparent via-brand/30 to-transparent">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-brand shadow-[0_0_12px_2px_rgba(255,90,31,0.7)]" />
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-bold sm:mt-8">Reading your menu</h2>
      <p className="mt-1 text-sm text-muted">
        {files.length} file{files.length > 1 ? "s" : ""} · {t}s · usually under a minute
      </p>

      <ol className="mt-5 w-full space-y-1.5 text-left sm:mt-6 sm:space-y-2">
        {STAGES.map((s, i) => (
          <li
            key={s}
            className={cx(
              "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
              i === stage ? "bg-surface shadow-sm ring-1 ring-line" : "",
              i > stage && "opacity-40",
            )}
          >
            <span className={cx("grid size-7 place-items-center rounded-full", i < stage ? "bg-emerald-500 text-white" : i === stage ? "bg-brand-soft text-brand" : "bg-line")}>
              {i < stage ? <Check className="size-4" /> : i === stage ? <Loader2 className="size-4 animate-spin" /> : null}
            </span>
            <span className={cx("font-medium", i === stage && "text-ink")}>{s}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
