export function steamParamsIsValid(steamParams) {
  const requiredKeys = [
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
  ]
  for (let key of requiredKeys) {
    if (!key in steamParams) return false;
  }
  return true;
}