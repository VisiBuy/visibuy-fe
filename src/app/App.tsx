import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useRefreshMutation } from "../features/auth/authApi";
import { useAppDispatch } from "./hooks";
import { authActions } from "../features/auth/authSlice";

export default function App() {
  const [refresh] = useRefreshMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const tryRestore = async () => {
      try {
        const res = await refresh().unwrap();
        const { accessToken, user, permissions, roles } = res;
        dispatch(
          authActions.setCredentials({ accessToken, user, permissions, roles })
        );
      } catch {
        // ignore
      }
    };
    tryRestore();
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
}
