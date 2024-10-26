import { Home, LineChart, Package, ScanBarcode, SquareStack, User2Icon } from "lucide-react";
import { Badge } from "./ui/badge";


const NavbarItems = [
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
];

export default NavbarItems;
