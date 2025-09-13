// src/components/TokenSelector.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TOKENS } from "../config/tokens";

type Props = {
  selected: string;
  onChange: (s: string) => void;
  exclude?: string;
};

export default function TokenSelector({ selected, onChange, exclude }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 200,
  });

  const token = TOKENS.find((t) => t.symbol === selected);

  const filtered = exclude
    ? TOKENS.filter((t) => t.symbol !== exclude)
    : TOKENS;

  const calcPos = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    const width = Math.max(r.width, 200);

    let left = r.left;
    if (left + width + margin > window.innerWidth) {
      left = Math.max(margin, window.innerWidth - width - margin);
    }
    setPos({ top: r.bottom + margin, left, width });
  };

  useEffect(() => {
    if (!open) return;
    calcPos();

    const onResize = () => calcPos();
    const onScroll = () => calcPos();
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current || !btnRef.current) return;
      const target = e.target as Node;
      if (!menuRef.current.contains(target) && !btnRef.current.contains(target)) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white hover:bg-white/10 transition"
      >
        {token && (
          <>
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-semibold">{token.symbol}</span>
          </>
        )}
        {!token && <span className="text-slate-400">Select</span>}
        <span className="text-slate-400">▾</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
            className="z-[10000]"
          >
            <div className="max-h-[60vh] overflow-auto bg-[#0f1624] border border-white/10 rounded-2xl shadow-2xl backdrop-blur">
              {filtered.map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => {
                    onChange(t.symbol);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left text-white hover:bg-indigo-600/30"
                >
                  <img src={t.logoURI} alt={t.symbol} className="w-5 h-5 rounded-full" />
                  <span className="font-medium">{t.symbol}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
