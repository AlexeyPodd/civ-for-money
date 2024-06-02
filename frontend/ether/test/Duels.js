const {
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

    const playPeriod = 7 * 24 * 60 * 60;

    return { arbiter, host, player2, player3, proxy, minimalBet, commissionPercent, playPeriod };
  }

  async function deployAndGamesCreatedFixture() {
    const [arbiter, host, player2, player3] = await ethers.getSigners();

    const minimalBet = ethers.parseEther("0.005");
    const commissionPercent = 5;

    const Duels = await ethers.getContractFactory("Duels");
    const proxy = await upgrades.deployProxy(Duels, [minimalBet, commissionPercent]);

    const playPeriod = 7 * 24 * 60 * 60;
    const bet = ethers.parseEther("0.01");

    const createTxn1 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn1.wait();
    const createTxn2 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn2.wait();
    const createTxn3 = await proxy.connect(player2).createGame(playPeriod, { value: bet });
    await createTxn3.wait();

    return { arbiter, host, player2, player3, proxy, minimalBet, commissionPercent, playPeriod, bet };
  }

  async function deployAndGamesCreatedAndJoinedFixture() {
    const [arbiter, host, player2, player3] = await ethers.getSigners();

    const minimalBet = ethers.parseEther("0.005");
    const commissionPercent = 5;

    const Duels = await ethers.getContractFactory("Duels");
    const proxy = await upgrades.deployProxy(Duels, [minimalBet, commissionPercent]);

    const playPeriod = 7 * 24 * 60 * 60;
    const bet = ethers.parseEther("0.01");

    const createTxn1 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn1.wait();
    const createTxn2 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn2.wait();
    const createTxn3 = await proxy.connect(player2).createGame(playPeriod, { value: bet });
    await createTxn3.wait();

    const joinTxn = await proxy.connect(player2).join(0, { value: bet });
    await joinTxn.wait();

    return { arbiter, host, player2, player3, proxy, minimalBet, commissionPercent, playPeriod, bet };
  }

  async function deployAndGamesCreatedAndJoinedAndStartedFixture() {
    const [arbiter, host, player2, player3] = await ethers.getSigners();

    const minimalBet = ethers.parseEther("0.005");
    const commissionPercent = 5;

    const Duels = await ethers.getContractFactory("Duels");
    const proxy = await upgrades.deployProxy(Duels, [minimalBet, commissionPercent]);

    const playPeriod = 7 * 24 * 60 * 60;
    const bet = ethers.parseEther("0.01");

    const createTxn1 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn1.wait();
    const createTxn2 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn2.wait();
    const createTxn3 = await proxy.connect(player2).createGame(playPeriod, { value: bet });
    await createTxn3.wait();

    const joinTxn = await proxy.connect(player2).join(0, { value: bet });
    await joinTxn.wait();

    const startTxn = await proxy.connect(host).start(0);
    await startTxn.wait();

    return { arbiter, host, player2, player3, proxy, minimalBet, commissionPercent, playPeriod, bet };
  }

  async function deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture() {
    const [arbiter, host, player2, player3] = await ethers.getSigners();

    const minimalBet = ethers.parseEther("0.005");
    const commissionPercent = 5;

    const Duels = await ethers.getContractFactory("Duels");
    const proxy = await upgrades.deployProxy(Duels, [minimalBet, commissionPercent]);

    const playPeriod = 7 * 24 * 60 * 60;
    const bet = ethers.parseEther("0.01");

    const createTxn1 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn1.wait();
    const createTxn2 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn2.wait();
    const createTxn3 = await proxy.connect(player2).createGame(playPeriod, { value: bet });
    await createTxn3.wait();

    const joinTxn = await proxy.connect(player2).join(0, { value: bet });
    await joinTxn.wait();

    const startTxn = await proxy.connect(host).start(0);
    await startTxn.wait();

    const hostVoteTxn = await proxy.connect(host).voteResult(0, 1);
    await hostVoteTxn.wait();
    const player2VoteTxn = await proxy.connect(player2).voteResult(0, 1);
    await player2VoteTxn.wait();

    return { arbiter, host, player2, player3, proxy, minimalBet, commissionPercent, playPeriod, bet };
  }

  async function deployAndGamesCreatedWithShortPlayPeriodAndJoinedAndStartedFixture() {
    const [arbiter, host, player2, player3] = await ethers.getSigners();

    const minimalBet = ethers.parseEther("0.005");
    const commissionPercent = 5;

    const Duels = await ethers.getContractFactory("Duels");
    const proxy = await upgrades.deployProxy(Duels, [minimalBet, commissionPercent]);

    const playPeriod = 2;
    const bet = ethers.parseEther("0.01");

    const createTxn1 = await proxy.connect(host).createGame(playPeriod, { value: bet });
    await createTxn1.wait();

    const joinTxn = await proxy.connect(player2).join(0, { value: bet });
    await joinTxn.wait();

    const startTxn = await proxy.connect(host).start(0);
    await startTxn.wait();

    return { arbiter, host, player2, player3, proxy, minimalBet, commissionPercent, playPeriod, bet };
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

  describe("Reset parameters", function () {
    it("Should reset arbiter", async function () {
      const { proxy, host } = await loadFixture(deployFixture);

      const txn = await proxy.setArbiter(await host.getAddress());
      await txn.wait();

      expect(await proxy.arbiter()).to.equal(await host.getAddress(), "Did not reset arbiter");
    });
    it("Should reset minimal bet size", async function () {
      const { proxy } = await loadFixture(deployFixture);

      const newMinimalBet = ethers.parseEther("1");
      const txn = await proxy.setMinimalBet(newMinimalBet);
      await txn.wait();

      expect(await proxy.minimalBet()).to.equal(newMinimalBet, "Did not reset minimal bet size");
    });
    it("Should reset commission percent", async function () {
      const { proxy, commissionPercent } = await loadFixture(deployFixture);

      const newCommissionPercent = commissionPercent * 2;
      const txn = await proxy.setCommissionPercent(newCommissionPercent);
      await txn.wait();

      expect(await proxy.commissionPercent()).to.equal(newCommissionPercent, "Did not reset commission percent");
    });
    it("Should revert reset by not arbiter", async function () {
      const { proxy, host } = await loadFixture(deployFixture);

      await expect(proxy.connect(host).setArbiter(await host.getAddress())).to.be.reverted;
    });
    it("Should revert reset commission percent to greater then 100%", async function () {
      const { proxy } = await loadFixture(deployFixture);

      await expect(proxy.setCommissionPercent(101)).to.be.reverted;
    });
  });

  describe("Creating new game", function () {
    it(
      "Should create new game and store it in games array",
      async function () {
        const { proxy, host, player2, playPeriod } = await loadFixture(deployFixture);

        const bet1 = ethers.parseEther("0.237");
        const bet2 = ethers.parseEther("0.225");

        const createTxn1 = await proxy.connect(host).createGame(playPeriod, { value: bet1 });
        await createTxn1.wait();
        const createTxn2 = await proxy.connect(player2).createGame(playPeriod, { value: bet2 });
        await createTxn2.wait();

        expect((await proxy.games(0)).bet).to.equal(bet1);
        expect((await proxy.games(1)).bet).to.equal(bet2);

        await expect(proxy.games(2)).to.be.reverted;
      });
    it(
      "Should create new game and emit Created event with its index",
      async function () {
        const { proxy, host, player2, playPeriod } = await loadFixture(deployFixture);

        const bet1 = ethers.parseEther("0.237");
        const bet2 = ethers.parseEther("0.225");

        await expect(proxy.connect(player2).createGame(playPeriod, { value: bet1 })).to.emit(proxy, 'Created').withArgs(0);
        await expect(proxy.connect(host).createGame(playPeriod, { value: bet2 })).to.emit(proxy, 'Created').withArgs(1);
      });
    it("Should revert creating game with bet less then minimal set", async function () {
      const { proxy, host, minimalBet, playPeriod } = await loadFixture(deployFixture);
      const bet = ethers.parseEther(String(Number(ethers.formatEther(minimalBet)) / 2));

      await expect(proxy.connect(host).createGame(playPeriod, { value: bet })).to.be.reverted;
    });
  });

  describe("Joining created game", function () {
    it("Should join to chosen game", async function () {
      const { proxy, player2, bet } = await loadFixture(deployAndGamesCreatedFixture);

      const joinTxn = await proxy.connect(player2).join(1, { value: bet });
      await joinTxn.wait();

      expect((await proxy.games(1)).player2).to.equal(await player2.getAddress());
    });
    it("Should join to chosen game and emit event Joined", async function () {
      const { proxy, player2, bet } = await loadFixture(deployAndGamesCreatedFixture);

      await expect(proxy.connect(player2).join(1, { value: bet }))
        .to.emit(proxy, "Joined")
        .withArgs(1, await player2.getAddress());
    });
    it("Should join to chosen game after slot freed", async function () {
      const { proxy, player2, player3, bet } = await loadFixture(deployAndGamesCreatedFixture);

      const player2JoinTxn = await proxy.connect(player2).join(1, { value: bet });
      await player2JoinTxn.wait();
      const player2ExitTxn = await proxy.connect(player2).excludePlayer2(1);
      await player2ExitTxn.wait();

      const player3JoinTxn = await proxy.connect(player3).join(1, { value: bet });
      await player3JoinTxn.wait();

      expect((await proxy.games(1)).player2).to.equal(await player3.getAddress());
    });
    it("Should revert try to join not create game", async function () {
      const { proxy, player2, bet } = await loadFixture(deployAndGamesCreatedFixture);

      await expect(proxy.connect(player2).join(10, { value: bet }))
        .to.be.reverted;
    });
    it("Should revert try to join game, where player2 slot is already taken", async function () {
      const { proxy, player2, player3, bet } = await loadFixture(deployAndGamesCreatedFixture);

      const joinTxn = await proxy.connect(player2).join(1, { value: bet });
      await joinTxn.wait();

      await expect(proxy.connect(player3).join(1, { value: bet }))
        .to.be.reverted;
    });
    it("Should revert try to join game, betting less then host", async function () {
      const { proxy, player2, minimalBet } = await loadFixture(deployAndGamesCreatedFixture);

      await expect(proxy.connect(player2).join(1, { value: minimalBet }))
        .to.be.reverted;
    });
  });

  describe("Exiting or being kicked from game as player2", function () {
    it("Should exclude player2 from game, called by host with refund", async function () {
      const { proxy, host, player2, bet } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      expect((await proxy.games(0)).player2).to.equal(await player2.getAddress());

      const txn = await proxy.connect(host).excludePlayer2(0);
      await txn.wait();

      expect((await proxy.games(0)).player2).to.equal(ethers.ZeroAddress, "Player 2 was not excluded");
      expect(await ethers.provider.getBalance(await proxy.getAddress())).to.equal(bet + bet + bet, "refund was not done");
    });
    it("Should exclude player2 from game, called by player2 with refund", async function () {
      const { proxy, player2, bet } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      const txn = await proxy.connect(player2).excludePlayer2(0);
      await txn.wait();

      expect((await proxy.games(0)).player2).to.equal(ethers.ZeroAddress, "Player 2 was not excluded");
      expect(await ethers.provider.getBalance(await proxy.getAddress())).to.equal(bet + bet + bet, "refund was not done");
    });
    it("Should exclude player2 from game, and emit SlotFreed event", async function () {
      const { proxy, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(player2).excludePlayer2(0))
        .to.emit(proxy, "SlotFreed")
        .withArgs(0);
    });
    it("Should revert try to exclude player2 from game by not a plyer", async function () {
      const { proxy, arbiter, player3 } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(arbiter).excludePlayer2(0)).to.be.reverted;
      await expect(proxy.connect(player3).excludePlayer2(0)).to.be.reverted;
    });
    it("Should revert try to exclude player2 from not existing game", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(host).excludePlayer2(10)).to.be.reverted;
    });
    it("Should revert try to exclude player2 from game, where slot is empty", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedFixture);

      await expect(proxy.connect(host).excludePlayer2(0)).to.be.reverted;
    });
    it("Should revert try to exclude player2 from game, after it have started", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      const startTxn = await proxy.connect(host).start(0);
      await startTxn.wait();

      await expect(proxy.connect(host).excludePlayer2(0)).to.be.reverted;
    });
  });

  describe("Canceling game", function () {
    it("Should cancel game with empty player2 slot, with refund to host", async function () {
      const { proxy, host, bet } = await loadFixture(deployAndGamesCreatedFixture);

      const cancelTxn = await proxy.connect(host).cancel(0);
      await cancelTxn.wait();

      expect(await ethers.provider.getBalance(await proxy.getAddress())).to.equal(bet + bet, "refund was not done");
    });
    it("Should cancel game with both players registered, with refund to them", async function () {
      const { proxy, host, bet } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      const cancelTxn = await proxy.connect(host).cancel(0);
      await cancelTxn.wait();

      expect(await ethers.provider.getBalance(await proxy.getAddress())).to.equal(bet + bet, "refund was not done");
    });
    it("Should set closet true", async function () {
      const { proxy, host, bet } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      const cancelTxn = await proxy.connect(host).cancel(0);
      await cancelTxn.wait();

      expect((await proxy.games(0)).closed).to.be.true;
    });
    it("Should cancel game, and emit Cancel event", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(await proxy.connect(host).cancel(0))
        .to.emit(proxy, "Cancel")
        .withArgs(0);
    });
    it("Should revert try to cancel not existing game", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(host).cancel(10)).to.be.reverted;
    });
    it("Should revert try to cancel game not by host", async function () {
      const { proxy, arbiter, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(arbiter).cancel(0)).to.be.reverted;
      await expect(proxy.connect(player2).cancel(0)).to.be.reverted;
    });
    it("Should revert try to cancel if game already started", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      const startTxn = await proxy.connect(host).start(0);
      await startTxn.wait()

      await expect(proxy.connect(host).cancel(0)).to.be.reverted;
    });
  });

  describe("Starting game", function () {
    it("Should set start true", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      const startTxn = await proxy.connect(host).start(0);
      await startTxn.wait()

      expect((await proxy.games(0)).started).to.be.true;
    });
    it("Should emit Start event", async function () {
      const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(host).start(0)).to.emit(proxy, "Start").withArgs(0, await player2.getAddress());
    });
    it("Should revert if game is not existing", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(host).start(10)).to.be.reverted;
    });
    it("Should revert if called not by game host", async function () {
      const { proxy, player2, player3, arbiter } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      await expect(proxy.connect(player2).start(0)).to.be.reverted;
      await expect(proxy.connect(player3).start(0)).to.be.reverted;
      await expect(proxy.connect(arbiter).start(0)).to.be.reverted;
    });
    it("Should revert if second player did not join yet", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedFixture);

      await expect(proxy.connect(host).start(0)).to.be.reverted;
    });
  });

  describe("Voting for game result", function () {
    it("Should set host vote", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      expect((await proxy.games(0)).hostVote).to.equal(0);

      const vote = 1;
      await proxy.connect(host).voteResult(0, vote);

      expect((await proxy.games(0)).hostVote).to.equal(vote, "did not set host vote");
    });
    it("Should set player2 vote", async function () {
      const { proxy, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      expect((await proxy.games(0)).player2Vote).to.equal(0);

      const vote = 3;
      await proxy.connect(player2).voteResult(0, vote);

      expect((await proxy.games(0)).player2Vote).to.equal(vote, "did not set player2 vote");
    });
    it("Should revert if game does not exists", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      const vote = 3;

      await expect(proxy.connect(host).voteResult(10, vote)).to.be.reverted;
    });
    it("Should revert if vote value is invalid (valid are 1, 2, 3)", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      const vote = 4;

      await expect(proxy.connect(host).voteResult(0, vote)).to.be.reverted;
    });
    it("Should revert if voter is nt participator of game", async function () {
      const { proxy, player3, arbiter } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      const vote = 3;

      await expect(proxy.connect(player3).voteResult(0, vote)).to.be.reverted;
      await expect(proxy.connect(arbiter).voteResult(0, vote)).to.be.reverted;
    });
    it("Should revert if game was not started yet", async function () {
      const { proxy, host } = await loadFixture(deployAndGamesCreatedAndJoinedFixture);

      const vote = 3;

      await expect(proxy.connect(host).voteResult(0, vote)).to.be.reverted;
    });
    it("Should revert if game was closed", async function () {
      const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      const drawVote = 3;

      const cancelTxn1 = await proxy.connect(host).voteResult(0, drawVote);
      await cancelTxn1.wait();
      const cancelTxn2 = await proxy.connect(player2).voteResult(0, drawVote);
      await cancelTxn2.wait();

      await expect(proxy.connect(host).voteResult(0, drawVote)).to.be.reverted;
    });
    describe("Both players Voted", function () {
      it("Should set disagreement if it is there, and not pay anyone", async function () {
        const { proxy, host, player2, bet } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

        const drawVote = 3;
        const winVote = 1;

        const cancelTxn1 = await proxy.connect(host).voteResult(0, drawVote);
        await cancelTxn1.wait();
        const cancelTxn2 = await proxy.connect(player2).voteResult(0, winVote);
        await cancelTxn2.wait();

        expect((await proxy.games(0)).disagreement).to.be.true;
        expect(await ethers.provider.getBalance(await proxy.getAddress())).to.equal(bet + bet + bet + bet, "Was not suppose to pay");
      });
      describe("Voting for draw", function () {
        it(
          "Should pay commission to arbiter and same size rewards for players (half), if both voted for draw",
          async function () {
            const { proxy, host, player2, arbiter, bet, commissionPercent } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

            const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
            const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
            const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

            const drawVote = 3;

            const hostTxn = await proxy.connect(host).voteResult(0, drawVote);
            const hostVoteReceipt = await hostTxn.wait();
            const player2Txn = await proxy.connect(player2).voteResult(0, drawVote);
            const player2VoteReceipt = await player2Txn.wait();

            const hostBalanceAfterDraw = await ethers.provider.getBalance(await host.getAddress());
            const player2BalanceAfterDraw = await ethers.provider.getBalance(await player2.getAddress());
            const arbiterBalanceAfterDraw = await ethers.provider.getBalance(await arbiter.getAddress());

            const expectedReward = BigInt(Number(bet) - Number(bet) * commissionPercent / 100);
            const arbiterCommission = BigInt(Number(bet) * commissionPercent / 100 * 2);

            expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(bet + bet, "Rewards was not payed");
            expect(hostBalanceAfterDraw - hostBalanceBeforeVoting).to.be.equal(expectedReward - hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
            expect(player2BalanceAfterDraw - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
            expect(arbiterBalanceAfterDraw - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
          });
        it("Should set game closed after draw", async function () {
          const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const drawVote = 3;

          const hostTxn = await proxy.connect(host).voteResult(0, drawVote);
          await hostTxn.wait();
          const player2Txn = await proxy.connect(player2).voteResult(0, drawVote);
          await player2Txn.wait();

          expect((await proxy.games(0)).closed).to.be.true;
        });
        it("Should not call draw if not all players voted", async function () {
          const { proxy, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const drawVote = 3;

          const player2Txn = await proxy.connect(player2).voteResult(0, drawVote);
          await player2Txn.wait();

          expect((await proxy.games(0)).closed).to.be.false;
        });
        it("Should call draw and emit event Draw", async function () {
          const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const drawVote = 3;

          const hostTxn = await proxy.connect(host).voteResult(0, drawVote);
          await hostTxn.wait();
          await expect(proxy.connect(player2).voteResult(0, drawVote)).to.emit(proxy, "Draw").withArgs(0);
        });
        it(
          "Should call draw, and set disagreement false after re-voting by one of players",
          async function () {
            const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

            const drawVote = 3;
            const firstPlaceVote = 1;

            const hostTxn = await proxy.connect(host).voteResult(0, drawVote);
            await hostTxn.wait();
            const player2Txn1 = await proxy.connect(player2).voteResult(0, firstPlaceVote);
            await player2Txn1.wait();

            await expect(proxy.connect(player2).voteResult(0, drawVote)).to.emit(proxy, "Draw").withArgs(0);
            expect((await proxy.games(0)).disagreement).to.be.false;
          });
      });
      describe("Voting for host victory", function () {
        it("Should reward winner and pay commission to arbiter", async function () {
          const {
            proxy,
            host,
            player2,
            arbiter,
            bet,
            commissionPercent
          } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

          const winHostTxn = await proxy.connect(host).voteResult(0, 1);
          const hostVoteReceipt = await winHostTxn.wait();
          const losePlayer2Txn = await proxy.connect(player2).voteResult(0, 2);
          const player2VoteReceipt = await losePlayer2Txn.wait();

          const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

          const expectedReward = BigInt((Number(bet) - Number(bet) * (commissionPercent / 100)) * 2);
          const arbiterCommission = BigInt(Number(bet) * (commissionPercent / 100) * 2)

          expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(bet + bet, "All funds of game should be payed");
          expect(hostBalanceAfterVoting - hostBalanceBeforeVoting).to.be.equal(expectedReward - hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
          expect(player2BalanceBeforeVoting - player2BalanceAfterVoting).to.be.equal(player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
          expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
        });
        it("Should set closed true after reward winner", async function () {
          const {
            proxy,
            host,
            player2,
          } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const winHostTxn = await proxy.connect(host).voteResult(0, 1);
          await winHostTxn.wait();
          const losePlayer2Txn = await proxy.connect(player2).voteResult(0, 2);
          await losePlayer2Txn.wait();

          expect((await proxy.games(0)).closed).to.be.true;
        });
        it("Should emit event Victory after reward winner", async function () {
          const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const losePlayer2Txn = await proxy.connect(player2).voteResult(0, 2);
          await losePlayer2Txn.wait();

          await expect(proxy.connect(host).voteResult(0, 1)).to.emit(proxy, "Victory").withArgs(0, await host.getAddress());
        });
        it(
          "Should reward winner, and set disagreement false after re-voting by one of players",
          async function () {
            const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

            const drawVote = 3;
            const lastPlaceVote = 2;
            const firstPlaceVote = 1;

            const hostTxn = await proxy.connect(host).voteResult(0, firstPlaceVote);
            await hostTxn.wait();
            const player2Txn1 = await proxy.connect(player2).voteResult(0, drawVote);
            await player2Txn1.wait();

            await expect(proxy.connect(player2).voteResult(0, lastPlaceVote)).to.emit(proxy, "Victory").withArgs(0, await host.getAddress());
            expect((await proxy.games(0)).disagreement).to.be.false;
          });
      });

      describe("Voting for player2 victory", function () {
        it("Should reward winner and pay commission to arbiter", async function () {
          const {
            proxy,
            host,
            player2,
            arbiter,
            bet,
            commissionPercent
          } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

          const loseHostTxn = await proxy.connect(host).voteResult(0, 2);
          const hostVoteReceipt = await loseHostTxn.wait();
          const winPlayer2Txn = await proxy.connect(player2).voteResult(0, 1);
          const player2VoteReceipt = await winPlayer2Txn.wait();

          const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

          const expectedReward = BigInt((Number(bet) - Number(bet) * (commissionPercent / 100)) * 2);
          const arbiterCommission = BigInt(Number(bet) * (commissionPercent / 100) * 2)

          expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(bet + bet, "All funds of game should be payed");
          expect(hostBalanceBeforeVoting - hostBalanceAfterVoting).to.be.equal(hostVoteReceipt.gasPrice * hostVoteReceipt.gasUsed);
          expect(player2BalanceAfterVoting - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
          expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
        });
        it("Should set closed true after reward winner", async function () {
          const {
            proxy,
            host,
            player2,
          } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const loseHostTxn = await proxy.connect(host).voteResult(0, 2);
          await loseHostTxn.wait();
          const winPlayer2Txn = await proxy.connect(player2).voteResult(0, 1);
          await winPlayer2Txn.wait();

          expect((await proxy.games(0)).closed).to.be.true;
        });
        it("Should emit event Victory after reward winner", async function () {
          const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

          const winPlayer2Txn = await proxy.connect(player2).voteResult(0, 1);
          await winPlayer2Txn.wait();

          await expect(proxy.connect(host).voteResult(0, 2)).to.emit(proxy, "Victory").withArgs(0, await player2.getAddress());
        });
        it(
          "Should reward winner, and set disagreement false after re-voting by one of players",
          async function () {
            const { proxy, host, player2 } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

            const drawVote = 3;
            const lastPlaceVote = 2;
            const firstPlaceVote = 1;

            const hostTxn = await proxy.connect(host).voteResult(0, drawVote);
            await hostTxn.wait();
            const player2Txn1 = await proxy.connect(player2).voteResult(0, firstPlaceVote);
            await player2Txn1.wait();

            await expect(proxy.connect(host).voteResult(0, lastPlaceVote)).to.emit(proxy, "Victory").withArgs(0, await player2.getAddress());
            expect((await proxy.games(0)).disagreement).to.be.false;
          });
      });

    });
    describe("Voting after play period is over", function () {
      it(
        "Should set disagreement and not pay rewards after both players voted for different result even if play period is over",
        async function () {
          const {
            proxy,
            host,
            player2,
            arbiter,
            bet,
            playPeriod,
          } = await loadFixture(deployAndGamesCreatedWithShortPlayPeriodAndJoinedAndStartedFixture);

          const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

          const winHostTxn = await proxy.connect(host).voteResult(0, 1);
          const host2VoteReceipt = await winHostTxn.wait();

          await network.provider.send("evm_increaseTime", [playPeriod * 2]);

          const winPlayer2Txn = await proxy.connect(player2).voteResult(0, 1);
          const player2VoteReceipt = await winPlayer2Txn.wait();

          const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());


          expect((await proxy.games(0)).disagreement).to.be.true;
          expect((await proxy.games(0)).closed).to.be.false;

          expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(bet + bet, "No game funds should be payed");
          expect(hostBalanceBeforeVoting - hostBalanceAfterVoting).to.be.equal(host2VoteReceipt.gasPrice * host2VoteReceipt.gasUsed);
          expect(player2BalanceBeforeVoting - player2BalanceAfterVoting).to.be.equal(player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
          expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(0);
        });
      it("Should call draw after single vote if play period has ended", async function () {
        const {
          proxy,
          host,
          player2,
          arbiter,
          bet,
          playPeriod,
          commissionPercent
        } = await loadFixture(deployAndGamesCreatedWithShortPlayPeriodAndJoinedAndStartedFixture);

        await network.provider.send("evm_increaseTime", [playPeriod * 2]);

        const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
        const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
        const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

        const drawVote = 3;

        const player2Txn = await proxy.connect(player2).voteResult(0, drawVote);
        const player2VoteReceipt = await player2Txn.wait();

        const hostBalanceAfterDraw = await ethers.provider.getBalance(await host.getAddress());
        const player2BalanceAfterDraw = await ethers.provider.getBalance(await player2.getAddress());
        const arbiterBalanceAfterDraw = await ethers.provider.getBalance(await arbiter.getAddress());

        const expectedReward = BigInt(Number(bet) - Number(bet) * commissionPercent / 100);
        const arbiterCommission = BigInt(Number(bet) * commissionPercent / 100 * 2)

        expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(0, "All game funds should be payed");
        expect(hostBalanceAfterDraw - hostBalanceBeforeVoting).to.be.equal(expectedReward);
        expect(player2BalanceAfterDraw - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
        expect(arbiterBalanceAfterDraw - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
      });
      it("Should reward winner after single vote for win if play period has ended", async function () {
        const {
          proxy,
          host,
          player2,
          arbiter,
          bet,
          playPeriod,
          commissionPercent
        } = await loadFixture(deployAndGamesCreatedWithShortPlayPeriodAndJoinedAndStartedFixture);

        await network.provider.send("evm_increaseTime", [playPeriod * 2]);

        const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
        const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
        const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

        const winVote = 1;

        const player2Txn = await proxy.connect(player2).voteResult(0, winVote);
        const player2VoteReceipt = await player2Txn.wait();

        const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
        const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
        const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

        const expectedReward = BigInt((Number(bet) - Number(bet) * commissionPercent / 100) * 2);
        const arbiterCommission = BigInt(Number(bet) * commissionPercent / 100 * 2);

        expect((await proxy.games(0)).closed).to.be.true;

        expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(0, "All game funds should be payed");
        expect(hostBalanceAfterVoting - hostBalanceBeforeVoting).to.be.equal(0);
        expect(player2BalanceAfterVoting - player2BalanceBeforeVoting).to.be.equal(expectedReward - player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
        expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
      });
      it("Should reward winner after single vote for lose if play period has ended", async function () {
        const {
          proxy,
          host,
          player2,
          arbiter,
          bet,
          playPeriod,
          commissionPercent
        } = await loadFixture(deployAndGamesCreatedWithShortPlayPeriodAndJoinedAndStartedFixture);

        await network.provider.send("evm_increaseTime", [playPeriod * 2]);

        const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
        const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
        const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

        const loseVote = 2;

        const player2Txn = await proxy.connect(player2).voteResult(0, loseVote);
        const player2VoteReceipt = await player2Txn.wait();

        const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
        const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
        const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

        const expectedReward = BigInt((Number(bet) - Number(bet) * commissionPercent / 100) * 2);
        const arbiterCommission = BigInt(Number(bet) * commissionPercent / 100 * 2)

        expect((await proxy.games(0)).closed).to.be.true;

        expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(0, "All game funds should be payed");
        expect(hostBalanceAfterVoting - hostBalanceBeforeVoting).to.be.equal(expectedReward);
        expect(player2BalanceBeforeVoting - player2BalanceAfterVoting).to.be.equal(player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
        expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
      });
      it(
        "Should reward winner after re-voting if there was disagreement, even if play period has ended",
        async function () {
          const {
            proxy,
            host,
            player2,
            arbiter,
            bet,
            playPeriod,
            commissionPercent
          } = await loadFixture(deployAndGamesCreatedWithShortPlayPeriodAndJoinedAndStartedFixture);

          const lastBlockTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
          await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + 1]);

          const player2Txn1 = await proxy.connect(player2).voteResult(0, 1);
          player2Txn1.wait();
          const hostTxn = await proxy.connect(host).voteResult(0, 1);
          hostTxn.wait();

          expect((await proxy.games(0)).disagreement).to.be.true;
          expect((await proxy.games(0)).closed).to.be.false;

          await network.provider.send("evm_increaseTime", [playPeriod * 2]);

          const hostBalanceBeforeVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceBeforeVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceBeforeVoting = await ethers.provider.getBalance(await arbiter.getAddress());

          const loseVote = 2;

          const player2Txn = await proxy.connect(player2).voteResult(0, loseVote);
          const player2VoteReceipt = await player2Txn.wait();

          const hostBalanceAfterVoting = await ethers.provider.getBalance(await host.getAddress());
          const player2BalanceAfterVoting = await ethers.provider.getBalance(await player2.getAddress());
          const arbiterBalanceAfterVoting = await ethers.provider.getBalance(await arbiter.getAddress());

          const expectedReward = BigInt((Number(bet) - Number(bet) * commissionPercent / 100) * 2);
          const arbiterCommission = BigInt(Number(bet) * commissionPercent / 100 * 2);

          expect((await proxy.games(0)).closed).to.be.true;
          expect((await proxy.games(0)).disagreement).to.be.false;

          expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(0, "All game funds should be payed");
          expect(hostBalanceAfterVoting - hostBalanceBeforeVoting).to.be.equal(expectedReward);
          expect(player2BalanceBeforeVoting - player2BalanceAfterVoting).to.be.equal(player2VoteReceipt.gasPrice * player2VoteReceipt.gasUsed);
          expect(arbiterBalanceAfterVoting - arbiterBalanceBeforeVoting).to.be.equal(arbiterCommission);
        });
    });
  });

  describe("Appointing winner by arbiter", function () {
    it("Should pay rewards to winner and commission to arbiter", async function () {
      const {
        proxy,
        host,
        player2,
        arbiter,
        bet,
        commissionPercent
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      const hostBalanceBeforeArbitrament = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeArbitrament = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeArbitrament = await ethers.provider.getBalance(await arbiter.getAddress());

      const arbTxn = await proxy.forceAppointWinner(0, await host.getAddress());
      const arbTxnReceipt = await arbTxn.wait();

      const hostBalanceAfterArbitrament = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterArbitrament = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterArbitrament = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt((Number(bet) - Number(bet) * commissionPercent / 100) * 2);
      const arbiterCommission = BigInt(Number(bet) * commissionPercent / 100 * 2);

      expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(bet + bet, "All game funds should be payed");
      expect(hostBalanceAfterArbitrament - hostBalanceBeforeArbitrament).to.be.equal(expectedReward);
      expect(player2BalanceAfterArbitrament - player2BalanceBeforeArbitrament).to.be.equal(0);
      expect(arbiterBalanceAfterArbitrament - arbiterBalanceBeforeArbitrament).to.be.equal(arbiterCommission - arbTxnReceipt.gasUsed * arbTxnReceipt.gasPrice);
    });
    it("Should set closer true", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await proxy.forceAppointWinner(0, await host.getAddress());

      expect((await proxy.games(0)).closed).to.be.true;
    });
    it("Should emit Victory event", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await expect(proxy.forceAppointWinner(0, await host.getAddress())).to.emit(proxy, "Victory").withArgs(0, await host.getAddress());
    });
    it("Should revert if game does not exist", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await expect(proxy.forceAppointWinner(10, await host.getAddress())).to.be.reverted;
    });
    it("Should revert if trying to call not by arbiter", async function () {
      const {
        proxy,
        host,
        player2,
        player3,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await expect(proxy.connect(host).forceAppointWinner(0, await host.getAddress())).to.be.reverted;
      await expect(proxy.connect(player2).forceAppointWinner(0, await host.getAddress())).to.be.reverted;
      await expect(proxy.connect(player3).forceAppointWinner(0, await host.getAddress())).to.be.reverted;
    });
    it("Should revert if trying appoint winner who not player of this game", async function () {
      const {
        proxy,
        player3,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await expect(proxy.forceAppointWinner(0, await player3.getAddress())).to.be.reverted;
    });
    it("Should revert if players did not reach disagreement", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      await expect(proxy.forceAppointWinner(0, await host.getAddress())).to.be.reverted;
    });
  });
  describe("Calling draw by arbiter", function () {
    it("Should pay rewards to players and commission to arbiter", async function () {
      const {
        proxy,
        host,
        player2,
        arbiter,
        bet,
        commissionPercent
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      const hostBalanceBeforeArbitrament = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceBeforeArbitrament = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceBeforeArbitrament = await ethers.provider.getBalance(await arbiter.getAddress());

      const arbTxn = await proxy.forceDraw(0);
      const arbTxnReceipt = await arbTxn.wait();

      const hostBalanceAfterArbitrament = await ethers.provider.getBalance(await host.getAddress());
      const player2BalanceAfterArbitrament = await ethers.provider.getBalance(await player2.getAddress());
      const arbiterBalanceAfterArbitrament = await ethers.provider.getBalance(await arbiter.getAddress());

      const expectedReward = BigInt(Number(bet) - Number(bet) * commissionPercent / 100);
      const arbiterCommission = BigInt(Number(bet) * commissionPercent / 100 * 2);

      expect(await ethers.provider.getBalance(await proxy.getAddress())).to.be.equal(bet + bet, "All game funds should be payed");
      expect(hostBalanceAfterArbitrament - hostBalanceBeforeArbitrament).to.be.equal(expectedReward);
      expect(player2BalanceAfterArbitrament - player2BalanceBeforeArbitrament).to.be.equal(expectedReward);
      expect(arbiterBalanceAfterArbitrament - arbiterBalanceBeforeArbitrament).to.be.equal(arbiterCommission - arbTxnReceipt.gasUsed * arbTxnReceipt.gasPrice);
    });
    it("Should set closer true", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await proxy.forceDraw(0);

      expect((await proxy.games(0)).closed).to.be.true;
    });
    it("Should emit Draw event", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await expect(proxy.forceDraw(0)).to.emit(proxy, "Draw").withArgs(0);
    });
    it("Should revert if game does not exist", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await expect(proxy.forceDraw(10)).to.be.reverted;
    });
    it("Should revert if trying to call not by arbiter", async function () {
      const {
        proxy,
        host,
        player2,
        player3,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedAndDisagreedFixture);

      await expect(proxy.connect(host).forceDraw(0)).to.be.reverted;
      await expect(proxy.connect(player2).forceDraw(0)).to.be.reverted;
      await expect(proxy.connect(player3).forceDraw(0)).to.be.reverted;
    });
    it("Should revert if players did not reach disagreement", async function () {
      const {
        proxy,
        host,
      } = await loadFixture(deployAndGamesCreatedAndJoinedAndStartedFixture);

      await expect(proxy.forceDraw(0)).to.be.reverted;
    });
  });
});