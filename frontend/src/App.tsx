import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const { publicKey } = useWallet();
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* 🔹 Animated gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-slate-900 to-black animate-gradient-x" />
      <div className="aurora" />

      {/* 🔹 Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* 🔹 Floating glow orbs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 0.45, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.6), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: -40, scale: 0.9 }}
        animate={{ opacity: 0.35, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="absolute -bottom-28 -right-28 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,85,247,0.55), transparent 70%)",
        }}
      />

      {/* 🔹 Main card with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg text-white"
      >
        {/* Card shell */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-slate-800/60 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
          {/* Glow border */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(closest-side,black,transparent)] shadow-[0_0_80px_15px_rgba(99,102,241,0.25)]" />

          <h1 className="text-center mb-8">
            <span className="block tracking-[0.35em] !text-indigo-200 [text-shadow:0_1px_8px_rgba(99,102,241,0.35)]" style={{ color: "#c7d2fe", fontSize: "clamp(1.125rem, 1.5vw, 1.5rem)" }}>SOLANA DEX</span>
            <span className="font-extrabold !text-white [text-shadow:0_2px_18px_rgba(99,102,241,0.45)] mix-blend-normal" style={{ color: "#ffffff", lineHeight: 1.05, fontSize: "clamp(3rem, 6vw, 7rem)" }}>
              ⚡ My Solana DEX
            </span>
          </h1>

          <div className="flex justify-center mb-8">
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-xl !px-5 !py-2.5 !transition-colors !shadow-lg !shadow-indigo-500/20" />
          </div>

          {publicKey ? (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2 text-slate-300">Amount In</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="w-full pr-16 pl-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent placeholder:text-slate-500 backdrop-blur-sm transition-shadow shadow-inner"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-slate-700/70 border border-slate-600/60 text-slate-200">SOL</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2 text-slate-300">Estimated Out</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="w-full pr-16 pl-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-400 focus:outline-none placeholder:text-slate-600 backdrop-blur-sm"
                    value={amountOut}
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-slate-700/60 border border-slate-600/50 text-slate-300">USDC</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 font-semibold transition-all shadow-lg shadow-indigo-600/25 ring-1 ring-white/10"
              >
                Swap
              </motion.button>
            </>
          ) : (
            <p className="mt-6 text-center !text-slate-100 [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]" style={{ color: "#f1f5f9", fontSize: "clamp(1rem, 1.2vw, 1.4rem)" }}>
              Подключите кошелёк, чтобы начать 🚀
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default App;
