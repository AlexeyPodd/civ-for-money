import { test, expect } from 'vitest';
import reducer, {
  ruleDeleted,
  selectRules,
} from './rulesSlice';


test("Should return the initial state", () => {
  expect(reducer(undefined, { type: 'unknown' })).toEqual({
    rules: [],
  });
});

test("Should delete rule by id from state", () => {
  const testState = {
    rules: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  }
  expect(reducer(testState, ruleDeleted({id: 2}))).toEqual({
    rules: [{ id: 1 }, { id: 3 }, { id: 4 }],
  });
});

test("Should return rules when called selector", () => {
  const testState = {
    rules: {
      rules: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    }
  };
  expect(selectRules(testState)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
});