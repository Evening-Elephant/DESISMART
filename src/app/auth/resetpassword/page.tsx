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

function ResetPasswwordPage() {
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
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
          Enter your password and confirm password to reset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Confirm Password</Label>
              </div>
              <Input id="confirmpassword" type="confirmpassword" required />
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswwordPage