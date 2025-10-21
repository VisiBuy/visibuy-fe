import React from "react";
import { AuthScreen } from "../components/AuthScreen";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <AuthScreen title='Login'>
      <LoginForm />
    </AuthScreen>
  );
}
