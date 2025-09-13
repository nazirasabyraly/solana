export default function BridgeView() {
    return (
      <div className="max-w-xl mx-auto bg-[#0b1220]/60 border border-white/10 rounded-3xl p-8 space-y-6">
        {/* From */}
        <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Из</span>
            <span className="text-slate-400 text-sm">Баланс: 12.5 SOL</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/icons/solana.svg"
                alt="Solana"
                className="h-6 w-6"
              />
              <span className="font-semibold text-white">Solana</span>
            </div>
            <input
              type="text"
              value="1.5"
              className="bg-transparent text-2xl font-bold text-right outline-none"
            />
            <span className="ml-2 text-slate-300">SOL</span>
          </div>
        </div>
  
        {/* Arrow */}
        <div className="flex justify-center">
          <div className="h-10 w-10 rounded-full bg-black/30 flex items-center justify-center">
            ↓
          </div>
        </div>
  
        {/* To */}
        <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">В</span>
            <span className="text-slate-400 text-sm">Баланс: 0 ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/icons/ethereum.svg"
                alt="Ethereum"
                className="h-6 w-6"
              />
              <span className="font-semibold text-white">Ethereum</span>
            </div>
            <input
              type="text"
              value="1.498"
              className="bg-transparent text-2xl font-bold text-right outline-none"
            />
            <span className="ml-2 text-slate-300">ETH</span>
          </div>
        </div>
  
        {/* Info */}
        <div className="flex justify-between text-slate-400 text-sm">
          <span>Комиссия моста</span>
          <span>~0.002 SOL</span>
        </div>
        <div className="flex justify-between text-slate-400 text-sm">
          <span>Время в пути</span>
          <span>~20 минут</span>
        </div>
  
        {/* Button */}
        <button className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white">
          Отправить
        </button>
      </div>
    );
  }
  