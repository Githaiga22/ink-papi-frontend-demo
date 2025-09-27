# ink-papi-frontend-demo

A minimal React + Vite frontend that connects to an ink! smart contract using **Polkadot-API (PAPI)** and the Ink! SDK.  
This project demonstrates:
- Connecting a frontend to a browser wallet (Polkadot.js / Talisman).
- Querying a contract state (e.g. PSP22 balance).
- Sending a signed transaction (e.g. PSP22 transfer).
- Deploying the frontend to **Vercel** or **Netlify**.

---


---



### Title: How I connected a React frontend to an ink! smart contract using Polkadot-API (PAPI)

**Author:** Allan Robinson — Polkadot Africa Contributor

**Date:** September 26, 2025

---

### TL;DR
This guide shows how to connect a React + Vite frontend to an ink! smart contract using PAPI (Polkadot-API) and the Ink! SDK.  
It covers: building the contract (`cargo contract`), generating type-safe descriptors with PAPI, wiring the frontend to a browser wallet, querying contract state, and sending signed transactions.

---

### Why PAPI?
Polkadot-API (PAPI) is the modern, modular JavaScript/TypeScript SDK for building dApps in the Polkadot ecosystem.  
It provides:
- Strong TypeScript support.
- A light-client-first approach.
- SDKs (including an Ink! SDK) that generate typed bindings from contract metadata — making contract interactions safer and easier to write.

---

### What I built
- A small React + Vite app that:
  - Connects to a browser wallet (Polkadot.js / Talisman).
  - Reads a PSP22 contract balance (read-only query).
  - Sends a transfer (signed transaction).
- The contract metadata is included in the repo and PAPI generated TypeScript descriptors were used to produce strongly typed calls.

---

### Steps I followed

#### 1. Build the ink! contract
Install `cargo-contract` and build:

```bash
cargo install cargo-contract --force
cargo contract build --release
# result: target/ink/<contract>.contract
