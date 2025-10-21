import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useForgotPasswordMutation } from "../features/auth/authApi";
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
  SellerForgotPasswordSchema,
  SellerForgotPasswordFormData,
} from "../types/auth";

export function PasswordForgotForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SellerForgotPasswordFormData>({
    resolver: zodResolver(SellerForgotPasswordSchema),
    mode: "onTouched",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: SellerForgotPasswordFormData) => {
    try {
      await forgotPassword({
        email: values.email,
      }).unwrap();

      toast({
        title: "Reset Link Sent",
        description: "Please check your email for password reset instructions.",
      });

      // Redirect back to login after successful request
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.data?.message || "Unable to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='w-full max-w-xl mx-auto flex flex-col items-center px-4'>
      {/* Header */}
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold text-gray-900 mt-12 mb-4'>
          Forgot password?
        </h2>
        <p className='text-gray-600 text-lg sm:text-xl leading-relaxed'>
          Enter your registered email address and we'll send you a password
          reset link.
        </p>
      </div>

      {/* Form */}
      <div className='w-full border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-lg bg-white'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xl font-semibold'>
                    Email Address
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your email address'
                      {...field}
                      className='h-12'
                      icon={<Mail className='h-5 w-5 text-gray-400' />}
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
                Send Reset Link
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
