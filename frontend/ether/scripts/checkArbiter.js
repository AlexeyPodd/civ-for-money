const { ethers } = require('hardhat');

async function main() {
  const DuelsV1 = await ethers.getContractFactory("DuelsV1");
  const contract = DuelsV1.attach("0x2A97D32b93fd9cf072fFEf102B541CF21A73A2e2");

  console.log(await contract.arbiter());
}

main();