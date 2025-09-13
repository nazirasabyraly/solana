import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

export default function BridgeView() {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState<string>("1.5");
  const [loading, setLoading] = useState(false);

  const handleBridge = async () => {
    if (!publicKey) {
      toast.error("⚠️ Подключите кошелёк перед отправкой");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Введите корректное количество SOL");
      return;
    }

    try {
      setLoading(true);

      // Здесь вместо фейка должен быть реальный API вызов к мосту (например Wormhole, Allbridge и т.д.)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`✅ Успешно отправлено ${amount} SOL → Ethereum!`, {
        style: { background: "#1a2e1a", color: "#b6fcb6", fontSize: "16px" },
      });
    } catch (e: any) {
      toast.error(`❌ Ошибка моста: ${e.message || e}`, {
        style: { background: "#2e1a1a", color: "#fcb6b6", fontSize: "16px" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-[#0b1220]/60 border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="text-white text-lg font-semibold mb-2">Bridge</div>

      {/* Из */}
      <div className="p-4 rounded-xl bg-black/30 border border-white/10">
        <div className="flex justify-between mb-2 text-slate-300 text-sm">
          <span>Из</span>
          <span>Баланс: 12.5 SOL</span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
        />
      </div>

      {/* В */}
      <div className="p-4 rounded-xl bg-black/30 border border-white/10">
        <div className="flex justify-between mb-2 text-slate-300 text-sm">
          <span>В</span>
          <span>Баланс: 0 ETH</span>
        </div>
        <input
          type="text"
          value={(Number(amount) * 0.998).toFixed(3)} // условный расчёт
          readOnly
          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white"
        />
      </div>

      {/* Инфо */}
      <div className="text-slate-400 text-sm space-y-1">
        <div>Комиссия моста: ~0.002 SOL</div>
        <div>Время в пути: ~20 минут</div>
      </div>

      <button
        onClick={handleBridge}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 disabled:opacity-50"
      >
        {loading ? "Отправка…" : "Отправить"}
      </button>
    </div>
  );
}
