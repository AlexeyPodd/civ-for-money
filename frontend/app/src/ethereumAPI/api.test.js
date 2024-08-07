import { vi, describe, it, expect } from 'vitest';
import DuelContractAPIManager from './api';


vi.mock('ethers', () => {
  return {
    ethers: {
      Contract: vi.fn().mockImplementation(() => {
        return {
          createGame: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue({
              logs: [1, 2, 3],
            }),
          }),
          interface: {
            parseLog: vi.fn().mockReturnValue({
              name: "Created",
              args: {
                id: 15,
              },
            }),
          },
          games: vi.fn().mockResolvedValue({
            host: "HOST",
            player2: "PLAYER2",
            bet: "10000000000",
            timeStart: "1234567890",
            playPeriod: "12345",
            started: true,
            closed: false,
            disagreement: false,
            hostVote: "0",
            player2Vote: "1",
          }),
          join: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue("Mocked method join"),
          }),
          cancel: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue("Mocked method cancel"),
          }),
          excludePlayer2: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue("Mocked method excludePlayer2"),
          }),
          start: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue("Mocked method start"),
          }),
          voteResult: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue("Mocked method voteResult"),
          }),
          forceAppointWinner: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue("Mocked method forceAppointWinner"),
          }),
          forceDraw: vi.fn().mockResolvedValue({
            wait: vi.fn().mockResolvedValue("Mocked method forceDraw"),
          }),
          on: vi.fn(),
          removeAllListeners: vi.fn(),
        };
      }),
    },
  };
});


describe("constructor tests", () => {
  it("Should set correct signer, gameIndex and lastEventBlockNumber(null)", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    expect(contractAPI.signer).toBe('signer');
    expect(contractAPI.gameIndex).toBe(12);
    expect(contractAPI.lastEventBlockNumber).toBe(null);
  });
  it("Should set mocked contract", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    expect(vi.isMockFunction(contractAPI.contract.createGame)).toBe(true);
  });
});

describe("createGame tests", () => {
  it("Should create game and return mocked game id (15)", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    expect(await contractAPI.createGame(null, null)).toBe(15);
  });
});

describe("getGameData tests", () => {
  it("Should return correct formatted mocked game data", async () => {
    const expectedGameData = {
      host: "host",
      player2: "player2",
      bet: 10000000000,
      timeStart: 1234567890000,
      playPeriod: 12345000,
      started: true,
      closed: false,
      disagreement: false,
      hostVote: 0,
      player2Vote: 1,
    }
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const gameData = await contractAPI.getGameData();

    for (let key of Object.keys(expectedGameData)) {
      expect(gameData[key]).toBe(expectedGameData[key]);
    }
  });
});

describe("contract methods execution tests", () => {
  it("Should correctly execute method join", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const txnRes = await contractAPI.join();

    expect(txnRes).toBe("Mocked method join");
    expect(contractAPI.contract.join).toHaveBeenCalledWith(12, { value: 10000000000 });
  });
  it("Should correctly execute method cancel", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const txnRes = await contractAPI.cancel();

    expect(txnRes).toBe("Mocked method cancel");
    expect(contractAPI.contract.cancel).toHaveBeenCalledWith(12);
  });
  it("Should correctly execute method excludePlayer2", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const txnRes = await contractAPI.excludePlayer2();

    expect(txnRes).toBe("Mocked method excludePlayer2");
    expect(contractAPI.contract.excludePlayer2).toHaveBeenCalledWith(12);
  });
  it("Should correctly execute method start", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const txnRes = await contractAPI.start();

    expect(txnRes).toBe("Mocked method start");
    expect(contractAPI.contract.start).toHaveBeenCalledWith(12);
  });
  it("Should correctly execute method voteResult", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const txnRes = await contractAPI.voteResult(2);

    expect(txnRes).toBe("Mocked method voteResult");
    expect(contractAPI.contract.voteResult).toHaveBeenCalledWith(12, 2);
  });
  it("Should correctly execute method forceAppointWinner", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const txnRes = await contractAPI.forceAppointWinner('0x' + '1' * 40);

    expect(txnRes).toBe("Mocked method forceAppointWinner");
    expect(contractAPI.contract.forceAppointWinner).toHaveBeenCalledWith(12, '0x' + '1' * 40);
  });
  it("Should correctly execute method forceDraw", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    const txnRes = await contractAPI.forceDraw();

    expect(txnRes).toBe("Mocked method forceDraw");
    expect(contractAPI.contract.forceDraw).toHaveBeenCalledWith(12);
  });
});

