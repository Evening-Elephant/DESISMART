"use client";

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';

const AddUser = () => {
  const [formData, setFormData] = useState({
    user_fullname: '',
    user_email: '',
    user_role: '',
  });
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/apiv1/get-active-roles/");
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle role selection change
  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      user_role: value, // Set the selected role in the form data
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/apiv1/add-user/`, formData);
      setMessage(response.data.message);
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('An error occurred while creating the user.');
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto my-20 p-6 bg-white shadow-lg rounded-lg">
     <CardHeader>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
    <CardTitle>Add User</CardTitle>
  </div>
</CardHeader>
<CardContent>
  <div className="grid gap-3">
      
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
         
           <Label htmlFor="title">Full Name</Label>
           <Input  type="text"
            id="user_fullname"
            name="user_fullname"
            value={formData.user_fullname}
            onChange={handleChange}
            required/>
        </div>
        <div>
          <Label htmlFor="user_email">Email:</Label>
          <Input
            type="email"
            id="user_email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="user_role">Role</Label>
          <Select id="user_role" value={formData.user_role} onValueChange={handleRoleChange}>
            <SelectTrigger aria-label="Select role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          <Button type="submit">Add User</Button>
        </div>
      </form>
    </div>
    </CardContent>
    </Card>
  );
};

export default AddUser;
