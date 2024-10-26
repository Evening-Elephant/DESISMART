"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Bell,
  MailCheck,
  Users,
  Handshake,
  Hand,
  BookDown,
  Clock,
  CalendarClock,
  SquareCheckBig,
  NotebookIcon,
  CalendarDaysIcon,
  FileVideo,
  CalendarCog,
  User2Icon,
  Badge,
  Package,
  SquareStack,
} from "lucide-react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

import axiosInstance from "@/lib/axiosInstance";
import { useAuthContext } from "@/lib/AuthProvider";




// HRMS Navbar Items
const NavsidebarbarItems = () => {
  return [
    {
      sectionLabel: "GENERAL",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <Home className="h-4 w-4" />
        },
        {
          label: "Category",
          href: "/category",
          icon: <SquareStack className="h-4 w-4" />
        },
        {
          label: "Products",
          href: "/products",
          icon: <Package className="h-4 w-4" />
        },
        {
          label: "Orders",
          href: "/orders",
          icon: <Package className="h-4 w-4" />,
          badge: <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
        },
        
        {
          label: "Users",
          href: "/users",
          icon: <User2Icon className="h-4 w-4" />
        },
      ],
    },
    // {
    //   sectionLabel: "COMPANY",
    //   items: [
    //     { label: "People", href: "/people", icon: <Users className="h-4 w-4" /> },
    //     { label: "On Boarding", href: "/onboarding", icon: <Handshake className="h-4 w-4" /> },
    //     { label: "Off Boarding", href: "/offboarding", icon: <Hand className="h-4 w-4" /> },
    //     { label: "Policies", href: "/policies", icon: <BookDown className="h-4 w-4" /> },
    //   ],
    // },
    // {
    //   sectionLabel: "EMPLOYEE",
    //   items: [
    //     { label: "Time", href: "/time", icon: <Clock className="h-4 w-4" /> },
    //     { label: "Attendance", href: "/attendance", icon: <CalendarClock className="h-4 w-4" /> },
    //     { label: "Tasks", href: "#", icon: <SquareCheckBig className="h-4 w-4" /> },
    //     { label: "Documents", href: "#", icon: <NotebookIcon className="h-4 w-4" /> },
    //     { label: "Calendar", href: "/calendar", icon: <CalendarDaysIcon className="h-4 w-4" /> },
    //   ],
    // },
    // {
    //   sectionLabel: "STUDIO",
    //   items: [
    //     { label: "Production", href: "/production", icon: <FileVideo className="h-4 w-4" /> },
    //     { label: "Time Sheet", href: "#", icon: <CalendarCog className="h-4 w-4" /> },
    //     { label: "Team Schedule", href: "#", icon: <CalendarClock className="h-4 w-4" /> },
    //   ],
    // },
  ];
};

export function AppSidebar() {
  
  const pathname = usePathname();
  const navbarItems = NavsidebarbarItems();
  const [employees, setEmployees] = useState([]);


  
  const { id } = useAuthContext();
  //console.log("User ID being used:", userId);


  useEffect(() => {
   
     
    const fetchUserDetails = async () =>{
      try {
        const response = await axiosInstance.get(`/apiv1/get-user-data/${id}`);
        setEmployees(response.data);  // Store employee data
      } catch (error: any) {
        console.error("Error fetching employees:", error.response ? error.response.data : error.message);
      }
    };



    fetchUserDetails();
 

  }, []);
 
 



  return (
    <Sidebar>
        <h1 className="text-center font-bold mt-2 text-2xl">DESIS MART</h1>
      <SidebarContent>
       

       
        {navbarItems.map((section) => (
          <SidebarGroup key={section.sectionLabel}>
            <SidebarGroupLabel>{section.sectionLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className={`flex items-center gap-3 rounded-lg p-2 text-muted-foreground transition-all hover:text-primary ${pathname === item.href ? "bg-muted text-primary" : ""}`}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
      <NavUser user={{
        name: employees?.user_name || "User",
        email: employees?.user_email || "email@example.com",
        avatar: "" // add avatar logic if needed
      }} />

      </SidebarFooter>
    </Sidebar>
  );
}
