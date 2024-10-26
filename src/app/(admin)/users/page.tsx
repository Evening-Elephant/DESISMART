"use client";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User2Icon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from '@/lib/axiosInstance';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [endusers, setEndUsers] = useState([]);
  const [adminusers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEndUsers = async () => {
      try {
        const response = await axiosInstance.get('/apiv1/all-users-profile-details/');
        const data = response.data;
        const users = [
          ...data.verified_users.map(user => ({ ...user, verified: true })),
          ...data.non_verified_users.map(user => ({ ...user, verified: false }))
        ];
        setEndUsers(users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching end users:', error);
        setLoading(false);
      }
    };

    const fetchAdminUsers = async () => {
      try {
        const response = await axiosInstance.get('/apiv1/get-all-admin-users/');
        const data = response.data;
        const users = [
          ...data.password_changed_users.map(user => ({ ...user, password_changed_users: true })),
          ...data.password_not_changed_users.map(user => ({ ...user, password_not_changed_users: false }))
        ];
        setAdminUsers(users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin users:', error);
        setLoading(false);
      }
    };

    fetchEndUsers();
    fetchAdminUsers();
  }, []);



  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/apiv1/update-user-status/${userId}`, {
        status: newStatus,
      
      });

      if (response.status === 200) {
        
      setEndUsers(prevEndUsers => 
        prevEndUsers.map(user =>
          user.user_login_id === userId
            ? { ...user, status: newStatus }
            : user
        )
      );

      setAdminUsers(prevAdminUsers => 
        prevAdminUsers.map(user =>
          user.user_login_id === userId
            ? { ...user, status: newStatus }
            : user
        )
      );
    }
      

      
      else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };
  

  const filteredEndUsers = endusers.filter(user =>
    user.user_firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdminUsers = adminusers.filter(user =>
    user.user_fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usersPerPage = 20;
  const totalPagesEndUsers = Math.ceil(filteredEndUsers.length / usersPerPage);
  const paginatedEndUsers = filteredEndUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const totalPagesAdminUsers = Math.ceil(filteredAdminUsers.length / usersPerPage);
  const paginatedAdminUsers = filteredAdminUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <div className="ml-auto flex items-center gap-2">
        <Link href="/users/adduser">
          <Button size="sm" className="h-7 gap-1">
            <User2Icon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add User</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="admin" className="w-full">
        <TabsList>
          <TabsTrigger value="admin">Admin Users</TabsTrigger>
          <TabsTrigger value="end">End Users</TabsTrigger>
        </TabsList>

        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>List of registered admin users.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Search by first name, last name, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile Image</TableHead>
                    <TableHead> Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Password Changed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAdminUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <img src={user.user_profile_img || "/default-profile.png"} className="h-10 w-10 rounded-full" />
                      </TableCell>
                      <TableCell>{user.user_fullname}</TableCell>
                      <TableCell>{user.user_email}</TableCell>
                      <TableCell>{user.user_role}</TableCell>
                      <TableCell>{user.user_address ? JSON.stringify(user.user_address) : "N/A"}</TableCell>
                      <TableCell>
                      <Button  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
                        onClick={() => handleStatusUpdate(user.user_login_id, user.status ? '0' : '1')} 
                        size="sm"
                      >
                        {user.status ? "Draft" : "Active"}
                      </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.password_changed_users ? "secondary" : "outline"}>
                          {user.password_changed_users ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPagesAdminUsers}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="end">
          <Card>
            <CardHeader>
              <CardTitle>End Users</CardTitle>
              <CardDescription>List of registered end users.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Search by first name, last name, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile Image</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEndUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <img src={user.user_profile_img || "/default-profile.png"} className="h-10 w-10 rounded-full" />
                      </TableCell>
                      <TableCell>{user.user_firstname}</TableCell>
                      <TableCell>{user.user_lastname}</TableCell>
                      <TableCell>{user.user_email}</TableCell>
                      <TableCell>{user.user_role}</TableCell>
                      <TableCell>{user.user_address ? JSON.stringify(user.user_address) : "N/A"}</TableCell>
                      <TableCell>
                      <Button  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
                        onClick={() => handleStatusUpdate(user.user_login_id, user.status ? '0' : '1')} 
                        size="sm"
                      >
                        {user.status ? "Draft" : "Active"}
                      </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.verified ? "secondary" : "outline"}>
                          {user.verified ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPagesEndUsers}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Users;
