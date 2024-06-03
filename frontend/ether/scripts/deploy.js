const { ethers, upgrades } = require('hardhat');

async function main() {
  const duels = await ethers.getContractFactory('DuelsV1');
  const proxy = await upgrades.deployProxy(duels, [ethers.parseEther("0.005"), 5]);
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress()

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log('Proxy contract address: ' + proxyAddress);

  console.log('Implementation contract address: ' + implementationAddress);
}

main();