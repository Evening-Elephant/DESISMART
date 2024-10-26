"use client";

import React, { ChangeEvent, useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from '@/lib/AuthProvider';

function LoginPage() {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();


  const router = useRouter();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axiosInstance.post('/apiv1/login/', { email, password });
    
      // Handle successful responses
      if (response.status === 200) {
        const { token } = response.data; // Access token from response data
        login(token); // Set the userId using the login function
        router.push('/dashboard'); // Redirect to the main dashboard
        toast({
          title: 'Success',
          description: 'Login successful.',
          variant: 'default',
        });
      } else if (response.status === 202) {
        // Prompt to reset password
        router.push(`/auth/resetpassword?emailaddress=${encodeURIComponent(email)}`);
        toast({
          title: 'Success',
          description: 'Login successful. Please reset your password.',
          variant: 'default',
        });
      } else if (response.status === 403) {
        // Handle password expiration case
        router.push(`/auth/resetpassword?emailaddress=${encodeURIComponent(email)}`);
        toast({
          title: 'Warning',
          description: 'Your password has expired. Please change your password.',
          variant: 'default',
        });
      }
    } catch (error: any) {
      // Handle errors based on response status code
      if (error.response) {
        const { status, data } = error.response;
    
        if (status === 401) {
          // Incorrect credentials or too many failed login attempts
          toast({
            title: 'Error',
            description: data.detail?.message || 'Invalid credentials or account issues.',
            variant: 'default',
          });
        } else if (status === 402) {
          // User account is locked
          toast({
            title: 'Error',
            description: 'User Inactive. Please contact admin.',
            variant: 'default',
          });
        } else if (status === 405) {
          // User is locked due to too many login attempts
          toast({
            title: 'Error',
            description: 'Account is locked due to multiple unsuccessful login attempts. Please try again later.',
            variant: 'default',
          });
        } else if (status === 429) {
          // Rate limit exceeded
          toast({
            title: 'Error',
            description: 'Too many login attempts. Please try again later.',
            variant: 'destructive',
          });
        } else {
          // Other errors (e.g., unexpected errors or 500 status)
          toast({
            title: 'Error',
            description: 'Unexpected error: ' + (data.detail?.message || 'An error occurred.'),
            variant: 'destructive',
          });
        }
      } else {
        // Handle network or unknown errors
        toast({
          title: 'Error',
          description: 'An error occurred: ' + (error.message || 'Unknown error.'),
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-4">
        <Image
          src="/images/Desismart_Logo.png" // Adjust this path based on your image location
          alt="DesisMart Logo"
          width={150} // Set desired width
          height={50} // Set desired height
          quality={100} // Optional: Set image quality
        />
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="mail@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgotpassword" className="ml-auto text-right">Forgot Password?</Link>
              </div>
              <Input id="password" 
              type="password" 
              value={password}
              onChange={handlePasswordChange}
              required />
            </div>
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </div>
           
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage