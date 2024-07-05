import { useDispatch, useSelector } from "react-redux";
import { initializedSuccess, selectInitialized } from "../redux/appSlice";
import { useEffect } from "react";
import { tokenGotten, tokenLost } from "../redux/authSlice";
import { useGetUserDataQuery } from "../redux/api";

export default function UseInitiation() {
  // checking validity of auth token, if yes - getting user data.
  
  const initialized = useSelector(selectInitialized);
  const dispatch = useDispatch();

  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    if (token) dispatch(tokenGotten());
  }, [token]);

  const { error, isSuccess, isError } = useGetUserDataQuery(undefined, { skip: !token });

  useEffect(() => {
    if (isError && error.data.detail == "Invalid token.") {
      localStorage.removeItem("auth_token");
      dispatch(tokenLost());
    }
  }, [isError, error]);

  useEffect(() => {
    if (!token || isSuccess || isError) {
      dispatch(initializedSuccess());
    }
  }, [token, isSuccess, isError])

  return initialized;
}