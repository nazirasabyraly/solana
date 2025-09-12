import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const { publicKey } = useWallet();
  const [amountIn, setAmountIn] = useState("");
  const amountOut = "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* 🔹 Animated gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0a1020] to-[#0c1324]" />
      <div className="aurora" />

      {/* Removed grid overlay for a cleaner look */}

      {/* Simplified background: remove orbs for a cleaner, modern look */}

      {/* 🔹 Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl text-white pt-14 pb-16 px-6 text-center"
      >
        {/* Card shell */}
        <div className="relative rounded-3xl p-10 sm:p-12 bg-white/5 backdrop-blur-2xl">
          {/* Glow border */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl" />

          <h1 className="text-center mb-6">
            <span className="block tracking-[0.28em] text-indigo-200" style={{ fontSize: "1.3rem" }}>SOLANA DEX</span>
            <span className="font-extrabold text-white" style={{ lineHeight: 1.06, fontSize: "clamp(3rem, 7vw, 6.5rem)" }}>⚡ My Solana DEX</span>
          </h1>

          <p className="mx-auto max-w-3xl text-white/95 text-xl sm:text-2xl leading-relaxed mb-10">
            Trade tokens on Solana with a sleek UI, low fees, and fast confirmation. Click Start to open your dashboard and begin.
          </p>
          <div className="flex items-center justify-center">
            <Link to="/dashboard" className="text-white" style={{ borderRadius: 14, padding: "16px 34px", fontWeight: 800, fontSize: 20, background: "#6366f1", boxShadow: "0 16px 40px -12px rgba(99,102,241,0.7)" }}>
              Start
            </Link>
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
          ) : null}
        </div>
      </motion.div>

      {/* Minimal landing keeps just hero and CTA per your request */}
    </div>
  );
}

export default App;
