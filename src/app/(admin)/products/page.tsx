"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, PlusCircle, UploadIcon } from 'lucide-react'
import Image from "next/image"
import { Badge } from '@/components/ui/badge'
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axiosInstance";

function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([]); // State to hold product data
  const [loading, setLoading] = useState(true) // Loading state
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast(); 

  useEffect(() => {
    // Fetch product data from the backend
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/apiv1/get-all-products/`);
        const data = await response.data;


        if (Array.isArray(data)) {
          setProducts(data); // Ensure data is an array
        } else {
          console.error('Unexpected response format:', data);
          setProducts([]); // Fallback to empty array
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts()
  }, [])


  // Function to handle status update
  const handleStatusUpdate = async (productId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/update-product-status/${productId}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        // Show toast message on success
        toast({
          title: "Success",
          description: `Product status updated to ${newStatus}`,
        });

        // Update the product status locally
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.production_id === productId
              ? { ...product, pstatus: newStatus }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive",
      });
    }
  };

  // Filter products based on search query
  const filteredProducts = Array.isArray(products)
  ? products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const response =await axiosInstance.post(`/apiv1/upload-products/`,formData)

      if (response.status === 200) {
        alert("Products uploaded successfully.");
        const data = response.data;
        setProducts(data); // Optionally refresh product data after upload
      } else {
        const errorData = response.data;
        alert(`Error uploading products: ${errorData.detail.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <div className="ml-auto flex items-center gap-2">
       <Link href="/uploadproducts">
          <Button size="sm" className="h-7 gap-1">
            <UploadIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Upload</span>
          </Button>
        </Link>
        <Link href="/addproduct">
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex justify-between min-h-[60px]">
          <div className="ml-4 w-64">
            <Input
              placeholder="Search by product name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Total Sales</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.production_id}>
                  <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src={(Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/images/placeholder.svg")}
                    width="300"
                  />

                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell className="font-medium">{product.prod_sub_name}</TableCell>
                  <TableCell>
                  <Badge
                      variant="outline"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
                      onClick={() => handleStatusUpdate(product.production_id, product.pstatus ? '0' : '1')}
                    >
                      {product.pstatus ? 'Draft' : 'Active'}
                    </Badge>

                  </TableCell>


                  <TableCell>{product.sellingprice}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.stockquantity}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(product.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/products/${product.production_id}/productdetails?category=${product.product_name}&subcategory=${product.prod_sub_name}`} passHref>
                            <Button variant="link" className="text-blue-500 hover:underline">
                              Edit
                            </Button>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredProducts.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

export default Products
