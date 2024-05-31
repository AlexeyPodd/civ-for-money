const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers, upgrades } = require('hardhat');

describe("Duels", function () {
  async function deployFixture() {
    const [arbiter, host, player2, player3] = await ethers.getSigners();

    const minimalBet = ethers.parseEther("0.005");
    const commissionPercent = 5;

    const Duels = await ethers.getContractFactory("Duels");
    const proxy = await upgrades.deployProxy(Duels, [minimalBet, commissionPercent]);

    return { arbiter, host, player2, player3, proxy, minimalBet, commissionPercent };
  }

  describe("Deployment", function () {
    it("Should deploy two contracts (proxy and implementation)", async function () {
      const { proxy } = await loadFixture(deployFixture);
      
      const proxyAddress = await proxy.getAddress();
      const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

      expect(proxyAddress).to.not.equal(implementationAddress);
    });
    it("Should set the right arbiter", async function () {
      const { proxy, arbiter } = await loadFixture(deployFixture);
      expect(await proxy.arbiter()).to.equal(await arbiter.getAddress(), "Wrong arbiter");
    });
    it("Should set the right minimal bet size", async function () {
      const { proxy, minimalBet } = await loadFixture(deployFixture);
      expect(await proxy.minimalBet()).to.equal(minimalBet, "Wrong minimal bet size");
    });
    it("Should set the right commission percent", async function () {
      const { proxy, commissionPercent } = await loadFixture(deployFixture);
      expect(await proxy.commissionPercent()).to.equal(commissionPercent, "Wrong commission percent");
    });
    it("Should revert if commission percent set greater then 100", async function () {
      const { minimalBet } = await loadFixture(deployFixture);

      const Duels = await ethers.getContractFactory("Duels");

      await expect(upgrades.deployProxy(Duels, [minimalBet, 101])).to.be.reverted;
    });
  });

  describe("Reset parameters", function() {
    it("Should reset arbiter", async function() {
      const { proxy, host } = await loadFixture(deployFixture);

      await proxy.setArbiter(await host.getAddress());

      expect(await proxy.arbiter()).to.equal(await host.getAddress(), "Did not reset arbiter");
    });
    it("Should reset minimal bet size", async function() {
      const { proxy } = await loadFixture(deployFixture);

      const newMinimalBet = ethers.parseEther("1");
      await proxy.setMinimalBet(newMinimalBet);

      expect(await proxy.minimalBet()).to.equal(newMinimalBet, "Did not reset minimal bet size");
    });
    it("Should reset commission percent", async function() {
      const { proxy, commissionPercent } = await loadFixture(deployFixture);

      const newCommissionPercent = commissionPercent * 2;
      await proxy.setCommissionPercent(newCommissionPercent);

      expect(await proxy.commissionPercent()).to.equal(newCommissionPercent, "Did not reset commission percent");
    });
    it("Should revert reset by not arbiter", async function() {
      const { proxy, host } = await loadFixture(deployFixture);

      await expect(proxy.connect(host).setArbiter(await host.getAddress())).to.be.reverted;
    });
    it("Should revert reset commission percent to greater then 100%", async function() {
      const { proxy } = await loadFixture(deployFixture);

      await expect(proxy.setCommissionPercent(101)).to.be.reverted;
    });
  });

  describe("Creating new game", function () {
    it("Should create new game and return its index", async function () {
      const { proxy, host } = await loadFixture(deployFixture);
      const playPeriod = 7 * 24 * 60 * 60;
      const bet = ethers.parseEther("0.2");

      const tx1 = await proxy.connect(host).createGame(playPeriod, {value: bet});
      const receipt1 = await tx1.wait();
      const tx2 = await proxy.connect(host).createGame(playPeriod, {value: bet});
      const receipt2 = await tx2.wait();

      const abiCoder = new ethers.AbiCoder();
      const gameIndex1 = Number(abiCoder.decode(["uint256"], receipt1.logs[0].data));
      const gameIndex2 = Number(abiCoder.decode(["uint256"], receipt2.logs[0].data));

      expect(gameIndex1).to.equal(0);
      expect(gameIndex2).to.equal(1);
    });
  });
});