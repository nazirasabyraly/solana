// config/Tokens.ts

export type TokenInfo = {
  symbol: string;
  name: string;
  mint: string;
  logo: string;
  dec: number; // Добавляем поле decimals
};

export const TOKENS = [
  {
    symbol: "SOL",
    mint: "...",
    dec: 9,
    logoURI: "/icons/solana.svg",
  },
  {
    symbol: "USDT",
    mint: "...",
    dec: 6,
    logoURI: "/icons/usdt.png",
  },
  {
    symbol: "mSOL",
    mint: "...",
    dec: 9,
    logoURI: "/icons/msol.png",
  },
  {
    symbol: "RAY",
    mint: "...",
    dec: 6,
    logoURI: "/icons/ray.png",
  },
  {
    symbol: "ORCA",
    mint: "...",
    dec: 6,
    logoURI: "/icons/orca.png",
  },
  {
    symbol: "JUP",
    mint: "...",
    dec: 6,
    logoURI: "/icons/jup.png",
  },
  {
    symbol: "wETH",
    mint: "...",
    dec: 8,
    logoURI: "/icons/ethereum.svg",
  },
  {
    symbol: "wBTC",
    mint: "...",
    dec: 8,
    logoURI: "/icons/wbtc.png",
  },
];
