import React from 'react';
import { AuthScreen } from '../components/AuthScreen';
import { SignUpForm } from '../components/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthScreen title="Sign Up">
      <SignUpForm />
    </AuthScreen>
  );
}