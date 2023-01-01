const fs = require('fs-extra');
const ethers = require('ethers');
require('dotenv').config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encyrptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );

  fs.writeFileSync('./.encryptedPrivateKey.json', encyrptedJsonKey);
}

//calling main function aysnc
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
