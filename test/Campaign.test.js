const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let account0 // contract manager
let account1 // dummy 2nd account (campaign contributor, approver and/or funds recipient)
let factory
let campaignAddress
let campaign

beforeEach(async () => {
    ;[account0, account1] = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: account0, gas: '1500000' })

    await factory.methods.createCampaign('100').send({
        from: account0,
        gas: '1500000'
    })
    ;[campaignAddress] = await factory.methods.getDeployedCampaigns().call()
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call()
        assert.equal(account0, manager)
    })

    it('allows users to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: account1
        })
        const isContributor = await campaign.methods.approvers(account1).call()
        assert(isContributor)
    })

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: account1
            })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('[SCP-97] Fund Trading Team', '100', account1).send({
            from: account0,
            gas: '1000000'
        })
        const request = await campaign.methods.requests(0).call()

        assert.equal('[SCP-97] Fund Trading Team', request.description)
    })

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: account0,
            value: web3.utils.toWei('10', 'ether')
        })

        await campaign.methods
            .createRequest('[SCP-98] Fund Marketing', web3.utils.toWei('5', 'ether'), account1)
            .send({ from: account0, gas: '1000000' })

        await campaign.methods.approveRequest(0).send({
            from: account0,
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: account0,
            gas: '1000000'
        })

        let balance = await web3.eth.getBalance(account1)
        balance = web3.utils.fromWei(balance, 'ether')
        balance = parseFloat(balance)
        assert(balance > 104)
    })
})
