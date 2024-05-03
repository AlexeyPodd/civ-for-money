import { useEffect } from "react";
import parseLinkToGetParams from "../../utils/parseLinkToGetParams"
import { loginAPI } from "../../api/api";

export default function Login() {
  console.log(parseLinkToGetParams());

  useEffect(() => {
    async function sendAuthData() {
      if (window.location.search) {
        await loginAPI.sendAuthData(window.location.search);
      }
    }
    sendAuthData();
  }, [])

  return (
    <div>Login</div>
  )
}
