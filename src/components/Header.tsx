// "use client";
// import React from 'react';
// import Link from "next/link";
// import {
//   CircleUser,
//   Menu,
//   Package2,
//   Search,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { usePathname } from 'next/navigation';
// import NavbarItems from "@/components/NavbarItems";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import dynamic from 'next/dynamic';

// type Member = {
//   email: string;
//   name: string;
//   backgroundColor: string;
//   designation: string;
// };

// const UserItem = dynamic(() => import('@/components/UserItem'), { ssr: false });
// function Header() {
//   const pathname = usePathname();

//   return (
//     // <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
//     //   <Sheet>
//     //     <SheetTrigger asChild>
//     //       <Button variant="outline" size="icon" className="shrink-0 md:hidden">
//     //         <Menu className="h-5 w-5" />
//     //         <span className="sr-only">Toggle navigation menu</span>
//     //       </Button>
//     //     </SheetTrigger>
//     //     <SheetContent side="left" className="flex flex-col bg-white text-black p-4"> {/* Added bg and text color */}
//     //       <nav className="flex flex-col items-start text-sm font-medium space-y-2">
//     //         {NavbarItems.map((item) => (
//     //           <Link
//     //             key={item.label}
//     //             href={item.href}
//     //             className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary w-full ${
//     //               pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
//     //             }`}
//     //           >
//     //             {item.icon}
//     //             <span className="block">{item.label}</span> {/* Always show text in the sheet */}
//     //             {item.badge} {/* Render badge if it exists */}
//     //           </Link>
//     //         ))}
//     //       </nav>
//     //     </SheetContent>
//     //   </Sheet>
//     //   <div className="flex-1">
//     //     <form>
//     //       <div className="relative">
//     //         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//     //         <Input
//     //           type="search"
//     //           placeholder="Search products..."
//     //           className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
//     //         />
//     //       </div>
//     //     </form>
//     //   </div>
//     //   <DropdownMenu>
//     //     <DropdownMenuTrigger asChild>
//     //       <Button variant="secondary" size="icon" className="rounded-full">
//     //         <CircleUser className="h-5 w-5" />
//     //         <span className="sr-only">Toggle user menu</span>
//     //       </Button>
//     //     </DropdownMenuTrigger>
//     //     <DropdownMenuContent align="end">
//     //       <DropdownMenuLabel>My Account</DropdownMenuLabel>
//     //       <DropdownMenuSeparator />
//     //       <DropdownMenuItem>Settings</DropdownMenuItem>
//     //       <DropdownMenuItem>Support</DropdownMenuItem>
//     //       <DropdownMenuSeparator />
//     //       <DropdownMenuItem>Logout</DropdownMenuItem>
//     //     </DropdownMenuContent>
//     //   </DropdownMenu>
//     // </header>

//     <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
    
//           <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//           <div className="relative flex-shrink-0">
//         <div  className="cursor-pointer">
//           <UserItem
//             backgroundColor="#008080"
//             title="Pavan"
//             description="Designer"
//             shadow={false}
//             border={false}
//           />
//         </div>

       
//       </div>
//               <Select>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="Themeasdasdasdasdas" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="light">Logout</SelectItem>
       
//       </SelectContent>
//     </Select>
//             {NavbarItems.map((item) => (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary w-full ${
//                   pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
//                 }`}
//               >
//                 {item.icon}
//                 <span className="block">{item.label}</span> {/* Always show text in the sheet */}
//                 {item.badge} {/* Render badge if it exists */}
//               </Link>
//             ))}
//           </nav>
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           className="shrink-0 md:hidden"
//         >
//           <Menu className="h-5 w-5" />
//           <span className="sr-only">Toggle navigation menu</span>
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left">
//         <nav className="grid gap-6 text-lg font-medium">
//         {NavbarItems.map((item) => (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary w-full ${
//                   pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
//                 }`}
//               >
//                 {item.icon}
//                 <span className="block">{item.label}</span> {/* Always show text in the sheet */}
//                 {item.badge} {/* Render badge if it exists */}
//               </Link>
//             ))}
//         </nav>
//       </SheetContent>
//     </Sheet>
//     <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
//       <form className="ml-auto flex-1 sm:flex-initial">
//         <div className="relative">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search products..."
//             className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
//           />
//         </div>
//       </form>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="secondary" size="icon" className="rounded-full">
//             <CircleUser className="h-5 w-5" />
//             <span className="sr-only">Toggle user menu</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>My Account</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem>Settings</DropdownMenuItem>
//           <DropdownMenuItem>Support</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem>Logout</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   </header>
//   );
// }

// export default Header;



"use client";
import React from 'react';
import Link from "next/link";
import {
  CircleUser,
  Menu,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from 'next/navigation';
import NavbarItems from "@/components/NavbarItems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-4 text-lg font-medium md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-4">
        <Select>
          <SelectTrigger className="flex items-center w-[180px] gap-2">
            admin name
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Logout</SelectItem>
          </SelectContent>
        </Select>

        {NavbarItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary w-full ${
              pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
            }`}
          >
            {item.icon}
            <span className="block">{item.label}</span>
            {item.badge}
          </Link>
        ))}
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-4 text-lg font-medium">
            {NavbarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary w-full ${
                  pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                <span className="block">{item.label}</span>
                {item.badge}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
