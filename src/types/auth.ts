/**
 * Seller-specific authentication types and schemas
 * Migrated and refactored from VisiBuy---Frontend for seller-only authentication
 */

import { z, ZodType } from "zod";

// Base types for seller authentication
export interface SellerLoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SellerRegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  acceptTerms: boolean;
}

export interface SellerForgotPassword {
  email: string;
}

export interface SellerResetPassword {
  password: string;
  confirmPassword: string;
  resetToken: string;
}

export interface SellerUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: "seller";
  hasCompletedOnboarding?: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Validation schemas for seller authentication
export const SellerLoginSchema: ZodType<SellerLoginCredentials> = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email must be less than 100 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

export const SellerRegisterSchema: ZodType<SellerRegisterCredentials> = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(2, { message: "Full name must be at least 2 characters" })
      .max(100, { message: "Full name must be less than 100 characters" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" })
      .max(100, { message: "Email must be less than 100 characters" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(8, { message: "Password confirmation is required" }),
    phone: z
      .string({ required_error: "Phone number is required" })
      .min(10, { message: "Please enter a valid phone number" })
      .max(15, { message: "Phone number must be less than 15 characters" }),
    address: z
      .string({ required_error: "Address is required" })
      .min(10, { message: "Please enter a complete address" })
      .max(200, { message: "Address must be less than 200 characters" }),
    acceptTerms: z
      .boolean({ required_error: "You must accept the terms and conditions" })
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SellerForgotPasswordSchema: ZodType<SellerForgotPassword> =
  z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" })
      .max(100, { message: "Email must be less than 100 characters" }),
  });

export const SellerResetPasswordSchema: ZodType<SellerResetPassword> = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(8, { message: "Password confirmation is required" }),
    resetToken: z
      .string({ required_error: "Reset token is required" })
      .min(1, { message: "Invalid reset token" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type exports for form data
export type SellerLoginFormData = z.infer<typeof SellerLoginSchema>;
export type SellerRegisterFormData = z.infer<typeof SellerRegisterSchema>;
export type SellerForgotPasswordFormData = z.infer<
  typeof SellerForgotPasswordSchema
>;
export type SellerResetPasswordFormData = z.infer<
  typeof SellerResetPasswordSchema
>;
