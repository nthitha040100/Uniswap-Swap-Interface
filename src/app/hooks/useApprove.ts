'use client'

import { useState } from "react"
import { ethers } from "ethers"
import { toast } from "react-toastify"
import { Token } from "@/types/swapTypes"
import { parseUnits } from "ethers/lib/utils"
import { useWalletSafe } from "./useWalletSafe"
import { UNISWAP_ROUTER } from "../constants/addresses"

const ERC20_ABI = [
  "function approve(address spender, uint256 value) returns (bool)",
]

type ApproveStatus = {
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
  txHash?: string
}

export const useApprove = () => {
  const wallet = useWalletSafe()
  const [status, setStatus] = useState<ApproveStatus>({
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  })

  const approveToken = async ({
    token,
    amount,
  }: {
    token: Token
    amount: string
  }): Promise<void> => {
    if (!wallet) {
      toast.error("Wallet not connected")
      return
    }

    const { signer } = wallet

    try {
      toast.dismiss()
      toast.loading("Approving...")

      setStatus({
        isPending: true,
        isSuccess: false,
        isError: false,
        error: null,
      })

      const contract = new ethers.Contract(token.address, ERC20_ABI, signer)
      const value = parseUnits(amount, token.decimals)

      const tx = await contract.approve(UNISWAP_ROUTER, value)
      const receipt = await tx.wait()

      toast.dismiss()
      toast.success("Token Approved")

      setStatus({
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        txHash: receipt.transactionHash,
      })
    } catch (err) {
      console.error("Approval error:", err)
      toast.dismiss()
      toast.error("Approval failed")

      setStatus({
        isPending: false,
        isSuccess: false,
        isError: true,
        error: err instanceof Error ? err : new Error("Approval failed"),
      })
    }
  }

  return {
    approveToken,
    approveStatus: status,
  }
}
