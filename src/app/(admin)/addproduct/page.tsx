"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, PlusCircle, Upload } from 'lucide-react'
import Image from "next/image"
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/components/ui/use-toast";

function AddProduct() {
  const router = useRouter()

  const initialProductState = {
    title: "",
    description: "",
    shortdescription: "",
    status: "Active",
    stock: 0,
    price: "",
    actualprice: "",
    prod_cat_id: "",
    prod_sub_cat_id: "",
    skuid: "",
    linkedproductid: "",
    images: [] // Store image files here
  }

  const [product, setProduct] = useState(initialProductState);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [products, setProducts] = useState([]);
  const { toast } = useToast();
  

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`/apiv1/get-categories/`);
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/apiv1/get-all-products/`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setProduct((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setProduct((prev) => ({ ...prev, prod_cat_id: categoryId, prod_sub_cat_id: "" }));
    const selectedCategory = categories.find(category => category.category_id === categoryId);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  };

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files selected:", files); // Debugging log
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5), // Limit to 5 images
    }));
  };
  
  useEffect(() => {
    const newImagePreviews = product.images.map((image) => URL.createObjectURL(image));
    setImagePreviews(newImagePreviews);
  
    console.log("Image previews updated:", newImagePreviews); // Debugging log
  
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [product.images]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Images before submission:", product.images); // Debugging log
    console.log("Product details:", product); // Debugging log
  
    try {
      // Step 1: Create Product
      const response = await axiosInstance.post(`/apiv1/create-product/`, {
        prod_cat_id: product.prod_cat_id,
        prod_sub_cat_id: product.prod_sub_cat_id,
        title: product.title,
        description: product.description,
        shortdescription: product.shortdescription,
        actualprice: product.actualprice,
        sellingprice: product.price,
        skuid: product.skuid,
        stockquantity: String(product.stock),
        status: product.status === "Active",
        linkedproductid: product.linkedproductid,
      });
  
      // Correctly access production_id from the nested structure
      const production_id = response.data.product.production_id;
      console.log('Product created with production_id:', production_id); // Debug log
  
      // Step 2: Upload Images only if production_id exists and images are available
      if (production_id && product.images.length > 0) {
        console.log('Uploading images for product ID:', production_id);
  
        const formData = new FormData();
        product.images.forEach((image, index) => {
          formData.append(`file${index + 1}`, image);
        });
  
        await axiosInstance.post(`/apiv1/upload-product-images/?product_id=${production_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        console.log('Images uploaded successfully');
      } else {
        console.log('No images to upload or product ID missing');
      }
  
      toast({
        title: 'Success',
        description: `Product and images created successfully`,
        variant: 'default',
      });
  
      router.push("/products");
    } catch (error) {
      console.error('Error in product creation or image upload:', error);
      toast({
        title: 'Error',
        description: `Failed to create product or upload images`,
        variant: 'destructive',
      });
    }
  };
  
  

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Product
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            {product.status || "Unknown"}
          </Badge>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          {/* Main product information */}
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>{product.description || "Provide a description for the product."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Name</Label>
                    <Input id="title" type="text" className="w-full" value={product.title} onChange={handleChange} placeholder="Enter product name" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={product.description} onChange={handleChange} className="min-h-32" placeholder="Enter product description" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="shortdescription">Short Description</Label>
                    <Textarea id="shortdescription" value={product.shortdescription} onChange={handleChange} className="min-h-25" placeholder="Enter short description" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Table */}
            <Card>
              <CardHeader>
                <CardTitle>Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actual Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                      <Input id="skuid" type="text" value={product.skuid} onChange={handleChange} placeholder="Enter SKU ID" />
                      </TableCell>
                      <TableCell>
                        <Input id="stock" type="number" value={product.stock} onChange={handleChange} placeholder="Enter stock quantity" />
                      </TableCell>
                      <TableCell>
                        <Input id="price" type="text" value={product.price} onChange={handleChange} placeholder="Enter selling price" />
                      </TableCell>
                      <TableCell>
                        <Input id="actualprice" type="text" value={product.actualprice} onChange={handleChange} placeholder="Enter actual price" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Product Category */}
            

           <Card>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="prod_cat_id">Category</Label>
                    <Select id="prod_cat_id" value={product.prod_cat_id} onValueChange={handleCategoryChange}>
                      <SelectTrigger aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.category_id} value={category.category_id}>
                            {category.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="prod_sub_cat_id">Subcategory</Label>
                    <Select id="prod_sub_cat_id" value={product.prod_sub_cat_id} onValueChange={(value) => setProduct(prev => ({ ...prev, prod_sub_cat_id: value }))}>
                      <SelectTrigger aria-label="Select subcategory">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map(subcategory => (
                          <SelectItem key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                            {subcategory.subcategory_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar for Product Images */}
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" value={product.status?.toLowerCase() || "draft"} onValueChange={(value) => setProduct(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Active</SelectItem>
                        <SelectItem value="1">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {/* Main Image Preview */}
                  <Image
                    alt="Product image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src={imagePreviews[0] || "/images/placeholder.svg"}
                    width="300"
                  />

                  {/* Additional Image Previews */}
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.slice(0, 5).map((imgSrc, index) => (
                      <Image
                        key={index}
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src={imgSrc}
                        width="84"
                      />
                    ))}

                    {/* File Input for Image Selection */}
                    {product.images.length < 5 && (
                      <label className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed cursor-pointer">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelection}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
              <CardTitle>Linked Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Label htmlFor="linked_product">Linked Product</Label>
                <Select id="linked_product" value={product.linkedproductid || ""} onValueChange={(value) => setProduct(prev => ({ ...prev, linkedproductid: value }))}>
                  <SelectTrigger aria-label="Select linked product">
                    <SelectValue placeholder="Select linked product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.production_id} value={product.production_id}>
                        {product.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>


            
          </div>
        </form>

        {/* Submit Buttons */}
        <div className="flex justify-end mt-4 space-x-4">
          <Button type="submit" form="product-form" variant="primary">Add Product</Button>
          <Button type="button" onClick={() => console.log('Draft saved:', product)} variant="secondary">Save as Draft</Button>
        </div>
      </div>
    </main>
  )
}

export default AddProduct
