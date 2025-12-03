'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { ethers } from "ethers"
import { SwapTransaction } from "@/types/swapTypes"

interface ExtendedEthereum extends ethers.providers.ExternalProvider {
  on?(
    event: "accountsChanged",
    handler: (accounts: string[]) => void
  ): void
  on?(event: "chainChanged", handler: (chainId: string) => void): void

  removeListener?(
    event: "accountsChanged",
    handler: (accounts: string[]) => void
  ): void
  removeListener?(
    event: "chainChanged",
    handler: (chainId: string) => void
  ): void
}

interface GlobalContextProps {
  userAddress: string | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  walletConnected: boolean
  txHistory: SwapTransaction[]
  addTransaction: (tx: SwapTransaction) => void
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const GlobalContext = createContext<GlobalContextProps>({
  userAddress: null,
  provider: null,
  signer: null,
  walletConnected: false,
  txHistory: [],
  addTransaction: () => {},
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

export const useGlobal = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [txHistory, setTxHistory] = useState<SwapTransaction[]>([])

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.error("No injected wallet (window.ethereum) found")
      return
    }

    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      await web3Provider.send("eth_requestAccounts", [])
      const signerInstance = web3Provider.getSigner()
      const address = await signerInstance.getAddress()

      setProvider(web3Provider)
      setSigner(signerInstance)
      setUserAddress(address)
      setWalletConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setUserAddress(null)
    setWalletConnected(false)
  }

  useEffect(() => {
    setWalletConnected(!!userAddress && !!signer && !!provider)
  }, [userAddress, signer, provider])

useEffect(() => {
  if (typeof window === "undefined" || !window.ethereum) return

  const ethereum = window.ethereum as ExtendedEthereum

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setUserAddress(accounts[0])
      setWalletConnected(true)
    }
  }

  const handleChainChanged = () => {
    if (!window.ethereum) return
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(web3Provider)
    setSigner(web3Provider.getSigner())
  }

  ethereum.on?.("accountsChanged", handleAccountsChanged)
  ethereum.on?.("chainChanged", handleChainChanged)

  return () => {
    ethereum.removeListener?.("accountsChanged", handleAccountsChanged)
    ethereum.removeListener?.("chainChanged", handleChainChanged)
  }
}, [])

  const contextValue = useMemo(() => {
    const addTransaction = (tx: SwapTransaction) => {
      setTxHistory((prev) => [tx, ...prev.slice(0, 9)])
    }

    return {
      userAddress,
      provider,
      signer,
      walletConnected,
      txHistory,
      addTransaction,
      connectWallet,
      disconnectWallet,
    }
  }, [userAddress, provider, signer, walletConnected, txHistory])

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}
