import { useState } from "react";
import { TOKENS } from "../config/tokens";

type Props = {
  selected: string;
  onChange: (s: string) => void;
};

export default function TokenSelector({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const token = TOKENS.find((t) => t.symbol === selected);

  return (
    <div className="relative">
      {/* Кнопка выбранного токена */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white hover:bg-white/10 transition"
      >
        {token && (
          <img src={token.logo} alt={token.symbol} className="w-5 h-5 rounded-full" />
        )}
        <span className="font-semibold">{token?.symbol}</span>
        <span className="text-slate-400">▾</span>
      </button>

      {/* Выпадающее меню */}
      {open && (
        <div className="absolute mt-2 w-40 bg-[#0f1624] border border-white/10 rounded-xl shadow-lg z-20">
          {TOKENS.map((t) => (
            <button
              key={t.symbol}
              onClick={() => {
                onChange(t.symbol);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 w-full text-left text-white hover:bg-indigo-600/30"
            >
              <img src={t.logo} alt={t.symbol} className="w-5 h-5 rounded-full" />
              {t.symbol}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
