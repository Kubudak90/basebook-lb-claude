"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TokenSelect } from "./token-select"
import { ArrowDown, Settings } from "lucide-react"
import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACTS, TOKENS } from "@/lib/contracts/addresses"
import { LBRouterABI, ERC20ABI } from "@/lib/contracts/abis"
import { useTokenBalance } from "@/lib/hooks/use-token-balance"
import { useTokenAllowance } from "@/lib/hooks/use-token-allowance"
import { parseUnits } from "viem"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
}

export function SwapCard() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()

  const [fromToken, setFromToken] = useState<Token | null>(TOKENS.WETH)
  const [toToken, setToToken] = useState<Token | null>(TOKENS.USDC)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  const { formattedBalance: fromBalance } = useTokenBalance(fromToken?.address as `0x${string}`)
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(
    fromToken?.address as `0x${string}`,
    CONTRACTS.LBRouter as `0x${string}`,
  )

  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>()
  const [swapTxHash, setSwapTxHash] = useState<`0x${string}` | undefined>()

  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  })

  const { isLoading: isSwapping } = useWaitForTransactionReceipt({
    hash: swapTxHash,
  })

  const handleSwap = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const needsApproval = () => {
    if (!fromAmount || !fromToken) return false
    try {
      const amount = parseUnits(fromAmount, fromToken.decimals)
      return (allowance as bigint) < amount
    } catch {
      return false
    }
  }

  const handleApprove = async () => {
    if (!fromToken || !fromAmount) return

    try {
      const amount = parseUnits(fromAmount, fromToken.decimals)
      const hash = await writeContractAsync({
        address: fromToken.address as `0x${string}`,
        abi: ERC20ABI,
        functionName: "approve",
        args: [CONTRACTS.LBRouter, amount],
      })

      setApproveTxHash(hash)
      toast({
        title: "Approval submitted",
        description: "Waiting for confirmation...",
      })

      await refetchAllowance()
    } catch (error: any) {
      toast({
        title: "Approval failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleSwapTokens = async () => {
    if (!fromToken || !toToken || !fromAmount || !address) return

    try {
      const amountIn = parseUnits(fromAmount, fromToken.decimals)
      const minAmountOut = toAmount
        ? parseUnits(
          (Number.parseFloat(toAmount) * (1 - Number.parseFloat(slippage) / 100)).toFixed(toToken.decimals),
          toToken.decimals,
        )
        : BigInt(0)

      // For simplicity, using bin step 25 (adjust based on actual pools)
      const hash = await writeContractAsync({
        address: CONTRACTS.LBRouter as `0x${string}`,
        abi: LBRouterABI,
        functionName: "swapExactTokensForTokens",
        args: [
          amountIn,
          minAmountOut,
          [BigInt(25)], // pairBinSteps
          [fromToken.address as `0x${string}`, toToken.address as `0x${string}`],
          address,
          BigInt(Math.floor(Date.now() / 1000) + 1200), // 20 min deadline
        ],
      })

      setSwapTxHash(hash)
      toast({
        title: "Swap submitted",
        description: "Waiting for confirmation...",
      })

      setFromAmount("")
      setToAmount("")
    } catch (error: any) {
      toast({
        title: "Swap failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Swap</span>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">From</span>
            <span className="text-muted-foreground">Balance: {fromBalance}</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1"
            />
            <TokenSelect selectedToken={fromToken} onSelectToken={setFromToken} excludeToken={toToken} />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwap} className="rounded-full">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">To</span>
            <span className="text-muted-foreground">Estimated</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="flex-1"
            />
            <TokenSelect selectedToken={toToken} onSelectToken={setToToken} excludeToken={fromToken} />
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && (
          <div className="space-y-2 p-3 bg-muted rounded-lg text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span>
                1 {fromToken?.symbol} ≈ {(Number.parseFloat(toAmount) / Number.parseFloat(fromAmount)).toFixed(6)}{" "}
                {toToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span>{slippage}%</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isConnected ? (
          <Button className="w-full" disabled>
            Connect Wallet
          </Button>
        ) : needsApproval() ? (
          <Button className="w-full" onClick={handleApprove} disabled={isApproving}>
            {isApproving ? (
              <>
                <Spinner className="mr-2" />
                Approving...
              </>
            ) : (
              `Approve ${fromToken?.symbol}`
            )}
          </Button>
        ) : (
          <Button className="w-full" onClick={handleSwapTokens} disabled={!fromAmount || !toAmount || isSwapping}>
            {isSwapping ? (
              <>
                <Spinner className="mr-2" />
                Swapping...
              </>
            ) : (
              "Swap"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
