import createGetLink from "./createGetLink";

export default function createSteamLoginLink() {
  const baseURL = "https://steamcommunity.com/openid/login/";

  const params = {
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.ns_sreg": "http://openid.net/extensions/sreg/1.1",
    "openid.sreg_optional": "email,fullname,nickname",
    "openid.realm": import.meta.env.VITE_BASE_URL,
    "openid.mode": "checkid_setup",
    "openid.return_to": import.meta.env.VITE_BASE_URL + "login",
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
  };

  return createGetLink(baseURL, params);
}
