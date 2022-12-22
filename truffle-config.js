require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
// const WebSocket = require('ws');
const { NFT_HTTP_ENDPOINT, MNEMONIC } = process.env;

// var ws = new WebSocket(NFT_HTTP_ENDPOINT, {
//     origin: NFT_HTTP_ENDPOINT,
//     headers: { Authorization: 'base64 auth' }
// });

// const webSocketProvider = new Web3.providers.WebsocketProvider(NFT_HTTP_ENDPOINT);

module.exports = {

  networks: {
    development: {
    	host: "127.0.0.1",     // Localhost (default: none)
     	port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: () => new HDWalletProvider(MNEMONIC, NFT_HTTP_ENDPOINT),
      network_id: '5',
      gas: 4465030,
      networkCheckTimeout: 10000,
      timeoutBlocks: 200
    },
    
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory:  './src/abis',  

  compilers: {
    solc: {
      version: "^0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
