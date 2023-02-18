require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json')
const { ETHEREUM_PRIV_KEY, SEPOLIA_TESTNET_ENDPOINT, INFURA_API_KEY } = process.env

const provider = new HDWalletProvider(ETHEREUM_PRIV_KEY, SEPOLIA_TESTNET_ENDPOINT + INFURA_API_KEY)
const web3 = new Web3(provider)

const deploy = async () => {
    // account 0 is 0xbCa6F602D17d55374Bef6661D0298C7e41178bA2
    const [account] = await web3.eth.getAccounts()

    console.log('Attempting to deploy from account', account)

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: account })

    // initial testnet contract address: 0x8723D47Bb28E3F5C7493f4Ee0c36bb9953c16B25
    console.log('Factory contract deployed to', result.options.address)
    provider.engine.stop()
}
void deploy()
