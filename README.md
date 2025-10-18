# Demo QR-Approve Token (TRON TRC-20) — Next.js

## Description
The demo application allows:

- Merchants generate QR codes containing TRC-20 token approve payloads.

- Users scan QR codes using Web3-enabled wallets (TronLink, MetaMask with TRON network, Trust Wallet Web dApp, OKX Web3, etc.).

- The `/approve` page displays interesting information and allows approving tokens (default unlimited) using the wallet.

- There is a **Demo Mode** (hides UI warnings for convenient video recording), but the system still requires a wallet to sign.

**Note:** Only run on TRON Shasta testnet for demo recording. Do not use mainnet.

## Stack & Technology
- Next.js (React)
- Tailwind CSS (optional)
- tronWeb (connect TRON, TronLink)
- qrcode.react (display QR)
- API routes (Next.js) to create payload, verify, log approve
- Demo Mode toggle (UI client-side)

## Environment configuration
Create `.env.local` file with:
