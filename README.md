# ink! Counter Demo with Polkadot API (PAPI)

A beginner-friendly demo connecting a React frontend to an ink! smart contract using Polkadot-API (PAPI). This project demonstrates how to build a full-stack dApp on Polkadot with modern tooling.

## 🎯 What This Demo Shows

- **ink! Smart Contract**: A simple counter contract with increment/decrement functionality
- **React Frontend**: Modern UI built with Vite and TypeScript
- **PAPI Integration**: Using the new Polkadot API for type-safe contract interactions
- **Wallet Connection**: Support for Polkadot.js and Talisman wallets
- **Deployment**: Ready for hosting on Vercel/Netlify

## 🌐 Live Demo

**🚀 [View Live Demo](https://your-deployment-url.vercel.app)** (Update after deployment)


## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Rust toolchain with ink! support
- Polkadot.js browser extension
- Some WEST tokens for gas fees

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ink-papi-frontend-demo
npm install
cd frontend && npm install
```

### 2. Build the Contract

```bash
npm run build-contract
```

### 3. Deploy the Contract

```bash
npm run deploy
```

This will:
- Connect to your Polkadot.js wallet
- Upload the contract to Westend testnet
- Instantiate the contract
- Update the frontend with the contract address

### 4. Run the Frontend

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
ink-papi-frontend-demo/
├── counter/                 # ink! smart contract
│   ├── lib.rs              # Contract source code
│   ├── Cargo.toml          # Rust dependencies
│   └── target/ink/         # Built contract artifacts
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.tsx         # Main application component
│   │   └── App.css         # Styling
│   ├── .papi/              # Generated PAPI descriptors
│   └── package.json        # Frontend dependencies
├── contracts/              # Contract artifacts for PAPI
│   └── counter.contract    # Contract metadata
├── deploy.js               # Deployment script
└── README.md              # This file
```

## 🛠️ Development

### Contract Development

The ink! contract is located in `counter/lib.rs`. It provides:

- `increment()`: Increase counter by 1
- `decrement()`: Decrease counter by 1  
- `get()`: Read current counter value

### Frontend Development

The React frontend uses:

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety
- **PAPI**: Type-safe Polkadot API
- **Modern CSS**: Responsive design

### PAPI Descriptors

TypeScript descriptors are automatically generated from the contract:

```bash
cd frontend
papi ink add -k counter ../contracts/counter.contract
papi generate
```

## 🔧 Configuration

### Contract Address

After deployment, the contract address is automatically updated in `frontend/src/App.tsx`:

```typescript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'
```

### Network Configuration

The app connects to Westend testnet by default. To change networks, update the RPC URL in:

- `frontend/src/App.tsx` (frontend)
- `deploy.js` (deployment script)


**Option 3: Manual Upload**
```bash
cd frontend
npm run build
# Upload dist/ folder to any static hosting service
```

### Contract Deployment

The contract is deployed to Westend testnet. To deploy to other networks:

1. Update the RPC URL in `deploy.js`
2. Ensure you have tokens for gas fees
3. Run `npm run deploy`

## 📚 Learning Resources

- [PAPI Documentation](https://docs.polkadot.com/develop/toolkit/api-libraries/papi/)
- [ink! Documentation](https://use.ink/)
- [Polkadot.js Extension](https://polkadot.js.org/extension/)
- [Westend Testnet](https://westend.network/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Polkadot team for the amazing ecosystem
- PAPI team for the excellent developer experience
- ink! team for the smart contract framework
- React and Vite teams for the frontend tooling

## 📞 Support

If you have questions or need help:

- Open an issue on GitHub
- Check the documentation links above
- Join the Polkadot community Discord

---

**Happy Building! 🚀**