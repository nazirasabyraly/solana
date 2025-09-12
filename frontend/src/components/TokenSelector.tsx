import { TOKENS } from "../config/tokens";

export type TokenSelectorProps = {
  selected: string;
  onChange: (symbol: string) => void;
};

export default function TokenSelector({ selected, onChange }: TokenSelectorProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white"
    >
      {TOKENS.map((t) => (
        <option key={t.symbol} value={t.symbol}>
          {t.symbol}
        </option>
      ))}
    </select>
  );
}
