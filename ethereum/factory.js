require('dotenv').config()
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  process.env.SEPOLIA_FACTORY_ADDRESS
);

export default instance;
