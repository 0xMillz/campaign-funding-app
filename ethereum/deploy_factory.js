const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname + '/../.env.local')})
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    process.env.ETHEREUM_PRIV_KEY,
    process.env.SEPOLIA_TESTNET_ENDPOINT + process.env.INFURA_API_KEY
)
const web3 = new Web3(provider)

const deploy_factory = async () => {
    // account 0 is 0xbCa6F602D17d55374Bef6661D0298C7e41178bA2
    const [account] = await web3.eth.getAccounts()

    console.log('Attempting to deploy factory contract from account', account)

    try {
      const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({
          gas: '1500000', // This should be a string, not a number (their typings file is wrong)
          from: account
        })

      // deployed testnet factory address: 0xE7770805c803e07F6F14CE264B16F201c5bcBdbC
      console.log('Factory contract deployed to', result.options.address)
    } catch (err) {
      console.error('Error deploying contract:', err)
    }
    provider.engine.stop()
}

void deploy_factory()
