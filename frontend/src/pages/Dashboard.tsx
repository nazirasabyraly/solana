import { useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import TokenSelector from "../components/TokenSelector";
import { useConnection } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import ProTradeView from "../components/ProTradeView";
import BridgeView from "../components/BridgeView";
import PoolsView from "../components/PoolsView";


const TOKENS: Record<string, { mint: string; dec: number }> = {
  SOL: { mint: "So11111111111111111111111111111111111111112", dec: 9 },
  USDC: { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", dec: 6 },
};

const WALLET_DOWNLOAD_LINKS: Record<string, string> = {
  Phantom: "https://phantom.app/download",
  Solflare: "https://solflare.com/download",
  MathWallet: "https://mathwallet.org/en-us/",
};

async function getQuote(params: Record<string, string | number>) {
  const u = new URL("/api/jup/quote", window.location.origin);
  Object.entries(params).forEach(([k, v]) =>
    u.searchParams.set(k, String(v))
  );
  const r = await fetch(u.toString());
  return r.json();
}

async function postSwap(body: any) {
  const r = await fetch("/api/jup/swap", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

function Dashboard() {
  const { wallets, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [activeTab, setActiveTab] = useState<
    "swap" | "pro" | "bridge" | "pools"
  >("swap");

  // Токены и сумма
  const [tokenIn, setTokenIn] = useState("SOL");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [amountIn, setAmountIn] = useState("");

  const [routeBest, setRouteBest] = useState<any>(null);
  const [routeDirect, setRouteDirect] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const inMint = TOKENS[tokenIn]?.mint;
  const outMint = TOKENS[tokenOut]?.mint;
  const inDec = TOKENS[tokenIn]?.dec ?? 9;
  const outDec = TOKENS[tokenOut]?.dec ?? 6;

  const amountInAtoms = useMemo(() => {
    const v = Number(amountIn || "0");
    if (!Number.isFinite(v) || v <= 0) return 0;
    return Math.round(v * 10 ** inDec);
  }, [amountIn, inDec]);

  const savingsPct = useMemo(() => {
    if (!routeBest || !routeDirect) return null;
    const best = Number(routeBest.outAmount);
    const dir = Number(routeDirect.outAmount);
    if (!dir) return null;
    return ((best - dir) / dir) * 100;
  }, [routeBest, routeDirect]);

  wallets.forEach((w) => {
    if (w.readyState === WalletReadyState.NotDetected) {
      const url = WALLET_DOWNLOAD_LINKS[w.adapter.name];
      if (url) console.log(`⚠️ ${w.adapter.name} не найден. Скачайте: ${url}`);
    }
  });

  async function onQuote() {
    if (!inMint || !outMint || !amountInAtoms) return;
    setLoading(true);
    try {
      const bestResp = await getQuote({
        inputMint: inMint,
        outputMint: outMint,
        amount: amountInAtoms,
        slippageBps: 50,
      });
      setRouteBest(bestResp);

      const directResp = await getQuote({
        inputMint: inMint,
        outputMint: outMint,
        amount: amountInAtoms,
        slippageBps: 50,
        onlyDirectRoutes: true,
      });
      setRouteDirect(directResp);
    } finally {
      setLoading(false);
    }
  }

  async function onSwap() {
    if (!routeBest || !publicKey || !signTransaction) return;
    setLoading(true);
    try {
      const { swapTransaction } = await postSwap({
        quoteResponse: routeBest,
        userPublicKey: publicKey.toBase58(),
      });
      const tx = VersionedTransaction.deserialize(
        Buffer.from(swapTransaction, "base64")
      );
      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
      });
      alert("Tx sent: " + sig);
    } catch (e: any) {
      alert("Swap failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const outBestUi = routeBest
    ? (Number(routeBest.outAmount) / 10 ** outDec).toFixed(6)
    : "-";
  const priceUi = routeBest
    ? (Number(routeBest.outAmount) / 10 ** outDec) /
      (amountInAtoms / 10 ** inDec)
    : null;
  const routeLabel = routeBest?.marketInfos
    ? routeBest.marketInfos
        .map(
          (m: any) => m.label || m.amm?.label || m.swapInfo?.label
        )
        .filter(Boolean)
        .join(" → ")
    : null;

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
            <h1 className="text-2xl sm:text-3xl font-bold">Madagascar</h1>
          </div>

          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !rounded-xl !px-4 !py-2 !font-semibold" />
        </div>

        {/* Card */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-visible bg-[#0f1624]/70 backdrop-blur-2xl border border-white/10 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.7)]">
          {/* Tabs */}
          <div className="p-4 border-b border-white/10">
            <div className="grid grid-cols-4 gap-2 rounded-full bg-white/5 p-1">
              {["swap", "pro", "bridge", "pools"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab as "swap" | "pro" | "bridge" | "pools")
                  }
                  className={`w-full py-2 rounded-full ${
                    activeTab === tab
                      ? "bg-indigo-500/30 text-indigo-100 font-semibold"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {tab === "swap" && "Swap"}
                  {tab === "pro" && "Pro Trade"}
                  {tab === "bridge" && "Bridge"}
                  {tab === "pools" && "Pools"}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            {activeTab === "swap" && (
              <div className="grid gap-7">
                {/* Give */}
                <div className="rounded-2xl bg-[#0b1220]/60 border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-2 text-slate-300 text-sm">
                    <span>You give</span>
                    <span className="text-slate-400">Balance: — {tokenIn}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      value={amountIn}
                      onChange={(e) => setAmountIn(e.target.value)}
                      className="flex-1 bg-black/20 rounded-2xl px-5 py-4 text-4xl font-extrabold outline-none border border-white/10 focus:border-indigo-400/60 placeholder:text-white/40"
                      placeholder="7.5"
                    />
                    <TokenSelector
                      selected={tokenIn}
                      onChange={(s) => {
                        setTokenIn(s);
                        setRouteBest(null);
                        setRouteDirect(null);
                      }}
                      exclude={tokenOut}
                    />
                  </div>
                </div>

                {/* Switch */}
                <div className="grid place-items-center">
                  <button
                    onClick={() => {
                      const prevIn = tokenIn;
                      const prevOut = tokenOut;
                      setTokenIn(prevOut);
                      setTokenOut(prevIn);
                      setRouteBest(null);
                      setRouteDirect(null);
                    }}
                    className="h-10 w-10 grid place-items-center rounded-full bg-black/40 border border-white/10 hover:bg-indigo-600/30 transition"
                  >
                    ↕
                  </button>
                </div>

                {/* Receive */}
                <div className="rounded-2xl bg-[#0b1220]/60 border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-2 text-slate-300 text-sm">
                    <span>You get</span>
                    <span className="text-slate-400">Balance: — {tokenOut}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      disabled
                      value={routeBest ? outBestUi : ""}
                      className="flex-1 bg-black/20 rounded-2xl px-5 py-4 text-4xl font-extrabold outline-none border border-white/10 placeholder:text-white/40"
                      placeholder="—"
                    />
                    <TokenSelector
                      selected={tokenOut}
                      onChange={(s) => {
                        setTokenOut(s);
                        setRouteBest(null);
                        setRouteDirect(null);
                      }}
                      exclude={tokenIn}
                    />
                  </div>
                </div>

                {/* Meta info */}
                <div className="text-slate-300 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">Exchange rate</div>
                    <div>
                      {priceUi
                        ? `1 ${tokenIn} ≈ ${priceUi.toFixed(6)} ${tokenOut}`
                        : "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">Savings vs direct</div>
                    <div
                      className={
                        savingsPct && savingsPct > 0
                          ? "text-emerald-400"
                          : "text-slate-300"
                      }
                    >
                      {savingsPct !== null
                        ? `${savingsPct.toFixed(2)}%`
                        : "—"}
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-200 px-3 py-2">
                    {routeLabel ? `⚡ Route: ${routeLabel}` : "—"}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={onQuote}
                    disabled={loading || !amountInAtoms}
                    className="w-1/2 rounded-2xl px-6 py-4 bg-slate-700 hover:bg-slate-600 font-semibold"
                  >
                    {loading ? "Quoting…" : "Get Quote"}
                  </button>
                  <button
                    onClick={onSwap}
                    disabled={loading || !publicKey || !routeBest}
                    className="w-1/2 rounded-2xl px-6 py-4 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 hover:from-indigo-400 hover:via-violet-400 hover:to-fuchsia-400 font-semibold shadow-[0_18px_45px_-15px_rgba(99,102,241,0.6)] disabled:opacity-50"
                  >
                    {loading ? "Swapping…" : "Swap"}
                  </button>
                </div>
              </div>
            )}

  {activeTab === "pro" && <ProTradeView />}


  {activeTab === "bridge" && <BridgeView />}

  {activeTab === "pools" && <PoolsView />}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
