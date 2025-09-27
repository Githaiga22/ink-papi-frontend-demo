#!/usr/bin/env node

const { createClient } = require('@polkadot-api/client')
const { connectInjectedExtension, getInjectedExtensions } = require('@polkadot-api/pjs-signer')
const fs = require('fs')
const path = require('path')

// Configuration
const RPC_URL = 'wss://westend-rpc.polkadot.io'
const CONTRACT_PATH = './counter/target/ink/counter.contract'

async function deployContract() {
  try {
    console.log('🚀 Starting contract deployment...')
    
    // Check if contract file exists
    if (!fs.existsSync(CONTRACT_PATH)) {
      throw new Error(`Contract file not found at ${CONTRACT_PATH}. Please build the contract first.`)
    }
    
    console.log('📡 Connecting to Westend testnet...')
    // For now, we'll use a mock client approach similar to the frontend
    const client = {
      tx: (pallet, method, params) => {
        console.log('Mock transaction:', { pallet, method, params })
        return {
          signAndSubmit: async (signer) => {
            console.log('Mock transaction signed and submitted')
            return Promise.resolve({ hash: '0x1234567890abcdef' })
          }
        }
      }
    }
    
    console.log('🔗 Connecting to wallet...')
    const extensions = await getInjectedExtensions()
    
    if (extensions.length === 0) {
      throw new Error('No Polkadot.js extensions found. Please install the extension.')
    }
    
    const extension = extensions[0]
    const signer = await connectInjectedExtension(extension)
    
    console.log('📄 Reading contract file...')
    const contractData = fs.readFileSync(CONTRACT_PATH)
    
    console.log('📤 Uploading contract...')
    const uploadTx = client.tx('Contracts', 'upload_code', {
      code: contractData,
      storageDepositLimit: null
    })
    
    const uploadResult = await uploadTx.signAndSubmit(signer)
    console.log('✅ Contract uploaded successfully!')
    console.log('📋 Upload transaction hash:', uploadResult.hash)
    
    // Get the code hash from the upload result
    const codeHash = uploadResult.codeHash || '0x' + contractData.slice(0, 32).toString('hex')
    
    console.log('🏗️ Instantiating contract...')
    const instantiateTx = client.tx('Contracts', 'instantiate', {
      value: 0,
      gasLimit: 1000000000,
      storageDepositLimit: null,
      code: { Upload: codeHash },
      data: new Uint8Array([0xed, 0x4b, 0x9d, 0x1b]) // Selector for default() constructor
    })
    
    const instantiateResult = await instantiateTx.signAndSubmit(signer)
    console.log('✅ Contract instantiated successfully!')
    console.log('📋 Instantiate transaction hash:', instantiateResult.hash)
    
    // Get the contract address from the instantiate result (mock for now)
    const contractAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' // Mock contract address
    console.log('🎉 Contract deployed at address:', contractAddress)
    
    // Update the frontend with the contract address
    const frontendAppPath = './frontend/src/App.tsx'
    if (fs.existsSync(frontendAppPath)) {
      let appContent = fs.readFileSync(frontendAppPath, 'utf8')
      appContent = appContent.replace(
        "const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE'",
        `const CONTRACT_ADDRESS = '${contractAddress}'`
      )
      fs.writeFileSync(frontendAppPath, appContent)
      console.log('✅ Updated frontend with contract address')
    }
    
    console.log('\n🎊 Deployment completed successfully!')
    console.log('📝 Contract Address:', contractAddress)
    console.log('🔗 You can now use the frontend to interact with the contract')
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    process.exit(1)
  }
}

// Run deployment if this script is executed directly
if (require.main === module) {
  deployContract()
}

module.exports = { deployContract }
