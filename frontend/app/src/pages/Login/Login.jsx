import parseLinkToGetParams from "../../utils/parseLinkToGetParams"
import { steamParamsIsValid } from "../../utils/validators";
import { useLoginMutation } from "../../redux/api";
import { redirect } from "react-router-dom";


export default function Login() {
  if (!window.location.search) return redirect('/');

  const steamParams = parseLinkToGetParams();
  if (!steamParamsIsValid(steamParams)) return redirect('/');


  const [
    login,
    { isLoading, isUninitialized, error, data, isSuccess },
  ] = useLoginMutation();

  if (isUninitialized) login(steamParams);
  if (isSuccess) localStorage.setItem("auth_token", data.token);

  return (
    <div>Login</div>
  )
}