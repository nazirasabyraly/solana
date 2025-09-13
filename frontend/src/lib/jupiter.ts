// src/lib/jupiter.ts
import { createJupiterApiClient, type QuoteResponse } from '@jup-ag/api'
import { Connection, VersionedTransaction } from '@solana/web3.js'

const basePath = import.meta.env.VITE_JUP_BASE || 'https://lite-api.jup.ag'
export const jup = createJupiterApiClient({ basePath })

// Локальный минимальный тип под ответ quoteGet
export type QuoteGetResponse = { data: QuoteResponse[] }

// Запрос котировок (возвращаем массив маршрутов в поле data)
export async function getQuote(params: {
  inputMint: string
  outputMint: string
  amount: number            // в минимальных единицах
  slippageBps?: number
  onlyDirectRoutes?: boolean
}): Promise<QuoteGetResponse> {
  return await jup.quoteGet({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    slippageBps: params.slippageBps ?? 50,
    onlyDirectRoutes: params.onlyDirectRoutes ?? false,
  }) as QuoteGetResponse
}

// Удобно: сразу лучший маршрут (data[0]) или null
export async function getBestRoute(params: {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
  onlyDirectRoutes?: boolean
}): Promise<QuoteResponse | null> {
  const res = await getQuote(params)
  return res?.data?.[0] ?? null
}

export async function swapViaApi(opts: {
  quoteResponse: QuoteResponse
  userPublicKey: string
  wrapAndUnwrapSol?: boolean
}) {
  const { swapTransaction } = await jup.swapPost({
    swapRequest: {
      quoteResponse: opts.quoteResponse,
      userPublicKey: opts.userPublicKey,
      wrapAndUnwrapSol: opts.wrapAndUnwrapSol ?? true,
      dynamicComputeUnitLimit: true,
      useSharedAccounts: true,
      // без prioritizationFeeLamports — он необязателен и имеет сложный union-тип
    },
  })
  return swapTransaction as string
}

export async function signAndSendBase64Tx(
  connection: Connection,
  base64tx: string,
  signers: { signAllTransactions?: any; signTransaction?: any }
) {
  const txBuf = Buffer.from(base64tx, 'base64')
  const tx = VersionedTransaction.deserialize(txBuf)

  if (signers.signTransaction) {
    const signed = await signers.signTransaction(tx)
    const sig = await connection.sendTransaction(signed, { skipPreflight: false, maxRetries: 3 })
    await connection.confirmTransaction(sig, 'confirmed')
    return sig
  }
  if (signers.signAllTransactions) {
    const [signed] = await signers.signAllTransactions([tx])
    const sig = await connection.sendTransaction(signed, { skipPreflight: false, maxRetries: 3 })
    await connection.confirmTransaction(sig, 'confirmed')
    return sig
  }
  throw new Error('Wallet does not support signing')
}
