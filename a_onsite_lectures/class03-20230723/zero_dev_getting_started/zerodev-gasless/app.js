// imports the Contract and Wallet classes from the ethers library.
// The Contract class is used to interact with smart contracts on the Ethereum blockchain
// the Wallet class represents an Ethereum account and is used to sign transactions.
const { Contract, Wallet } = require('ethers');
// imports the getZeroDevSigner function from the @zerodevapp/sdk library.
// This function is used to create an Ethereum signer for interacting with the ZeroDev platform.
const { getZeroDevSigner } = require('@zerodevapp/sdk');

// loads the variables from the .env file using the dotenv package.
require('dotenv').config();
// save project id (zerodev)
const projectId = process.env.PROJECT_ID;
// creates an instance of the Wallet class from the ethers library.
// The Wallet class represents an Ethereum account and is used to manage private keys and sign transactions for the associated Ethereum address.
const wallet = new Wallet(process.env.PRIVATE_KEY);

// The contract address and ABI (Application Binary Interface) for an Ethereum smart contract.
// The contractAddress represents the address of the contract on the Ethereum blockchain
// contractABI contains the contract's function signatures that will be used to interact with the contract.
// zero dev contract to mint NFTS
const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863';
const contractABI = [
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)',
];

const main = async () => {
  // create an Ethereum signer that will be used to sign transactions.
  // It takes two parameters: projectId and owner.
  // The projectId is the ID of the ZeroDev project,
  // and the owner is the Ethereum Wallet object created earlier with the provided PRIVATE_KEY.
  const signer = await getZeroDevSigner({
    projectId,
    owner: wallet,
  });

  // retrieves the Ethereum address associated with the signer,
  // and then it logs the address to the console.
  const address = await signer.getAddress();
  console.log('My address:', address);

  // creates a new instance of the Contract class from the ethers library, representing the Ethereum smart contract
  // specified by contractAddress and contractABI.
  // The signer object will be used to sign transactions for this contract.
  const nftContract = new Contract(contractAddress, contractABI, signer);

  // interact with the smart contract by calling the mint function of the nftContract with the Ethereum address address as an argument.
  // The function will mint an NFT (Non-Fungible Token) for the specified address.
  // The await receipt.wait() waits for the transaction to be confirmed and mined on the Ethereum blockchain.
  const receipt = await nftContract.mint(address);
  await receipt.wait();

  // ogs the NFT balance of the specified Ethereum address (address) by calling the balanceOf function of the nftContract smart contract.
  console.log(`NFT balance: ${await nftContract.balanceOf(address)}`);
};

main().then(() => process.exit(0));
