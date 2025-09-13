export default function ProTradeView() {
    return (
      <div className="grid grid-cols-3 gap-6">
        {/* Левая часть: форма покупки/продажи */}
        <div className="col-span-1 bg-[#0b1220]/60 border border-white/10 rounded-2xl p-5">
          <div className="flex gap-4 mb-4">
            <button className="flex-1 py-2 rounded-xl bg-green-600/30 text-green-200 font-semibold">Купить</button>
            <button className="flex-1 py-2 rounded-xl bg-red-600/30 text-red-200 font-semibold">Продать</button>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <label>Цена (USDC)</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10" value="140.50" />
            </div>
            <div>
              <label>Количество (SOL)</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
            </div>
            <div>
              <label>Всего (USDC)</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-green-600 rounded-xl text-white font-semibold">
            Купить SOL
          </button>
        </div>
  
        {/* Центр: график и ордера */}
        <div className="col-span-1 bg-[#0b1220]/60 border border-white/10 rounded-2xl p-5 flex flex-col">
          <h2 className="mb-4 font-semibold text-white">SOL/USDC</h2>
          <div className="flex-1 flex items-center justify-center text-slate-400">
            [Здесь будет график цены]
          </div>
          <div className="mt-4">
            <h3 className="text-slate-300 mb-2">Мои ордера</h3>
            <div className="text-slate-500 text-center">Нет открытых ордеров</div>
          </div>
        </div>
  
        {/* Правая часть: книга ордеров */}
        <div className="col-span-1 bg-[#0b1220]/60 border border-white/10 rounded-2xl p-5">
          <h2 className="mb-4 font-semibold text-white">Книга ордеров</h2>
          <div className="text-red-400 text-sm space-y-1">
            <div className="flex justify-between"><span>140.85</span><span>0.50</span><span>70.42</span></div>
            <div className="flex justify-between"><span>140.82</span><span>1.20</span><span>168.98</span></div>
            <div className="flex justify-between"><span>140.80</span><span>5.60</span><span>788.48</span></div>
          </div>
          <div className="text-green-400 font-bold text-center my-2">140.55 USDC</div>
          <div className="text-green-400 text-sm space-y-1">
            <div className="flex justify-between"><span>140.50</span><span>4.10</span><span>576.05</span></div>
            <div className="flex justify-between"><span>140.48</span><span>2.30</span><span>323.10</span></div>
            <div className="flex justify-between"><span>140.45</span><span>10.80</span><span>1516.86</span></div>
          </div>
        </div>
      </div>
    );
  }
  