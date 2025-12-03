'use client'

import { useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import { Token } from "@/types/swapTypes"
import { formatUnits } from "ethers/lib/utils"
import { useWalletSafe } from "./useWalletSafe"
import { UNISWAP_ROUTER } from "../constants/addresses"

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
]

export function useAllowance(token: Token | null): {
  allowance: string
  refetchAllowance: () => Promise<void>
} {
  const [allowance, setAllowance] = useState<string>("0")
  const wallet = useWalletSafe()

  const refetchAllowance = useCallback(async () => {
    if (!wallet || !token) return

    try {
      const { signer, userAddress } = wallet
      const contract = new ethers.Contract(token.address, ERC20_ABI, signer)
      const rawAllowance: ethers.BigNumber = await contract.allowance(
        userAddress,
        UNISWAP_ROUTER,
      )
      setAllowance(formatUnits(rawAllowance, token.decimals))
    } catch (err) {
      console.error("Error fetching allowance:", err)
      setAllowance("0")
    }
  }, [token, wallet])

  useEffect(() => {
    if (token) refetchAllowance()
  }, [refetchAllowance, token])

  return {
    allowance,
    refetchAllowance: refetchAllowance ?? (async () => {}),
  }
}
