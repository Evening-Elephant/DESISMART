// import Header from "@/components/Header";
// // import Sidebar from "@/components/Sidebar";
// import React, { ReactNode } from 'react';

// interface LayoutProps {
//   children: ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex flex-1">
//         {/* <Sidebar /> */}
//         <div className="flex flex-col flex-1">
//           <Header />
//           <main>{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }


import { AppSidebar } from '@/components/app-sidebar';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React, { ReactNode } from 'react';


interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 h-full flex flex-col">
        <div className="flex items-center p-4">
          <SidebarTrigger />
          <DynamicBreadcrumb />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}