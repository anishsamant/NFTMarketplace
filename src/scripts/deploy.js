const hardhat = require('hardhat');

async function main () {
  const KryptoBird = await ethers.getContractFactory('KryptoBird');
  const kBird = await KryptoBird.deploy();
  await kBird.deployed();

  console.log('Contract deployed at', kBird.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });