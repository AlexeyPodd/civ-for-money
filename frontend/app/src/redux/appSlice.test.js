import { test, expect } from 'vitest';
import reducer, { initializedSuccess, selectInitialized } from './appSlice';

test("Should return the initial state", () => {
  expect(reducer(undefined, { type: 'unknown' })).toEqual(
    { initialized: false }
  );
});

test("Should set initialized true when initializedSuccess, if was false", () => {
  expect(reducer(undefined, initializedSuccess())).toEqual({ initialized: true });
});

test("Should set initialized true when initializedSuccess, if was true", () => {
  const testState = { initialized: true };
  expect(reducer(testState, initializedSuccess())).toEqual({ initialized: true });
});

test("Should return initialized when called selector", () => {
  const testState = { app: {initialized: false }};
  expect(selectInitialized(testState)).toBeFalsy();
});