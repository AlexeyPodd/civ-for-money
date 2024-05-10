import parseLinkToGetParams from "../../utils/parseLinkToGetParams"
import { steamParamsIsValid } from "../../utils/validators";
import { useLoginMutation } from "../../redux/api";
import { useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader"
import { useEffect } from "react";


export default function Login() {
  const navigate = useNavigate();
  const steamParams = parseLinkToGetParams();
  const loginParametersAreValid = window.location.search && steamParamsIsValid(steamParams);
  
  const [
    login,
    { isUninitialized, data, isSuccess, isError },
  ] = useLoginMutation();

  useEffect(() => {
    if (!loginParametersAreValid || isSuccess || isError) navigate('/');
  }, [loginParametersAreValid, isSuccess, isError]);


  useEffect(() => {
    if (loginParametersAreValid && isUninitialized) login(steamParams);
  }, [loginParametersAreValid, isUninitialized])
  
  useEffect(() => {
    if (isSuccess) localStorage.setItem("auth_token", data.token);
  }, [isSuccess]);  

  return (
    <Preloader />
  )
}