// App.tsx 
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0a1020] to-[#0c1324]" />
      <div className="aurora" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl text-white pt-14 pb-16 px-6 text-center"
      >
        <div className="relative rounded-3xl p-10 sm:p-12 bg-white/5 backdrop-blur-2xl">
          <h1 className="text-center mb-6">
            <span className="block tracking-[0.28em] text-indigo-200" style={{ fontSize: "1.3rem" }}>SOLANA DEX</span>
            <span className="font-extrabold text-white whitespace-nowrap" style={{ lineHeight: 1.06, fontSize: "clamp(3rem, 7vw, 6.5rem)" }}>⚡ My Solana DEX</span>
          </h1>

          <p className="mx-auto max-w-3xl text-white/95 text-xl sm:text-2xl leading-relaxed mb-10">
            Trade tokens on Solana with a sleek UI, low fees, and fast confirmation. Click Start to open your dashboard and begin.
          </p>

          <div className="flex items-center justify-center">
            <Link
              to="/dashboard"
              className="text-white"
              style={{
                borderRadius: 14,
                padding: "16px 34px",
                fontWeight: 800,
                fontSize: 20,
                background: "#6366f1",
                boxShadow: "0 16px 40px -12px rgba(99,102,241,0.7)"
              }}
            >
              Start
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
