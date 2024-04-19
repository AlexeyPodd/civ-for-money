const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Duel", function () {
  async function deployFixture() {
    const [host, player2, player3, arbiter] = await ethers.getSigners();

    const playPeriod = 7 * 24 * 60 * 60;
    const betSize = String(10 ** 18);

    const Duel = await ethers.getContractFactory("Duel");
    const duel = await Duel.deploy(
      await arbiter.getAddress(),
      playPeriod,
      { value: betSize },
    );

    return { duel, host, player2, player3, arbiter, betSize, playPeriod };
  }

  describe("Deployment", function () {
    it("Should set the right arbiter", async function () {
      const { duel, arbiter } = await loadFixture(deployFixture);
      expect(await duel.arbiter()).to.equal(await arbiter.getAddress(), "Wrong arbiter");
    });
    it("Should set the right host", async function () {
      const { duel, host } = await loadFixture(deployFixture);
      expect(await duel.host()).to.equal(await host.getAddress(), "Wrong host");
    });
    it("Should set the right play period", async function () {
      const { duel, playPeriod } = await loadFixture(deployFixture);
      expect(await duel.playPeriod()).to.equal(playPeriod, "Wrong play period");
    });
    it("Should set the right bet size", async function () {
      const { duel, betSize } = await loadFixture(deployFixture);
      expect(await duel.bet()).to.equal(betSize, "Wrong bet size");
      expect(await ethers.provider.getBalance(await duel.getAddress())).to.equal(betSize, "Wrong balance");
    });
    it("Should revert deployment without bet paying", async function () {
      const { playPeriod, arbiter } = await loadFixture(deployFixture);

      const Duel = await ethers.getContractFactory("Duel");
      await expect(Duel.deploy(await arbiter.getAddress(), playPeriod)).to.be.reverted;
    });
  });

  describe("Joining to the game", function () {
    it("Should set right player2 and receive his bet", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(String(2 * Number(betSize), "Bet was not payed"));
      expect(await duel.player2()).to.equal(await player2.getAddress(), "Wrong player2");
    });
    it("Should revert if bet size is not big enough", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      await expect(duel.connect(player2).join({ value: betSize.slice(0, betSize.length - 1) })).to.be.reverted;
    });
    it("Should revert if slot is already taken", async function () {
      const { duel, player2, player3, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player3).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.connect(player2).join({ value: betSize })).to.be.reverted;
    });
  });

  describe("Starting a game", function () {
    it("Should set started true", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      const startTxn = await duel.start();
      await startTxn.wait();

      expect(await duel.started()).to.be.true;
      expect(await duel.timeStart()).to.be.equal(await time.latest());
    });
    it("Should emit Start event", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.start()).to.emit(duel, "Start").withArgs(await player2.getAddress());
    });
    it("Should revert if starting not by host", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.connect(player2).start()).to.be.reverted;
    });
    it("Should revert if player2 slot is empty", async function () {
      const { duel } = await loadFixture(deployFixture);

      await expect(duel.start()).to.be.reverted;
    });
  });

  describe("Exiting or being kicked from game as player2", function () {
    it("Should exit game with refund", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      const startTxn = await duel.connect(player2).excludePlayer2();
      await startTxn.wait();

      expect(await duel.player2()).to.be.equal(ethers.ZeroAddress, "Slot 2 was not released");
      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(betSize, "Bet was not returned");
    });
    it("Should kick player2 by host with refund", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      const startTxn = await duel.excludePlayer2();
      await startTxn.wait();

      expect(await duel.player2()).to.be.equal(ethers.ZeroAddress, "Slot 2 was not released");
      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(betSize, "Bet was not returned");
    });
    it("Should not kick player2 by not a player", async function () {
      const { duel, player2, betSize, arbiter } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.connect(arbiter).excludePlayer2()).to.be.reverted;
    });
    it("Should not kick player2 after game started", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      await expect(duel.excludePlayer2()).to.be.reverted;
    });
  });
  describe("Canceling game", function () {
    it("Should refund host", async function () {
      const { duel, host, betSize } = await loadFixture(deployFixture);

      const balanceBeforeCancel = await ethers.provider.getBalance(await host.getAddress());

      const startTxn = await duel.cancel();
      const receipt = await startTxn.wait();
      const startTxnFee = receipt.gasUsed * receipt.gasPrice;

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "Bet should be returned");
      expect(await ethers.provider.getBalance(await host.getAddress()) - balanceBeforeCancel + startTxnFee).to.be.equal(betSize);
    });
    it("Should set closed true", async function () {
      const { duel } = await loadFixture(deployFixture);

      const startTxn = await duel.cancel();
      await startTxn.wait();

      expect(await duel.closed()).to.be.true;
    });
    it("Should emit Cancel event", async function () {
      const { duel } = await loadFixture(deployFixture);

      await expect(duel.cancel()).to.emit(duel, "Cancel");
    });
    it("Should refund joined player2", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      const balanceBeforeCancel = await ethers.provider.getBalance(await player2.getAddress());
      const startTxn = await duel.cancel();
      await startTxn.wait();

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "Bets should be returned");
      expect(await ethers.provider.getBalance(await player2.getAddress()) - balanceBeforeCancel).to.be.equal(betSize);
    });
    it("Should revert if called not by host", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.connect(player2).cancel()).to.be.reverted;
    });
    it("Should revert if called after game started", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      const startTxn = await duel.start();
      await startTxn.wait();

      await expect(duel.cancel()).to.be.reverted;
    });
  });
  
});
