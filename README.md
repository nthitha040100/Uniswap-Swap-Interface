# 🦄 Uniswap Swap Interface

A clean and functional token swap interface powered by Uniswap, built with Next.js and using **ethers.js** with a browser-injected wallet (MetaMask, Rabby, etc.) for blockchain interactions.

---

## 🧰 Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Blockchain Interaction**:  
  - **Injected wallet** via `window.ethereum` (MetaMask, Rabby, etc.)
  - **ethers.js v5** – for transaction signing and Uniswap integration
- **Swapping Logic**: Uniswap SDK
- **State Management**: React Context API
- **Notifications**: react-toastify

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nthitha040100/uniswap-swap-interface.git
   cd uniswap-swap-interface
   ```
2. **Install dependencies:**:
   ```bash
   npm install
   ```
3. **Environment Variables ( optional )**:
   For the basic swap interface and wallet connection, env vars are not required.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser.

> 💡 Make sure you have a browser wallet installed (e.g., MetaMask or Rabby) and that it’s unlocked. The app uses window.ethereum under the hood.

---

## ⚖️ Tradeoff Decisions

### 🔧 Vanilla ethers.js + injected wallets

Instead of using an additional wallet SDK, the app now uses:
- `window.ethereum` from the browser wallet (MetaMask/Rabby/etc.
- `ethers.providers.Web3Provider` and `signer` for all reads/writes
- A custom `GlobalProvider` + `ConnectWallet` button to manage:
  - connection/disconnection
  - current address
  - signer + provider
  - transaction history
Why this approach?
- Keeps dependencies minimal and transparent.
- Easy to reason about: everything goes through `ethers` and your own hooks.
- Swapping out the wallet layer later (e.g., to wagmi/RainbowKit or Web3Modal) is straightforward because the rest of the app talks only to `provider`, `signer`, and `userAddress`.

> **Decision**: Use vanilla ethers.js + injected wallets for maximum control and a small dependency surface, while keeping an easy migration path to higher-level wallet libraries if needed.

### 🔀 Uniswap SDK vs REST API

- **REST APIs** can be simpler but limit flexibility and may depend on external infra.
- The **Uniswap SDK** allows you to build fully custom trading flows (e.g., quotes, gas estimation, slippage control).

> **Decision**: Went with the **Uniswap SDK** for direct, customizable access to swap logic, ensuring full control and a better user experience.

---

For Live Demo [Click Here](https://uniswap-swap-interface.vercel.app)
