import Web3 from 'web3'

let web3

// browser && metamask
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    web3 = new Web3(window.ethereum)
} else {
    // Server side or browser w/no metamask
    const provider = new Web3.providers.HttpProvider(
        process.env.SEPOLIA_TESTNET_ENDPOINT + process.env.INFURA_API_KEY
    )
    web3 = new Web3(provider)
}

export default web3
