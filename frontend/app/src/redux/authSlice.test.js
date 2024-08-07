import { test, expect } from 'vitest';
import reducer, {
  tokenGotten,
  tokenLost,
  loggingInStarted,
  loggingInFinished,
  setWalletConnected,
  setWalletDisconnected,
  selectIsAuth,
  selectWalletConnected,
  selectUsername,
  selectAvatar,
  selectUUID,
  selectIsLoggingIn,
  selectIsArbiter,
  selectBanned,
} from './authSlice';


test("Should return the initial state", () => {
  expect(reducer(undefined, { type: 'unknown' })).toEqual({
    isLoggingIn: false,
    isAuth: false,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should set isAuth true when tokenGotten", () => {
  expect(reducer(undefined, tokenGotten())).toEqual({
    isLoggingIn: false,
    isAuth: true,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should set isAuth false when tokenLost", () => {
  const testState = {
    isLoggingIn: false,
    isAuth: true,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  }

  expect(reducer(testState, tokenLost())).toEqual({
    isLoggingIn: false,
    isAuth: false,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should set isLoggingIn true when loggingInStarted", () => {
  expect(reducer(undefined, loggingInStarted())).toEqual({
    isLoggingIn: true,
    isAuth: false,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should set isLoggingIn false when loggingInFinished", () => {
  const testState = {
    isLoggingIn: true,
    isAuth: false,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  }

  expect(reducer(testState, loggingInFinished())).toEqual({
    isLoggingIn: false,
    isAuth: false,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should set walletConnected true when setWalletConnected", () => {
  expect(reducer(undefined, setWalletConnected('0x' + '1' * 40))).toEqual({
    isLoggingIn: false,
    isAuth: false,
    walletConnected: true,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should set isArbiter true when setWalletConnected if connected address is arbiter", () => {
  expect(reducer(undefined, setWalletConnected(import.meta.env.VITE_ARBITER_ADDRESS.toLowerCase()))).toEqual({
    isLoggingIn: false,
    isAuth: false,
    walletConnected: true,
    isArbiter: true,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should set walletConnected and isArbiter false when setWalletDisconnected", () => {
  const testState = {
    isLoggingIn: false,
    isAuth: false,
    walletConnected: true,
    isArbiter: true,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  }

  expect(reducer(testState, setWalletDisconnected())).toEqual({
    isLoggingIn: false,
    isAuth: false,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  });
});

test("Should return isAuth when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: false,
      username: null,
      avatar: null,
      uuid: null,
      banned: null,
    }
  };
  expect(selectIsAuth(testState)).toBeFalsy();
});

test("Should return walletConnected when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: false,
      username: null,
      avatar: null,
      uuid: null,
      banned: null,
    }
  };
  expect(selectWalletConnected(testState)).toBeFalsy();
});

test("Should return username when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: false,
      username: 'Bob',
      avatar: null,
      uuid: null,
      banned: null,
    }
  };
  expect(selectUsername(testState)).toBe('Bob');
});

test("Should return avatar when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: false,
      username: null,
      avatar: 'aVa',
      uuid: null,
      banned: null,
    }
  };
  expect(selectAvatar(testState)).toBe('aVa');
});

test("Should return uuid when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: false,
      username: null,
      avatar: null,
      uuid: 1234567890,
      banned: null,
    }
  };
  expect(selectUUID(testState)).toBe(1234567890);
});

test("Should return isLoggingIn when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: false,
      username: null,
      avatar: null,
      uuid: null,
      banned: null,
    }
  };
  expect(selectIsLoggingIn(testState)).toBeFalsy();
});

test("Should return isArbiter when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: true,
      username: null,
      avatar: null,
      uuid: null,
      banned: null,
    }
  };
  expect(selectIsArbiter(testState)).toBeTruthy();
});

test("Should return banned when called selector", () => {
  const testState = {
    auth: {
      isLoggingIn: false,
      isAuth: false,
      walletConnected: false,
      isArbiter: false,
      username: null,
      avatar: null,
      uuid: null,
      banned: true,
    }
  };
  expect(selectBanned(testState)).toBeTruthy();
});