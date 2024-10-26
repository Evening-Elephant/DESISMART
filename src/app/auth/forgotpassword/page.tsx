// if user clicks on validate mail then api will check email and DB and if its validated it will be redirected to reset
// password page else we get error saying the not valid. 

import React from 'react'
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

function ForgotPasswordPage() {
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
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
          Enter your email to receive reset password link 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            
          <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                required
              />
            </div>
           
            <Button type="submit" className="w-full">
              Validate Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage