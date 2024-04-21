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
    const commissionPercent = 5;

    const Duel = await ethers.getContractFactory("Duel");
    const duel = await Duel.deploy(
      await arbiter.getAddress(),
      playPeriod,
      { value: betSize },
    );

    return { duel, host, player2, player3, arbiter, betSize, playPeriod, commissionPercent };
  }
  async function deployShortTimeFixture() {
    const [host, player2, player3, arbiter] = await ethers.getSigners();

    const playPeriod = 2;
    const betSize = String(10 ** 18);
    const commissionPercent = 5;

    const Duel = await ethers.getContractFactory("Duel");
    const duel = await Duel.deploy(
      await arbiter.getAddress(),
      playPeriod,
      { value: betSize },
    );

    return { duel, host, player2, player3, arbiter, betSize, playPeriod, commissionPercent };
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
    it("Should emit event Joined", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      await expect(duel.connect(player2).join({ value: betSize })).to.emit(duel, "Joined").withArgs(await player2.getAddress());
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
    it("Should emit event SlotFreed when exiting game", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);
      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.connect(player2).excludePlayer2()).to.emit(duel, "SlotFreed");
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

      const cancelTxn = await duel.cancel();
      const receipt = await cancelTxn.wait();
      const cancelTxnFee = receipt.gasUsed * receipt.gasPrice;

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "Bet should be returned");
      expect(await ethers.provider.getBalance(await host.getAddress()) - balanceBeforeCancel + cancelTxnFee).to.be.equal(betSize);
    });
    it("Should set closed true", async function () {
      const { duel } = await loadFixture(deployFixture);

      const cancelTxn = await duel.cancel();
      await cancelTxn.wait();

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
      const cancelTxn = await duel.cancel();
      await cancelTxn.wait();

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
  
  describe("Voting for draw", function () {
    it("Should pay percent to arbiter, and same size rewards to players (half)", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const drawHostTxn = await duel.voteForDraw();
      const hostVoteReceipt = await drawHostTxn.wait();
      const drawPlayer2Txn = await duel.connect(player2).voteForDraw();
      const player2VoteReceipt = await drawPlayer2Txn.wait();

      const hostBalanceAfterDraw = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterDraw = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterDraw = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt(Number(betSize) - Number(betSize) * (commissionPercent / 100));
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceAfterDraw - hostBalanceBeforeVoting).to.be.equal(expectedReward - hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
      expect(player2BalanceAfterDraw - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
      expect(arbiterBalanceAfterDraw - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
    });
    it("Should set game closed", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const drawHostTxn = await duel.voteForDraw();
      await drawHostTxn.wait();
      const drawPlayer2Txn = await duel.connect(player2).voteForDraw();
      await drawPlayer2Txn.wait();

      expect(await duel.closed()).to.be.true;
    });
    it("Should not call draw if not all players voted", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const drawHostTxn = await duel.voteForDraw();
      await drawHostTxn.wait();

      expect(await duel.closed()).to.be.false;
    });
    it("Should emit event Draw", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const drawHostTxn = await duel.voteForDraw();
      await drawHostTxn.wait();

      await expect(duel.connect(player2).voteForDraw()).to.emit(duel, "Draw");
    });
    it("Should revert if already voted for draw", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const drawHostTxn = await duel.voteForDraw();
      await drawHostTxn.wait();

      await expect(duel.voteForDraw()).to.be.reverted;
    });
    it("Should revert if voter is not a player", async function () {
      const { duel, player2, arbiter, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const drawHostTxn = await duel.voteForDraw();
      await drawHostTxn.wait();

      await expect(duel.connect(arbiter).voteForDraw()).to.be.reverted;
    });
    it("Should revert if game wasn't started yet", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.voteForDraw()).to.be.reverted;
    });
    it("Should call draw after single vote if play period has ended", async function () {
      const { duel, host, player2, arbiter, betSize, playPeriod, commissionPercent } = await loadFixture(deployShortTimeFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      await new Promise(r => setTimeout(r, playPeriod * 2000));

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const drawPlayer2Txn = await duel.connect(player2).voteForDraw();
      const player2VoteReceipt = await drawPlayer2Txn.wait();

      const hostBalanceAfterDraw = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterDraw = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterDraw = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt(Number(betSize) - Number(betSize) * (commissionPercent / 100));
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceAfterDraw - hostBalanceBeforeVoting).to.be.equal(expectedReward);
      expect(player2BalanceAfterDraw - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
      expect(arbiterBalanceAfterDraw - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
    });
  });

  describe("Voting for places", function () {
    it("Should pay percent to arbiter, and reward winner (player2)", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const loseHostTxn = await duel.voteForPlace(2);
      const hostVoteReceipt = await loseHostTxn.wait();
      const winPlayer2Txn = await duel.connect(player2).voteForPlace(1);
      const player2VoteReceipt = await winPlayer2Txn.wait();

      const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt((Number(betSize) - Number(betSize) * (commissionPercent / 100)) * 2);
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceBeforeVoting - hostBalanceAfterVoting).to.be.equal(hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
      expect(player2BalanceAfterVoting - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
      expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
    });
    it("Should pay percent to arbiter, and reward winner (host)", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const winHostTxn = await duel.voteForPlace(1);
      const hostVoteReceipt = await winHostTxn.wait();
      const losePlayer2Txn = await duel.connect(player2).voteForPlace(2);
      const player2VoteReceipt = await losePlayer2Txn.wait();

      const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt((Number(betSize) - Number(betSize) * (commissionPercent / 100)) * 2);
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceAfterVoting - hostBalanceBeforeVoting ).to.be.equal(expectedReward - hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
      expect(player2BalanceBeforeVoting - player2BalanceAfterVoting ).to.be.equal(player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
      expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
    });
    it("Should set closed true after reward winner", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const winHostTxn = await duel.voteForPlace(1);
      await winHostTxn.wait();

      expect(await duel.closed()).to.be.false;

      const losePlayer2Txn = await duel.connect(player2).voteForPlace(2);
      await losePlayer2Txn.wait();

      expect(await duel.closed()).to.be.true;
    });
    it("Should emit event Victory after reward winner", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const winHostTxn = await duel.voteForPlace(1);
      await winHostTxn.wait();

      await expect(duel.connect(player2).voteForPlace(2)).to.emit(duel, "Victory");
    });
    it("Should revert if voter is not a player", async function () {
      const { duel, player2, arbiter, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      await expect(duel.connect(arbiter).voteForPlace(1)).to.be.reverted;
    });
    it("Should revert if game was not started yet", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();

      await expect(duel.voteForPlace(1)).to.be.reverted;
    });
    it("Should revert if voted place is not 1 or 2", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      await expect(duel.voteForPlace(3)).to.be.reverted;
    });
    it("Should set disagreement if voted places are same, and not pay anyone", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostTxn = await duel.voteForPlace(2);
      await hostTxn.wait();
      const player2Txn = await duel.connect(player2).voteForPlace(2);
      await player2Txn.wait();

      expect(await duel.disagreement()).to.be.true;
      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(String(Number(betSize) * 2), "All funds should be not payed");
    });
    it("Should emit event Disagreement if voted places are same", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostTxn = await duel.voteForPlace(2);
      await hostTxn.wait();
      await expect(duel.connect(player2).voteForPlace(2)).to.emit(duel, "Disagreement");
      });
    it("Should pay percent to arbiter, and reward winner (host) after re-voting", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const loseHostTxn = await duel.voteForPlace(2);
      const loseHostVoteReceipt = await loseHostTxn.wait();
      const losePlayer2Txn = await duel.connect(player2).voteForPlace(2);
      const player2VoteReceipt = await losePlayer2Txn.wait();
      const winHostTxn = await duel.voteForPlace(1);
      const winHostVoteReceipt = await winHostTxn.wait();

      const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt((Number(betSize) - Number(betSize) * (commissionPercent / 100)) * 2);
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2);
      const hostRewardExpectation = expectedReward - loseHostVoteReceipt.gasPrice * loseHostVoteReceipt.gasUsed - winHostVoteReceipt.gasPrice * winHostVoteReceipt.gasUsed;

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceAfterVoting - hostBalanceBeforeVoting).to.be.equal(hostRewardExpectation);
      expect(player2BalanceBeforeVoting - player2BalanceAfterVoting).to.be.equal(player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
      expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
    });
    it("Should pay percent to arbiter, and reward winner (player2) for single vote after play period ends", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent, playPeriod } = await loadFixture(deployShortTimeFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      await new Promise(r => setTimeout(r, playPeriod * 2000));

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const loseHostTxn = await duel.voteForPlace(2);
      const hostVoteReceipt = await loseHostTxn.wait();

      const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt((Number(betSize) - Number(betSize) * (commissionPercent / 100)) * 2);
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceBeforeVoting - hostBalanceAfterVoting).to.be.equal(hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
      expect(player2BalanceAfterVoting - player2BalanceBeforeVoting).to.be.equal(expectedReward);
      expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
    });
    it("Should pay percent to arbiter, and reward winner (host) for single vote after play period ends", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent, playPeriod } = await loadFixture(deployShortTimeFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      await new Promise(r => setTimeout(r, playPeriod * 2000));

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const loseHostTxn = await duel.voteForPlace(1);
      const hostVoteReceipt = await loseHostTxn.wait();

      const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt((Number(betSize) - Number(betSize) * (commissionPercent / 100)) * 2);
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceAfterVoting -  hostBalanceBeforeVoting).to.be.equal(expectedReward - hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
      expect(player2BalanceAfterVoting - player2BalanceBeforeVoting).to.be.equal(0);
      expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
    });
    it("Should set disagreement after play period ends if vote is the same, as other payer voted before play period ends", async function () {
      const { duel, player2, betSize, playPeriod } = await loadFixture(deployShortTimeFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const loseHostTxn = await duel.voteForPlace(2);
      await loseHostTxn.wait();

      await new Promise(r => setTimeout(r, playPeriod * 2000));

      const losePlayer2Txn = await duel.connect(player2).voteForPlace(2);
      await losePlayer2Txn.wait();

      expect(await duel.disagreement()).to.be.true;
      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(String(Number(betSize) * 2), "All funds should be not payed");
    });
  });

  describe("Force appointment winner", function () {
    it("Should reward chosen player", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const hostTxn = await duel.voteForPlace(1);
      const hostReceipt = await hostTxn.wait();
      const player2Txn = await duel.connect(player2).voteForPlace(1);
      const player2Receipt = await player2Txn.wait();

      expect(await duel.disagreement()).to.be.true;

      const judgeTxn = await duel.connect(arbiter).forceAppointWinner(await player2.getAddress());
      const judgeReceipt = await judgeTxn.wait();

      const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt((Number(betSize) - Number(betSize) * (commissionPercent / 100)) * 2);
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceBeforeVoting - hostBalanceAfterVoting).to.be.equal(hostReceipt.gasPrice * hostReceipt.gasUsed);
      expect(player2BalanceAfterVoting - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2Receipt.gasPrice * player2Receipt.gasUsed);
      expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission - judgeReceipt.gasPrice * judgeReceipt.gasUsed);
    });
    it("Should revert if called not by arbiter", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostTxn = await duel.voteForPlace(1);
      await hostTxn.wait();
      const player2Txn = await duel.connect(player2).voteForPlace(1);
      await player2Txn.wait();

      expect(await duel.disagreement()).to.be.true;
      await expect(duel.forceAppointWinner(await player2.getAddress())).to.be.reverted;
    });
    it("Should revert if not disagreed yet", async function () {
      const { duel, player2, arbiter, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const player2Txn = await duel.connect(player2).voteForPlace(1);
      await player2Txn.wait();

      expect(await duel.disagreement()).to.be.false;
      await expect(duel.connect(arbiter).forceAppointWinner(await player2.getAddress())).to.be.reverted;
    });
    it("Should revert if given address is not address of one of the players", async function () {
      const { duel, player2, player3, arbiter, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostTxn = await duel.voteForPlace(1);
      await hostTxn.wait();
      const player2Txn = await duel.connect(player2).voteForPlace(1);
      await player2Txn.wait();      

      expect(await duel.disagreement()).to.be.true;
      await expect(duel.connect(arbiter).forceAppointWinner(await player3.getAddress())).to.be.reverted;
    });
  });

  describe("Force draw", function () {
    it("Should call draw after disagreement", async function () {
      const { duel, host, player2, arbiter, betSize, commissionPercent } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

      const hostTxn = await duel.voteForPlace(1);
      const hostReceipt = await hostTxn.wait();
      const player2Txn = await duel.connect(player2).voteForPlace(1);
      const player2Receipt = await player2Txn.wait();

      expect(await duel.disagreement()).to.be.true;

      const judgeTxn = await duel.connect(arbiter).forceDraw();
      const judgeReceipt = await judgeTxn.wait();

      const hostBalanceAfterDraw = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterDraw = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterDraw = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt(Number(betSize) - Number(betSize) * (commissionPercent / 100));
      const arbiterCommission = BigInt(Number(betSize) * (commissionPercent / 100) * 2)

      expect(await ethers.provider.getBalance(await duel.getAddress())).to.be.equal(0, "All funds should be payed");
      expect(hostBalanceAfterDraw - hostBalanceBeforeVoting).to.be.equal(expectedReward - hostReceipt.gasPrice * hostReceipt.gasUsed);
      expect(player2BalanceAfterDraw - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2Receipt.gasPrice * player2Receipt.gasUsed);
      expect(arbiterBalanceAfterDraw - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission - judgeReceipt.gasPrice * judgeReceipt.gasUsed);
    });
    it("Should revert if called not by arbiter", async function () {
      const { duel, player2, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostTxn = await duel.voteForPlace(1);
      await hostTxn.wait();
      const player2Txn = await duel.connect(player2).voteForPlace(1);
      await player2Txn.wait();

      expect(await duel.disagreement()).to.be.true;
      await expect(duel.forceDraw()).to.be.reverted;
    });
    it("Should revert if called before disagreed", async function () {
      const { duel, player2, arbiter, betSize } = await loadFixture(deployFixture);

      const joinTxn = await duel.connect(player2).join({ value: betSize });
      await joinTxn.wait();
      const startTxn = await duel.start();
      await startTxn.wait();

      const hostTxn = await duel.voteForPlace(1);
      await hostTxn.wait();

      expect(await duel.disagreement()).to.be.false;
      await expect(duel.connect(arbiter).forceDraw()).to.be.reverted;
    });
  });
});
