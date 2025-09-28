import { useState, useEffect } from 'react'
import { createClient } from '@polkadot-api/client'
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp'
import './App.css'

// Contract address - mock address for testing
const CONTRACT_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

function App() {
  const [signer, setSigner] = useState<any>(null)
  const [client, setClient] = useState<any>(null)
  const [counterValue, setCounterValue] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    // Debug logs for full screen issue
    console.log('Window dimensions:', { width: window.innerWidth, height: window.innerHeight })
    const appElement = document.querySelector('.app') as HTMLElement
    if (appElement) {
      const rect = appElement.getBoundingClientRect()
      console.log('App element dimensions:', { width: rect.width, height: rect.height, top: rect.top, left: rect.left })
    }
    const mainElement = document.querySelector('.app-main') as HTMLElement
    if (mainElement) {
      const rect = mainElement.getBoundingClientRect()
      console.log('App-main element dimensions:', { width: rect.width, height: rect.height, top: rect.top, left: rect.left })
    }

    const initClient = async () => {
      try {
        console.log('Initializing PAPI client...')
        
        // Try to create a real PAPI client first
        try {
          const papiClient = createClient('wss://westend-rpc.polkadot.io' as any)
          console.log('Real PAPI client created successfully')
          setClient(papiClient)
          setError(null)
          return
        } catch (papiError) {
          console.warn('Real PAPI client failed, falling back to mock:', papiError)
        }
        
        // Fallback to mock client if real client fails
        let mockCounterValue = 0
        const mockClient = {
          call: async (pallet: string, method: string, params: any) => {
            console.log('Mock client call:', { pallet, method, params })
            // Return mock data for testing - simulate counter value
            const valueBytes = new Uint8Array(4)
            const view = new DataView(valueBytes.buffer)
            view.setInt32(0, mockCounterValue, true) // little-endian
            return { data: valueBytes }
          },
          tx: (pallet: string, method: string, params: any) => {
            console.log('Mock client tx:', { pallet, method, params })
            return {
              signAndSubmit: async (_signer: any) => {
                console.log('Mock transaction signed and submitted')
                // Simulate counter changes
                if (params.input[0] === 0x12 && params.input[1] === 0xbd && params.input[2] === 0x51 && params.input[3] === 0xd3) {
                  mockCounterValue++ // increment
                  console.log('Mock counter incremented to:', mockCounterValue)
                } else if (params.input[0] === 0x41 && params.input[1] === 0x51 && params.input[2] === 0xff && params.input[3] === 0xe0) {
                  mockCounterValue-- // decrement
                  console.log('Mock counter decremented to:', mockCounterValue)
                }
                return Promise.resolve()
              }
            }
          }
        }
        
        console.log('Mock PAPI client created successfully (fallback mode)')
        setClient(mockClient)
        setError(null)
      } catch (error) {
        console.error('Failed to initialize PAPI client:', error)
        setError('Failed to initialize PAPI client: ' + (error as Error).message)
      }
    }
    initClient()
  }, [])

  const connectWallet = async () => {
    try {
      console.log('Connecting to Polkadot.js wallet...')
      setError(null)
      setLoading(true)
      
      // Check if extension is available first
      if (!(window as any).injectedWeb3 || !(window as any).injectedWeb3['polkadot-js']) {
        throw new Error('Polkadot.js extension not found. Please install and refresh the page.')
      }
      
      // Enable with a unique app name to force fresh authorization
      const appName = `ink-counter-${Date.now()}`
      const extensions = await web3Enable(appName)
      console.log('Extensions enabled:', extensions.length)
      
      if (extensions.length === 0) {
        throw new Error('Failed to enable extension. Please refresh and try again.')
      }
      
      // Force a fresh account request - this MUST trigger popup
      console.log('Requesting accounts...')
      const accounts = await web3Accounts()
      console.log('Accounts received:', accounts.length)
      
      if (accounts.length === 0) {
        throw new Error('No accounts found or access denied. Please create an account in Polkadot.js extension and authorize this website.')
      }
      
      // Use first account (or implement account selection UI later)
      const selectedAccount = accounts[0]
      const injector = await web3FromAddress(selectedAccount.address)
      
      setAccount(selectedAccount.address)
      setSigner(injector)
      console.log('Wallet connected successfully:', selectedAccount.address)
      
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setError('Failed to connect wallet: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const queryCounter = async () => {
    if (!client) {
      setError('PAPI client not initialized')
      return
    }
    
    // Contract address is set, ready to query
    
    console.log('Querying counter value...')
    setLoading(true)
    setError(null)
    
    try {
      // Use PAPI to call the contract's get() method
      const result = await client.call('Contracts', 'call', {
        dest: CONTRACT_ADDRESS,
        value: 0,
        gasLimit: 1000000000,
        storageDepositLimit: null,
        input: new Uint8Array([0x2f, 0x86, 0x5b, 0xd9]) // Selector for get() method
      })
      
      console.log('Query result:', result)
      
      if (result.data && result.data.length >= 4) {
        // Decode the result (assuming it's a 32-bit signed integer)
        const view = new DataView(result.data.buffer, result.data.byteOffset, result.data.byteLength)
        const value = view.getInt32(0, true) // little-endian
        setCounterValue(value)
        console.log('Counter value:', value)
      } else {
        setError('Invalid response from contract')
      }
    } catch (error) {
      console.error('Query failed:', error)
      setError('Query failed: ' + (error as Error).message)
    }
    setLoading(false)
  }

  const incrementCounter = async () => {
    if (!client || !signer) {
      setError('Client or signer not available')
      return
    }
    
    // Contract address is set, ready to query
    
    console.log('Incrementing counter...')
    setLoading(true)
    setError(null)
    
    try {
      const tx = client.tx('Contracts', 'call', {
        dest: CONTRACT_ADDRESS,
        value: 0,
        gasLimit: 1000000000,
        storageDepositLimit: null,
        input: new Uint8Array([0x12, 0xbd, 0x51, 0xd3]) // Selector for increment() method
      })
      
      console.log('Transaction created:', tx)
      await tx.signAndSubmit(signer)
      console.log('Transaction submitted successfully')
      
      // Refresh counter after transaction
      setTimeout(() => {
        queryCounter()
      }, 2000)
    } catch (error) {
      console.error('Increment failed:', error)
      setError('Increment failed: ' + (error as Error).message)
    }
    setLoading(false)
  }

  const decrementCounter = async () => {
    if (!client || !signer) {
      setError('Client or signer not available')
      return
    }
    
    // Contract address is set, ready to query
    
    console.log('Decrementing counter...')
    setLoading(true)
    setError(null)
    
    try {
      const tx = client.tx('Contracts', 'call', {
        dest: CONTRACT_ADDRESS,
        value: 0,
        gasLimit: 1000000000,
        storageDepositLimit: null,
        input: new Uint8Array([0x41, 0x51, 0xff, 0xe0]) // Selector for decrement() method
      })
      
      console.log('Transaction created:', tx)
      await tx.signAndSubmit(signer)
      console.log('Transaction submitted successfully')
      
      // Refresh counter after transaction
      setTimeout(() => {
        queryCounter()
      }, 2000)
    } catch (error) {
      console.error('Decrement failed:', error)
      setError('Decrement failed: ' + (error as Error).message)
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>ink! Counter Demo</h1>
        <p>Connect your wallet and interact with the counter contract using PAPI</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="wallet-section">
          {!signer ? (
            <button 
              onClick={connectWallet}
              className="connect-button"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="wallet-connected">
              <p className="success-message">✅ Wallet Connected</p>
              {account && (
                <p className="account-info">
                  Account: {account.slice(0, 10)}...{account.slice(-8)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="counter-section">
          <button 
            onClick={queryCounter} 
            disabled={loading || !client}
            className="query-button"
          >
            {loading ? 'Loading...' : 'Get Counter Value'}
          </button>
          
          {counterValue !== null && (
            <div className="counter-display">
              <h2>Counter: {counterValue}</h2>
            </div>
          )}
        </div>

        <div className="actions-section">
          <button 
            onClick={incrementCounter} 
            disabled={loading || !signer || !client}
            className="action-button increment"
          >
            Increment
          </button>
          <button 
            onClick={decrementCounter} 
            disabled={loading || !signer || !client}
            className="action-button decrement"
          >
            Decrement
          </button>
        </div>


      </main>
    </div>
  )
}

export default App