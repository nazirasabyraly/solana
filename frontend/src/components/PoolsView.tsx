import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import TokenSelector from "./TokenSelector";

export default function PoolsView() {
  const { publicKey } = useWallet();

  const [tokenA, setTokenA] = useState("SOL");
  const [tokenB, setTokenB] = useState("USDC");
  const [feeTier, setFeeTier] = useState(0.3);
  const [priceMin, setPriceMin] = useState("120");
  const [priceMax, setPriceMax] = useState("160");
  const [amountA, setAmountA] = useState("0");
  const [amountB, setAmountB] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleAddLiquidity = async () => {
    if (!publicKey) {
      toast.error("⚠️ Подключите кошелёк");
      return;
    }

    if (Number(amountA) <= 0 && Number(amountB) <= 0) {
      toast.error("Введите количество токенов");
      return;
    }

    try {
      setLoading(true);

      // Заглушка: здесь будет реальный вызов в контракт AMM
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        `✅ Ликвидность добавлена: ${amountA} ${tokenA} + ${amountB} ${tokenB}`,
        { style: { background: "#1a2e1a", color: "#b6fcb6" } }
      );
    } catch (e: any) {
      toast.error(`❌ Ошибка: ${e.message || e}`, {
        style: { background: "#2e1a1a", color: "#fcb6b6" },
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция для обмена токенов местами
  const handleSwitch = () => {
    const prev = tokenA;
    setTokenA(tokenB);
    setTokenB(prev);
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#0b1220]/60 border border-white/10 rounded-2xl p-6 space-y-6">
      <h2 className="text-white text-lg font-semibold mb-2">
        Управление ликвидностью
      </h2>

      {/* Токены */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <TokenSelector selected={tokenA} onChange={setTokenA} exclude={tokenB} />
        </div>

        {/* Кнопка-переключатель */}
        <div className="flex justify-center">
          <button
            onClick={handleSwitch}
            className="h-10 w-10 grid place-items-center rounded-full bg-black/40 border border-white/10 hover:bg-indigo-600/30 transition"
          >
            ↕
          </button>
        </div>

        <div className="flex gap-3">
          <TokenSelector selected={tokenB} onChange={setTokenB} exclude={tokenA} />
        </div>
      </div>

      {/* Комиссия */}
      <div>
        <div className="text-slate-300 text-sm mb-2">Уровень комиссии</div>
        <div className="grid grid-cols-3 gap-2">
          {[0.05, 0.3, 1.0].map((f) => (
            <button
              key={f}
              onClick={() => setFeeTier(f)}
              className={`rounded-lg py-2 font-semibold ${
                feeTier === f
                  ? "bg-indigo-500/30 text-indigo-200"
                  : "bg-black/30 text-slate-300 hover:bg-white/10"
              }`}
            >
              {f}%
            </button>
          ))}
        </div>
      </div>

      {/* Ценовой диапазон */}
      <div>
        <div className="text-slate-300 text-sm mb-2">Ценовой диапазон</div>
        <div className="flex gap-3">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
          />
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
          />
        </div>
        <div className="text-slate-400 text-sm mt-1">
          Текущая цена: 140.50 USDC за SOL
        </div>
      </div>

      {/* Количество токенов */}
      <div className="flex gap-3">
        <input
          type="number"
          placeholder={`0.0 ${tokenA}`}
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
        />
        <input
          type="number"
          placeholder={`0.0 ${tokenB}`}
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
        />
      </div>

      {/* Кнопка */}
      <button
        onClick={handleAddLiquidity}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 disabled:opacity-50"
      >
        {loading ? "Добавление…" : "Добавить ликвидность"}
      </button>
    </div>
  );
}
