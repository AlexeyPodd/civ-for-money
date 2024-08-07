import { expect, test } from 'vitest';
import { steamParamsIsValid } from './validators';

test("Should validate if all steam parameters present", () => {
  const steamKeys = new Set([
    "openid.assoc_handle",
    "openid.claimed_id",
    "openid.identity",
    "openid.mode",
    "openid.ns",
    "openid.op_endpoint",
    "openid.response_nonce",
    "openid.return_to",
    "openid.sig",
    "openid.signed",
  ]);

  expect(steamParamsIsValid(steamKeys)).toBeTruthy;
});

test("Should not validate if not all steam parameters present", () => {
  const steamKeys = new Set([
    "closeid.something",
    "openid.claimed_id",
    "openid.identity",
    "openid.mode",
    "openid.ns",
    "openid.op_endpoint",
    "openid.response_nonce",
    "openid.return_to",
    "openid.sig",
    "openid.signed",
  ]);

  expect(steamParamsIsValid(steamKeys)).toBeFalsy;
});