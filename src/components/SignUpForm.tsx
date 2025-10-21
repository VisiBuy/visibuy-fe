import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Mail, Phone, MapPin, User } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useRegisterMutation } from "../features/auth/authApi";
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
import { SellerRegisterSchema, SellerRegisterFormData } from "../types/auth";

export function SignUpForm() {
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SellerRegisterFormData>({
    resolver: zodResolver(SellerRegisterSchema),
    mode: "onTouched",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: SellerRegisterFormData) => {
    try {
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
      }).unwrap();

      toast({
        title: "Registration Successful",
        description: "Your seller account has been created successfully!",
      });

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description:
          error.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='w-full flex justify-center items-center px-4 py-16'>
      <div className='w-full max-w-2xl'>
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-bold text-gray-900 mb-2'>
            Create your seller account
          </h2>
          <p className='text-gray-600 text-lg md:text-xl'>
            Start selling with confidence using VisiBuy
          </p>
        </div>

        <div className='border border-gray-200 p-6 md:p-8 rounded-2xl bg-white shadow-lg'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Full Name */}
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xl font-semibold'>
                      Full Name
                      <span className='text-red-500 ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your full name'
                        {...field}
                        className='h-12'
                        icon={<User className='h-5 w-5 text-gray-400' />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
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

              {/* Phone */}
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xl font-semibold'>
                      Phone Number
                      <span className='text-red-500 ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your phone number'
                        {...field}
                        className='h-12'
                        icon={<Phone className='h-5 w-5 text-gray-400' />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xl font-semibold'>
                      Business Address
                      <span className='text-red-500 ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your business address'
                        {...field}
                        className='h-12'
                        icon={<MapPin className='h-5 w-5 text-gray-400' />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xl font-semibold'>
                      Password
                      <span className='text-red-500 ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Create a password'
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
                      Confirm Password
                      <span className='text-red-500 ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Confirm your password'
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

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name='acceptTerms'
                render={({ field }) => (
                  <FormItem className='flex items-start space-x-3'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className='mt-1'
                      />
                    </FormControl>
                    <div className='flex-1'>
                      <FormLabel className='text-base leading-relaxed'>
                        By checking this box, you agree to our{" "}
                        <a
                          href='/terms'
                          className='text-blue-600 hover:underline'
                        >
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href='/privacy'
                          className='text-blue-600 hover:underline'
                        >
                          Privacy Policy
                        </a>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className='pt-6'>
                <Button
                  type='submit'
                  className='w-full h-14 text-lg font-semibold'
                  disabled={!form.formState.isValid}
                >
                  Create Seller Account
                  <Loader2 className='ml-2 h-5 w-5' />
                </Button>
              </div>

              {/* Login Link */}
              <div className='text-center text-lg text-gray-600 mt-6'>
                <span>Already have an account? </span>
                <Button
                  asChild
                  variant='link'
                  className='text-blue-600 text-lg px-1'
                >
                  <a href='/login'>Sign In</a>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
