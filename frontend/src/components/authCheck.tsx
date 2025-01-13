// src/components/AuthCheck.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAdminStatus, setLoadingStatus } from "../slices/authSlice";

const AuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    dispatch(setLoadingStatus(true));

    if (token && role === "admin") {
      dispatch(setAdminStatus(true));
    } else if (token && role === "user") {
      dispatch(setAdminStatus(false));
    } else {
      dispatch(setAdminStatus(false));
    }

    dispatch(setLoadingStatus(false));
  }, [dispatch]);

  return null;
};

export default AuthCheck;
