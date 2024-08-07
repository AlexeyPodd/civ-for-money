import { test, expect } from 'vitest';
import reducer, {
  gameCreatingStarted,
  gameCreatingFinished,
  onChainGameDataFetched,
  player2JoinedEventEmitted,
  slotFreedEventEmitted,
  gameCancelEventEmitted,
  victoryEventEmitted,
  selectIsCreatingGame,
  selectServerGameData,
  selectOnChanGameData,
} from './gameSlice';
import { ethers } from 'ethers';


test("Should return the initial state", () => {
  expect(reducer(undefined, { type: 'unknown' })).toEqual({
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: {},
  });
});

test("Should set isCreatingGame true when gameCreatingStarted", () => {
  expect(reducer(undefined, gameCreatingStarted())).toEqual({
    isCreatingGame: true,
    serverGameData: {},
    onChainGameData: {},
  });
});

test("Should set isCreatingGame false when gameCreatingFinished", () => {
  const testState = {
    isCreatingGame: true,
    serverGameData: {},
    onChainGameData: {},
  }

  expect(reducer(testState, gameCreatingFinished())).toEqual({
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: {},
  });
});

test("Should update fetched data to onChainGameData when onChainGameDataFetched", () => {
  const testState = {
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 1000 },
  }

  expect(reducer(testState, onChainGameDataFetched({ bet: 2000, playPeriod: 1200 }))).toEqual({
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 2000, playPeriod: 1200 },
  });
});

test("Should set player2 address when player2JoinedEventEmitted", () => {
  const testState = {
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 1000 },
  }

  expect(reducer(testState, player2JoinedEventEmitted('0x' + '2' * 40))).toEqual({
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 1000, player2: '0x' + '2' * 40 },
  });
});

test("Should set player2 as null and empty address when slotFreedEventEmitted", () => {
  const testState = {
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 1000, player2: '0x' + '2' * 40 },
  }

  expect(reducer(testState, slotFreedEventEmitted())).toEqual({
    isCreatingGame: false,
    serverGameData: { player2: null },
    onChainGameData: { id: 12, bet: 1000, player2: ethers.ZeroAddress },
  });
});

test("Should set closed true when gameCancelEventEmitted", () => {
  const testState = {
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 1000, closed: false },
  }

  expect(reducer(testState, gameCancelEventEmitted())).toEqual({
    isCreatingGame: false,
    serverGameData: { closed: true },
    onChainGameData: { id: 12, bet: 1000, closed: true },
  });
});

test("Should set winner address when victoryEventEmitted", () => {
  const testState = {
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 1000, closed: false },
  }

  expect(reducer(testState, victoryEventEmitted('0x' + '1' * 40))).toEqual({
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: { id: 12, bet: 1000, closed: false, winner: '0x' + '1' * 40 },
  });
});

test("Should return isCreatingGame when called selector", () => {
  const testState = {
    game: {
      isCreatingGame: false,
      serverGameData: {},
      onChainGameData: {},
    }
  };
  expect(selectIsCreatingGame(testState)).toBe(false);
});

test("Should return serverGameData when called selector", () => {
  const testState = {
    game: {
      isCreatingGame: false,
      serverGameData: {game: 'chess', rules: 'no cheating'},
      onChainGameData: {id: 12, bet: 1000000},
    }
  };
  expect(selectServerGameData(testState)).toEqual({game: 'chess', rules: 'no cheating'});
});

test("Should return onChainGameData when called selector", () => {
  const testState = {
    game: {
      isCreatingGame: false,
      serverGameData: {game: 'chess', rules: 'no cheating'},
      onChainGameData: {id: 12, bet: 1000000},
    }
  };
  expect(selectOnChanGameData(testState)).toEqual({id: 12, bet: 1000000});
});