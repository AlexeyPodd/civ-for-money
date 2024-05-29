import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const rulesSlice = createSlice({
  name: 'rules',
  initialState: {
    rules: [],
  },
  reducers: {
    ruleDeleted: (state, action) => {
      state.rules = state.rules.filter(r => r.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getUserRules.matchFulfilled,
        (state, { payload }) => {
          state.rules = payload;
        }
      )
      .addMatcher(
        api.endpoints.createRule.matchFulfilled,
        (state, { payload }) => {
          state.rules.push(payload);
        }
      )
      .addMatcher(
        api.endpoints.updateRule.matchFulfilled,
        (state, { payload }) => {
          const updatedRule = state.rules.find(r => r.id === payload.id);
          if (updatedRule) {
            updatedRule.title = payload.title;
            updatedRule.description = payload.description;
          }
          else {
            state.rules.push(payload);
          }
        }
      )
  },
});

export const selectRules = (state) => state.rules.rules;

export const { ruleDeleted } = rulesSlice.actions;

export default rulesSlice.reducer;