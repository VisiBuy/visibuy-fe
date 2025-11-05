

export interface SignupFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}