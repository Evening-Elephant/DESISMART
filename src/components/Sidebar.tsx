"use client";
import React from 'react';
import Link from "next/link";
import {

  Package2,
} from "lucide-react";

import { usePathname } from 'next/navigation';
import NavbarItems from "@/components/NavbarItems";


function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="hidden border-r bg-muted/10 md:block w-60">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">DesisMart</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="flex flex-col items-start px-4 text-sm font-medium space-y-2">
            {NavbarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary w-full ${
                  pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span> {/* Hide text on smaller screens */}
                {item.badge} {/* Render badge if it exists */}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
