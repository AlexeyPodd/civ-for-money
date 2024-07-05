import parseURLToGetParams from "../../utils/parseURLToGetParams"
import { steamParamsIsValid } from "../../utils/validators";
import { useLoginMutation } from "../../redux/api";
import { useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader"
import { useEffect } from "react";


export default function Login() {
  const navigate = useNavigate();
  const steamParams = parseURLToGetParams();
  const loginParametersAreValid = window.location.search && steamParamsIsValid(steamParams);
  
  const [
    login,
    { isUninitialized, data, isSuccess, isError },
  ] = useLoginMutation();

  // go to main page if login process finished (with success or error)
  useEffect(() => {
    if (!loginParametersAreValid || isSuccess || isError) navigate('/');
  }, [loginParametersAreValid, isSuccess, isError]);

  // login on server if all parameters are valid
  useEffect(() => {
    if (loginParametersAreValid && isUninitialized) login(steamParams);
  }, [loginParametersAreValid, isUninitialized])
  
  // set auth token to local_storage
  useEffect(() => {
    if (isSuccess) localStorage.setItem("auth_token", data.token);
  }, [isSuccess]);  

  return (
    <Preloader />
  )
}