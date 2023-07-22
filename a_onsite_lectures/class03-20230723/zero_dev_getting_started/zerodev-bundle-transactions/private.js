const { Wallet } = require('ethers');

const privateKey = Wallet.createRandom().privateKey;

console.log(privateKey);
