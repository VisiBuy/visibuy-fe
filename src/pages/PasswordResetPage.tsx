import React from "react";
import { AuthScreen } from "../components/AuthScreen";
import { PasswordResetForm } from "../components/PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <AuthScreen title='Password Reset'>
      <PasswordResetForm />
    </AuthScreen>
  );
}
