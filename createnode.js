require('dotenv').config()

const Web3 = require('web3');
const AWSHttpProvider = require('@aws/web3-http-provider');

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}
const endpoint = process.env.NFT_HTTP_ENDPOINT
const web3 = new Web3(new AWSHttpProvider(endpoint, credentials));
web3.eth.getNodeInfo().then(console.log);