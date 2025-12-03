'use client'

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { Token } from "@/types/swapTypes"
import { useWalletSafe } from "./useWalletSafe"

const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
]

export function useTokenBalance(token: Token | null) {
  const [balance, setBalance] = useState<string>("0")
  const wallet = useWalletSafe()

  useEffect(() => {
    if (!wallet || !token) return

    const fetchBalance = async () => {
      try {
        const { signer, userAddress } = wallet
        const contract = new ethers.Contract(token.address, ERC20_ABI, signer)
        const tokenBalance: ethers.BigNumber = await contract.balanceOf(userAddress)
        setBalance(formatUnits(tokenBalance, token.decimals))
      } catch (err) {
        console.error("Error fetching balance:", err)
        setBalance("0")
      }
    }

    fetchBalance()
  }, [token, wallet])

  return balance
}
