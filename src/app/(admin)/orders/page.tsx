"use client"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Truck, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Separator } from '@radix-ui/react-select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  const orders = [
    { id: "1", customer: "Liam Johnson", email: "liam@example.com", type: "Sale", status: "Fulfilled", date: "2023-06-23", amount: "$250.00" },
    { id: "2", customer: "Olivia Smith", email: "olivia@example.com", type: "Refund", status: "Declined", date: "2023-06-24", amount: "$150.00" },
    { id: "3", customer: "Noah Williams", email: "noah@example.com", type: "Subscription", status: "Fulfilled", date: "2023-06-25", amount: "$350.00" },
    { id: "4", customer: "Emma Brown", email: "emma@example.com", type: "Sale", status: "Fulfilled", date: "2023-06-26", amount: "$450.00" },
    // Add more orders as needed...
  ];

  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.date.includes(searchTerm)
  );

  const ordersPerPage = 2; // Change this to control how many orders are shown per page
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setStatus(order.status); // Set the status to the selected order's current status
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the updated status
    console.log('Updated Order Status:', status);
    setSelectedOrder(null); // Close receipt after saving
  };

  const closeReceipt = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="flex gap-6 mx-4 my-4">
      <div className="flex-1">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Recent orders from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search by customer name or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map(order => (
                  <TableRow key={order.id} onClick={() => handleOrderClick(order)} className="cursor-pointer hover:bg-accent">
                    <TableCell>
                      <div className="font-medium">{order.customer}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{order.type}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant={order.status === "Fulfilled" ? "secondary" : "outline"}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>

      <div className="w-1/3">
        {selectedOrder && (
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Order {selectedOrder.id}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>Date: {selectedOrder.date}</CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Order Status</SelectLabel>
                      <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button variant="default" onClick={handleSubmit}>Save</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <form onSubmit={handleSubmit} className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Glimmer Lamps x <span>2</span></span>
                    <span>$250.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Aqua Filters x <span>1</span></span>
                    <span>$49.00</span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>$299.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$5.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$25.00</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>$329.00</span>
                  </li>
                </ul>
              </form>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Shipping Information</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>{selectedOrder.customer}</span>
                    <span>1234 Main St.</span>
                    <span>Anytown, CA 12345</span>
                  </address>
                </div>
                <div className="grid auto-rows-max gap-3">
                  <div className="font-semibold">Billing Information</div>
                  <div className="text-muted-foreground">Same as shipping address</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Customer Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Customer</dt>
                    <dd>{selectedOrder.customer}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd><a href={`mailto:${selectedOrder.email}`}>{selectedOrder.email}</a></dd>
                  </div>
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Visa
                    </dt>
                    <dd>**** **** **** 4532</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated <time dateTime="2023-11-23">November 23, 2023</time>
              </div>
              <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6" onClick={closeReceipt}>
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Previous Order</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Next Order</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Orders;
