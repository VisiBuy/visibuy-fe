import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useResetPasswordMutation } from "../features/auth/authApi";
import { Button } from "../ui/Button";
import Input from "../ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import {
  SellerResetPasswordSchema,
  SellerResetPasswordFormData,
} from "../types/auth";

export function PasswordResetForm() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<SellerResetPasswordFormData>({
    resolver: zodResolver(SellerResetPasswordSchema),
    mode: "onTouched",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      password: "",
      confirmPassword: "",
      resetToken: "",
    },
  });

  useEffect(() => {
    // Get reset token from URL params
    const token = searchParams.get("token") || searchParams.get("code") || "";
    form.setValue("resetToken", token);
  }, [searchParams, form]);

  const onSubmit = async (values: SellerResetPasswordFormData) => {
    try {
      await resetPassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
        resetToken: values.resetToken,
      }).unwrap();

      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully!",
      });

      // Redirect to login page after successful reset
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description:
          error.data?.message || "Unable to reset password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='w-full max-w-xl mx-auto flex flex-col items-center px-4'>
      {/* Header */}
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold text-gray-900 mt-12 mb-4'>
          Reset Password
        </h2>
        <p className='text-gray-600 text-lg sm:text-xl leading-relaxed'>
          Enter your new password and the reset code sent to your email.
        </p>
      </div>

      {/* Form */}
      <div className='w-full border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-lg bg-white'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xl font-semibold'>
                    New Password
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your new password'
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className='h-12'
                      icon={
                        showPassword ? (
                          <EyeOff
                            className='h-5 w-5 text-gray-400 cursor-pointer'
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <Eye
                            className='h-5 w-5 text-gray-400 cursor-pointer'
                            onClick={() => setShowPassword(true)}
                          />
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xl font-semibold'>
                    Confirm New Password
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Confirm your new password'
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className='h-12'
                      icon={
                        showConfirmPassword ? (
                          <EyeOff
                            className='h-5 w-5 text-gray-400 cursor-pointer'
                            onClick={() => setShowConfirmPassword(false)}
                          />
                        ) : (
                          <Eye
                            className='h-5 w-5 text-gray-400 cursor-pointer'
                            onClick={() => setShowConfirmPassword(true)}
                          />
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='pt-4'>
              <Button
                disabled={!form.formState.isValid}
                type='submit'
                className='w-full h-16 text-xl font-semibold'
              >
                Update Password
                <Loader2 className='ml-2 h-5 w-5' />
              </Button>
            </div>

            <div className='flex justify-center items-center text-lg text-gray-600 mt-6'>
              <Button
                type='button'
                variant='link'
                className='text-blue-600 text-lg px-2'
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className='h-5 w-5 mr-2' />
                Back to Sign In
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
