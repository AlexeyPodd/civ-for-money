import { steamParamsIsValid } from "../../utils/validators";
import { useLoginMutation } from "../../redux/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader"
import { useEffect, useState } from "react";
import parseSearchParams from "../../utils/parseSearchParams";
import SomeError from "../../components/SomeError/SomeError";


export default function Login() {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [loginParametersAreValid, setLoginParametersAreValid] = useState(false);
  const [loginParametersValidated, setLoginParametersValidated] = useState(false);

  // checking are parameters valid
  useEffect(() => {
    setLoginParametersAreValid(searchParams.size === 10 && steamParamsIsValid(searchParams));
    setLoginParametersValidated(true);

  }, [searchParams]);

  const [
    login,
    { isUninitialized, data, isSuccess, isError },
  ] = useLoginMutation();

  // go to main page if login process finished (with success or error)
  useEffect(() => {
    if (isSuccess || isError) navigate('/');
  }, [loginParametersValidated, loginParametersAreValid, isSuccess, isError]);

  // login on server if all parameters are valid
  useEffect(() => {
    if (loginParametersValidated && loginParametersAreValid && isUninitialized) login(parseSearchParams(searchParams));
  }, [loginParametersValidated, loginParametersAreValid, isUninitialized])
  
  // set auth token to local_storage
  useEffect(() => {
    if (isSuccess) localStorage.setItem("auth_token", data.token);
  }, [isSuccess]);  

  if (loginParametersValidated && !loginParametersAreValid) return <SomeError error={{}} />

  return (
    <Preloader />
  )
}