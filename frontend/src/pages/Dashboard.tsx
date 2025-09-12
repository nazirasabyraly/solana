// import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function Dashboard() {
  return (
    <div className="min-h-screen relative overflow-x-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0a1020] to-[#0c1324]" />
      <div className="aurora" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30 grid place-items-center">
              <span className="text-indigo-300 text-lg">◇</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Solana Prime</h1>
          </div>
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !rounded-xl !px-4 !py-2 !font-semibold" />
        </div>

        {/* Tabs + Card */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-[#0f1624]/70 backdrop-blur-2xl border border-white/10 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.7)]">
          <div className="p-4 border-b border-white/10">
            <div className="inline-flex rounded-full bg-white/5 p-1">
              <button className="px-5 py-2 rounded-full bg-indigo-500/30 text-indigo-100 font-semibold">Swap</button>
              <button className="px-5 py-2 rounded-full text-slate-200 hover:bg-white/10">Pro Trade</button>
              <button className="px-5 py-2 rounded-full text-slate-200 hover:bg-white/10">Bridge</button>
              <button className="px-5 py-2 rounded-full text-slate-200 hover:bg-white/10">Pools</button>
            </div>
          </div>

          {/* Swap Card */}
          <div className="p-6 md:p-10">
            <div className="grid gap-7">
              {/* Give */}
              <div className="rounded-2xl bg-[#0b1220]/60 border border-white/10 p-5">
                <div className="flex items-center justify-between mb-2 text-slate-300 text-sm">
                  <span>You give</span>
                  <span className="text-slate-400">Balance: 12.5 SOL</span>
                </div>
                <div className="flex items-center gap-4">
                  <input className="flex-1 bg-black/20 rounded-2xl px-5 py-4 text-4xl font-extrabold outline-none border border-white/10 focus:border-indigo-400/60 placeholder:text-white/40" placeholder="7.5" />
                  <button className="px-4 py-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
                    <span className="font-semibold">SOL</span>
                    <span className="text-slate-400">▾</span>
                  </button>
                </div>
              </div>

              {/* Switch icon */}
              <div className="grid place-items-center">
                <div className="h-10 w-10 grid place-items-center rounded-full bg-black/40 border border-white/10">↕</div>
              </div>

              {/* Receive */}
              <div className="rounded-2xl bg-[#0b1220]/60 border border-white/10 p-5">
                <div className="flex items-center justify-between mb-2 text-slate-300 text-sm">
                  <span>You get</span>
                  <span className="text-slate-400">Balance: 5,430 USDC</span>
                </div>
                <div className="flex items-center gap-4">
                  <input className="flex-1 bg-black/20 rounded-2xl px-5 py-4 text-4xl font-extrabold outline-none border border-white/10 focus:border-indigo-400/60 placeholder:text-white/40" placeholder="210.75" />
                  <button className="px-4 py-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
                    <span className="font-semibold">USDC</span>
                    <span className="text-slate-400">▾</span>
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="text-slate-300 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1">Exchange rate</div>
                  <div>1 SOL ≈ 140.50 USDC</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">Price impact</div>
                  <div className="text-emerald-400">&lt; 0.01%</div>
                </div>
                <div className="mt-3 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-200 px-3 py-2">
                  ⚡ Optimal route found: 75% Orca, 25% Raydium
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full rounded-2xl px-6 py-4 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:from-indigo-400 hover:via-violet-400 hover:to-fuchsia-400 font-semibold shadow-[0_18px_45px_-15px_rgba(99,102,241,0.6)]">Swap</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


