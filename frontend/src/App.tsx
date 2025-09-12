import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const { publicKey } = useWallet();
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 🔹 Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black animate-gradient-x"></div>

      {/* 🔹 Main card with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-slate-800/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          ⚡ My Solana DEX
        </h1>

        <div className="flex justify-center mb-6">
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 transition-colors" />
        </div>

        {publicKey ? (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1">Amount In</label>
              <input
                type="number"
                placeholder="0.0"
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">Estimated Out</label>
              <input
                type="number"
                placeholder="0.0"
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-gray-400"
                value={amountOut}
                readOnly
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors"
            >
              Swap
            </motion.button>
          </>
        ) : (
          <p className="mt-6 text-center text-gray-300">
            Подключите кошелёк, чтобы начать 🚀
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default App;
