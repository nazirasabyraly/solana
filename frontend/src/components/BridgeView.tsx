// src/components/BridgeView.tsx
import { useState } from "react";
import toast from "react-hot-toast";
import TokenSelector from "./TokenSelector";

export default function BridgeView() {
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("ETH");
  const [loading, setLoading] = useState(false);

  async function handleBridge() {
    if (!amount || Number(amount) <= 0) {
      toast.error("Введите сумму для моста");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`✅ Отправлено ${amount} ${fromToken} → ${toToken}`, {
        style: { background: "#1a2e1a", color: "#b6fcb6", fontSize: "16px" },
      });
      setAmount("");
    } catch (e: any) {
      toast.error(`❌ Ошибка моста: ${e.message}`, {
        style: { background: "#2e1a1a", color: "#fcb6b6", fontSize: "16px" },
      });
    } finally {
      setLoading(false);
    }
  }

  // Функция для обмена местами токенов
  function handleSwitch() {
    const prev = fromToken;
    setFromToken(toToken);
    setToToken(prev);
  }

  return (
    <div className="max-w-xl mx-auto bg-[#0b1220]/60 border border-white/10 rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Bridge</h2>

      {/* Из */}
      <div className="mb-4">
        <label className="block text-slate-300 mb-2">Из</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-black/30 px-4 py-3 rounded-xl text-white border border-white/10"
            placeholder="1.0"
          />
          <TokenSelector selected={fromToken} onChange={setFromToken} exclude={toToken} />
        </div>
        <div className="text-slate-400 text-sm mt-1">Баланс: 12.5 {fromToken}</div>
      </div>

      {/* Кнопка-переключатель */}
      <div className="flex justify-center my-4">
        <button
          onClick={handleSwitch}
          className="h-10 w-10 grid place-items-center rounded-full bg-black/40 border border-white/10 hover:bg-indigo-600/30 transition"
        >
          ↕
        </button>
      </div>

      {/* В */}
      <div className="mb-6">
        <label className="block text-slate-300 mb-2">В</label>
        <div className="flex gap-3">
          <input
            type="text"
            disabled
            value={amount ? (Number(amount) * 0.998).toFixed(3) : ""}
            className="flex-1 bg-black/30 px-4 py-3 rounded-xl text-white border border-white/10"
            placeholder="—"
          />
          <TokenSelector selected={toToken} onChange={setToToken} exclude={fromToken} />
        </div>
        <div className="text-slate-400 text-sm mt-1">Баланс: 0 {toToken}</div>
      </div>

      {/* Метаданные */}
      <div className="text-slate-400 text-sm mb-6">
        <div>Комиссия моста: ~0.2%</div>
        <div>Время в пути: ~20 минут</div>
      </div>

      {/* Кнопка */}
      <button
        onClick={handleBridge}
        disabled={loading}
        className="w-full py-4 text-lg rounded-xl font-semibold bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Отправка…" : "Отправить"}
      </button>
    </div>
  );
}
