'use client'

import React from "react"
import { useGlobal } from "../providers/GlobalProviders"

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "14px",
  border: "1px solid #555",
  cursor: "pointer",
}

const ConnectWallet = () => {
  const { connectWallet, disconnectWallet, walletConnected, userAddress } = useGlobal()

  const label =
    walletConnected && userAddress
      ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
      : "Connect Wallet"

  const handleClick = () => {
    if (walletConnected) disconnectWallet()
    else connectWallet()
  }

  return (
    <button style={buttonStyle} onClick={handleClick}>
      {label}
    </button>
  )
}

export default ConnectWallet
