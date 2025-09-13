// ProTradeView.tsx
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProTradeView() {
  const [price, setPrice] = useState("140.50");
  const [amount, setAmount] = useState("0.0");
  const [total, setTotal] = useState("0.0");
  const [mode, setMode] = useState<"buy" | "sell">("buy");

  // пересчёт "Всего" по цене и количеству
  const handleAmountChange = (val: string) => {
    setAmount(val);
    const numVal = parseFloat(val) || 0;
    const numPrice = parseFloat(price) || 0;
    setTotal((numVal * numPrice).toFixed(2));
  };

  const handleSubmit = () => {
    if (parseFloat(amount) <= 0) {
      toast.error("Введите количество SOL", {
        style: { background: "#1f1f1f", color: "#fff" },
      });
      return;
    }

    if (mode === "buy") {
      toast.success(`Покупка ${amount} SOL по ${price} USDC`, {
        icon: "🟢",
        style: { background: "#1a2e1a", color: "#b6fcb6" },
      });
    } else {
      toast.success(`Продажа ${amount} SOL по ${price} USDC`, {
        icon: "🔴",
        style: { background: "#2e1a1a", color: "#fcb6b6" },
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Левая колонка - форма */}
      <div className="col-span-1 bg-[#0b1220]/60 border border-white/10 rounded-2xl p-5">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setMode("buy")}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              mode === "buy"
                ? "bg-green-600 text-white"
                : "bg-green-600/20 text-green-200"
            }`}
          >
            Купить
          </button>
          <button
            onClick={() => setMode("sell")}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              mode === "sell"
                ? "bg-red-600 text-white"
                : "bg-red-600/20 text-red-200"
            }`}
          >
            Продать
          </button>
        </div>

        <label className="block text-sm text-slate-300 mb-1">Цена (USDC)</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-lg bg-black/30 border border-white/10"
        />

        <label className="block text-sm text-slate-300 mb-1">Количество (SOL)</label>
        <input
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-lg bg-black/30 border border-white/10"
        />

        <label className="block text-sm text-slate-300 mb-1">Всего (USDC)</label>
        <input
          value={total}
          readOnly
          className="w-full mb-4 px-3 py-2 rounded-lg bg-black/30 border border-white/10"
        />

        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl font-semibold ${
            mode === "buy" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {mode === "buy" ? "Купить SOL" : "Продать SOL"}
        </button>
      </div>

      {/* Центр - график */}
      <div className="col-span-1 bg-[#0b1220]/60 border border-white/10 rounded-2xl p-5 flex items-center justify-center text-slate-400">
        [Здесь будет график цены]
      </div>

      {/* Правая колонка - книга ордеров */}
      <div className="col-span-1 bg-[#0b1220]/60 border border-white/10 rounded-2xl p-5">
        <h3 className="text-slate-200 mb-3">Книга ордеров</h3>
        <div className="text-sm grid grid-cols-3 text-slate-400 mb-2">
          <span>Цена</span>
          <span>Кол-во</span>
          <span>Всего</span>
        </div>
        <div className="text-red-400 text-sm">140.85 | 0.50 | 70.42</div>
        <div className="text-red-400 text-sm">140.82 | 1.20 | 168.98</div>
        <div className="text-red-400 text-sm mb-2">140.80 | 5.60 | 788.48</div>
        <div className="text-green-400 font-bold text-center my-2">140.55 USDC</div>
        <div className="text-green-400 text-sm">140.50 | 4.10 | 576.05</div>
        <div className="text-green-400 text-sm">140.48 | 2.30 | 323.10</div>
        <div className="text-green-400 text-sm">140.45 | 10.80 | 1516.86</div>
      </div>
    </div>
  );
}
