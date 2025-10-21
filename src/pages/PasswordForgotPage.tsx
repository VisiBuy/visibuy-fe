import React from "react";
import { AuthScreen } from "../components/AuthScreen";
import { PasswordForgotForm } from "../components/PasswordForgotForm";

export default function PasswordForgotPage() {
  return (
    <AuthScreen title='Password Recovery'>
      <PasswordForgotForm />
    </AuthScreen>
  );
}
