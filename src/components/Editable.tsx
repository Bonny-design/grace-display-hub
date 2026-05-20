import { useEffect, useRef, useState } from "react";
import { Pencil, Upload, RotateCcw } from "lucide-react";

/* Global edit-mode store via tiny event bus */
const KEY = "svr-edit-mode";
const STORE = "svr-content-v1";

type Store = Record<string, string>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; }
}
function writeStore(s: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE, JSON.stringify(s));
}

export function useEditMode() {
  const [on, setOn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "1";
  });
  useEffect(() => {
    const h = () => setOn(localStorage.getItem(KEY) === "1");
    window.addEventListener("svr-edit-changed", h);
    return () => window.removeEventListener("svr-edit-changed", h);
  }, []);
  const toggle = () => {
    const next = !on;
    localStorage.setItem(KEY, next ? "1" : "0");
    setOn(next);
    window.dispatchEvent(new Event("svr-edit-changed"));
  };
  return { on, toggle };
}

export function EditToolbar() {
  const { on, toggle } = useEditMode();
  const reset = () => {
    if (!confirm("Restaurar todos os textos e imagens originais?")) return;
    localStorage.removeItem(STORE);
    location.reload();
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2">
      {on && (
        <button
          onClick={reset}
          className="px-3 py-2 rounded-full bg-background/80 backdrop-blur border border-border text-xs tracking-[0.2em] text-white/80 hover:text-white flex items-center gap-2"
          title="Restaurar conteúdo original"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RESET
        </button>
      )}
      <button
        onClick={toggle}
        className="px-4 py-2.5 rounded-full text-xs tracking-[0.25em] font-semibold flex items-center gap-2 transition"
        style={{
          background: on ? "var(--gradient-blue-glow)" : "rgba(255,255,255,0.06)",
          color: on ? "white" : "rgba(255,255,255,0.8)",
          border: on ? "1px solid transparent" : "1px solid rgba(255,255,255,0.12)",
          boxShadow: on ? "var(--shadow-glow)" : "none",
        }}
      >
        <Pencil className="w-3.5 h-3.5" />
        {on ? "EDITANDO" : "EDITAR"}
      </button>
    </div>
  );
}

interface EditableProps {
  id: string;
  as?: keyof React.JSX.IntrinsicElements;
  children: string;
  className?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}

export function Editable({ id, as = "span", children, className, multiline, style }: EditableProps) {
  const { on } = useEditMode();
  const [value, setValue] = useState<string>(children);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const s = readStore();
    if (s[id] !== undefined) setValue(s[id]);
  }, [id]);

  const Tag = as as any;
  const save = () => {
    const text = (ref.current?.innerText ?? "").trim();
    setValue(text);
    const s = readStore();
    s[id] = text;
    writeStore(s);
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable={on}
      suppressContentEditableWarning
      onBlur={save}
      style={style}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (!multiline && e.key === "Enter") { e.preventDefault(); (e.target as HTMLElement).blur(); }
      }}
      className={`${className ?? ""} ${on ? "outline outline-1 outline-dashed outline-primary/50 rounded-sm px-1 -mx-1 focus:outline-primary focus:bg-primary/5" : ""}`}
    >
      {value}
    </Tag>
  );
}

interface EditableImageProps {
  id: string;
  src: string;
  alt: string;
  className?: string;
}

export function EditableImage({ id, src, alt, className }: EditableImageProps) {
  const { on } = useEditMode();
  const [current, setCurrent] = useState(src);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = readStore();
    if (s[id]) setCurrent(s[id]);
  }, [id]);

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setCurrent(data);
      const s = readStore();
      s[id] = data;
      writeStore(s);
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className={`relative ${on ? "ring-1 ring-dashed ring-primary/60" : ""}`}>
      <img src={current} alt={alt} className={className} loading="lazy" />
      {on && (
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute top-2 right-2 z-10 px-2 py-1.5 rounded-md bg-background/90 backdrop-blur border border-primary/40 text-[10px] tracking-[0.2em] text-white flex items-center gap-1 hover:bg-primary/20"
        >
          <Upload className="w-3 h-3" /> TROCAR
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}
