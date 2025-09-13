// src/hooks/usePythPrice.ts
import { useEffect, useState } from 'react';

export function usePythPrice(feedId?: string, pollMs = 5000) {
  const [data, setData] = useState<{ price?: number; conf?: number; expo?: number }>();
  useEffect(() => {
    if (!feedId) return;
    let t: any, mounted = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/pyth/price?feed=${feedId}`, { cache: 'no-store' });
        const j = await r.json(); // ожидаем { price, conf, expo } или null
        if (mounted) setData(j || undefined);
      } catch {
        /* noop */
      }
    };
    load();
    t = setInterval(load, pollMs);
    return () => { mounted = false; if (t) clearInterval(t); };
  }, [feedId, pollMs]);

  return data;
}
