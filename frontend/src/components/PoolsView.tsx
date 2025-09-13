export default function PoolsView() {
    return (
      <div className="max-w-2xl mx-auto bg-[#0b1220]/60 border border-white/10 rounded-2xl p-6">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Управление ликвидностью</h2>
          <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">
            + Новая позиция
          </button>
        </div>
  
        {/* Токены */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 py-3 rounded-xl bg-black/30 border border-white/10 text-white font-semibold">
            <span className="mr-2">🌐</span> SOL
          </button>
          <button className="flex-1 py-3 rounded-xl bg-black/30 border border-white/10 text-white font-semibold">
            <span className="mr-2">💲</span> USDC
          </button>
        </div>
  
        {/* Уровень комиссии */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Уровень комиссии</p>
          <div className="grid grid-cols-3 gap-3">
            <button className="py-3 rounded-xl bg-black/30 border border-white/10 text-slate-300 hover:bg-indigo-500/30">
              0.05% <br /><span className="text-xs">Для стейблкоинов</span>
            </button>
            <button className="py-3 rounded-xl bg-indigo-600 text-white font-semibold">
              0.30% <br /><span className="text-xs">Стандартный</span>
            </button>
            <button className="py-3 rounded-xl bg-black/30 border border-white/10 text-slate-300 hover:bg-indigo-500/30">
              1.00% <br /><span className="text-xs">Для экзотики</span>
            </button>
          </div>
        </div>
  
        {/* Ценовой диапазон */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Ценовой диапазон</p>
          <div className="rounded-xl bg-black/20 border border-white/10 p-4 mb-3 text-center text-slate-400">
            <p><strong className="text-white">Текущая цена:</strong> 140.50 USDC за SOL</p>
            <div className="mt-3">[Здесь будет визуальный селектор диапазона]</div>
          </div>
          <div className="flex gap-4">
            <input
              className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
              placeholder="120.00"
            />
            <input
              className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
              placeholder="160.00"
            />
          </div>
        </div>
  
        {/* Сумма депозита */}
        <div className="mb-6 space-y-3">
          <input
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
            placeholder="0.0 SOL"
          />
          <input
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white"
            placeholder="0.0 USDC"
          />
        </div>
  
        {/* Кнопка */}
        <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
          Добавить ликвидность
        </button>
      </div>
    );
  }
  