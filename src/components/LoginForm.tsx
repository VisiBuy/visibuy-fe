import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Mail } from "lucide-react";
import { useLoginMutation } from "../features/auth/authApi";
import { useToast } from "../hooks/use-toast";
import { Button } from "../ui/Button";
import Input from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { SellerLoginSchema, SellerLoginFormData } from "../types/auth";

export function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTypingDone(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<SellerLoginFormData>({
    resolver: zodResolver(SellerLoginSchema),
    mode: "onTouched",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: SellerLoginFormData) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to dashboard...",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description:
          error.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const isButtonDisabled = () =>
    isLoading || form.formState.isSubmitting || !form.formState.isValid;

  return (
    <div className='w-full max-w-xl mx-auto flex flex-col items-center min-h-screen px-4'>
      {/* Welcome Section */}
      <div className='text-center mb-8'>
        <h2
          className={`text-4xl font-bold text-gray-900 mt-12 whitespace-nowrap overflow-hidden ${
            isTypingDone ? "" : "border-r-4 border-black animate-pulse"
          }`}
        >
          Welcome back!
        </h2>
        <p className='text-gray-600 text-xl mt-4'>
          Please enter your login details.
        </p>
      </div>

      {/* Login Form */}
      <div className='w-full border border-gray-200 p-8 rounded-2xl shadow-lg bg-white'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex justify-start text-xl font-semibold'>
                    Email Address
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your email'
                      {...field}
                      className='text-lg h-12'
                      icon={<Mail className='h-5 w-5 text-gray-400' />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex justify-start text-xl font-semibold'>
                    Password
                    <span className='text-red-500 ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your password'
                      {...field}
                      className='text-base h-12'
                      type={showPassword ? "text" : "password"}
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

            <FormField
              control={form.control}
              name='rememberMe'
              render={({ field }) => (
                <FormItem className='flex items-center space-x-2'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-lg font-medium'>
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className='pt-4'>
              <Button
                disabled={isButtonDisabled()}
                type='submit'
                className='w-full h-16 text-xl font-semibold'
              >
                Sign In
                {isLoading && <Loader2 className='ml-2 h-5 w-5 animate-spin' />}
              </Button>
            </div>

            <div className='flex justify-center items-center text-lg text-gray-600 mt-4'>
              <span>Don't have an account?</span>
              <Button
                asChild
                variant='link'
                className='px-2 text-blue-600 text-lg'
              >
                <a href='/signup'>Sign Up</a>
              </Button>
            </div>

            <div className='text-center'>
              <Button asChild variant='link' className='text-blue-600 text-lg'>
                <a href='/password-recovery'>Forgot Password?</a>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