describe("setEventListeners tests", () => {
  it("Should set listeners for all events", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    expect(onSpy).toHaveBeenCalledWith('Joined', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('SlotFreed', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('Cancel', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('Start', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('Victory', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('Draw', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('Disagreement', expect.any(Function));
  });
  it("Should set correct event listener for Joined event", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    const mockEvent = {
      log: {
        blockNumber: 1233,
      }
    }

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    const eventListener = onSpy.mock.calls[0][1];

    eventListener(12, '0x'+ '2'*40, mockEvent);

    expect(contractAPI.lastEventBlockNumber).toBe(1233);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Player joined!',
      description: 'Some player has joined game.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      duration: null,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockGetPlayer2DataByAddress).toHaveBeenCalledWith('0x'+ '2'*40);
  });
  it("Should set correct event listener for SlotFreed event", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    const mockEvent = {
      log: {
        blockNumber: 1233,
      }
    }

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    const eventListener = onSpy.mock.calls[1][1];

    eventListener(12, mockEvent);

    expect(contractAPI.lastEventBlockNumber).toBe(1233);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Slot freed!',
      description: 'Seconds player quit or was kicked.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      duration: null,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  it("Should set correct event listener for Cancel event", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    const mockEvent = {
      log: {
        blockNumber: 1233,
      }
    }

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    const eventListener = onSpy.mock.calls[2][1];

    eventListener(12, mockEvent);

    expect(contractAPI.lastEventBlockNumber).toBe(1233);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Game canceled!',
      description: 'Host has canceled game. All funds were returned to owners.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      duration: null,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  it("Should set correct event listener for Start event", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    const mockEvent = {
      log: {
        blockNumber: 1233,
      }
    }

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    const eventListener = onSpy.mock.calls[3][1];

    eventListener(12, '0x'+'2'*40, mockEvent);

    expect(contractAPI.lastEventBlockNumber).toBe(1233);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Game started!',
      description: 'Participants will play, and then each of them shall contribute the result.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      duration: null,
    });
    expect(mockOnChainRefetch).toHaveBeenCalledTimes(1);
  });
  it("Should set correct event listener for Victory event", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    const mockEvent = {
      log: {
        blockNumber: 1233,
      }
    }

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    const eventListener = onSpy.mock.calls[4][1];

    eventListener(12, '0x'+'2'*40, mockEvent);

    expect(contractAPI.lastEventBlockNumber).toBe(1233);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'The winner has been determined!',
      description: 'Game is finished now. Prize fund has been transferred to the winner.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      duration: null,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  it("Should set correct event listener for Draw event", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    const mockEvent = {
      log: {
        blockNumber: 1233,
      }
    }

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    const eventListener = onSpy.mock.calls[5][1];

    eventListener(12, mockEvent);

    expect(contractAPI.lastEventBlockNumber).toBe(1233);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Game ended in a draw!',
      description: 'There is no winner. Prize fund was divided equally.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      duration: null,
    });
    expect(mockOnChainRefetch).toHaveBeenCalledTimes(1);
  });
  it("Should set correct event listener for Disagreement event", () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);
    const onSpy = contractAPI.contract.on;

    const mockDispatch = vi.fn();
    const mockToast = vi.fn();
    const mockOnChainRefetch = vi.fn();
    const mockGetPlayer2DataByAddress = vi.fn();

    const mockEvent = {
      log: {
        blockNumber: 1233,
      }
    }

    contractAPI.setEventListeners(
      mockDispatch,
      mockToast,
      mockOnChainRefetch,
      mockGetPlayer2DataByAddress,
    );

    const eventListener = onSpy.mock.calls[6][1];

    eventListener(12, mockEvent);

    expect(contractAPI.lastEventBlockNumber).toBe(1233);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Players reached disagreement!',
      description: 'The result will be decided by the arbitrator. But until the decision is made, players can change their vote.',
      status: 'warning',
      position: 'top',
      isClosable: true,
      duration: null,
    });
    expect(mockOnChainRefetch).toHaveBeenCalledTimes(1);
  });
});

describe("removeAllListeners tests", () => {
  it("Should remove all listeners", async () => {
    const contractAPI = new DuelContractAPIManager('signer', 12);

    await contractAPI.removeAllListeners();

    expect(contractAPI.contract.removeAllListeners).toHaveBeenCalledTimes(1);
  });
});