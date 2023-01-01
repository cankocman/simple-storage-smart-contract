//importing necessary tools
const ethers = require('ethers');
const fs = require('fs-extra');
require('dotenv').config();

//asynchronous function cause want to be able to wait or do tasks simultaneously
async function main() {
  //Attaining Goerli Testnet blockchain env via Alchemy as provider with RPC
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  //Binding one of Ganache accounts using their private key which we have encrypted with ethers.js
  const encryptedJsonKey = fs.readFileSync(
    './.encryptedPrivateKey.json',
    'utf8'
  );
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJsonKey,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = wallet.connect(provider);
  //reading compiled contract with fs-extra library
  //which we have compiled using solc-js
  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8');
  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf8'
  );
  //Creating the contract object
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  //actually deploying the contract object
  console.log('Deploying...');
  const contract = await contractFactory.deploy();
  //waiting for one block to make sure the tx got through
  await contract.deployTransaction.wait(1);

  //interacting with the contract object
  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current fav number: ${currentFavoriteNumber.toString()}`);
  const updateFavNum = await contract.store('5');
  await updateFavNum.wait(1);
  const newFavoriteNumber = await contract.retrieve();
  console.log(`New fav number: ${newFavoriteNumber.toString()}`);
}

//calling main function aysnc with catching the promise
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
