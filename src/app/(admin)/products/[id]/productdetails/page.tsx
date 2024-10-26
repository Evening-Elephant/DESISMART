"use client"

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, Upload } from 'lucide-react'
import Image from "next/image"
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axiosInstance from "@/lib/axiosInstance";


function ProductDetails() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')
  
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/apiv1/get-productdetails-by-id/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.error("Error fetching product details:", error)
      }
    }

    fetchProductDetails()
  }, [id])

  const handleChange = (e) => {
    const { id, value } = e.target
    setProduct((prev) => ({ ...prev, [id]: value }))
  }

  const handleStatusChange = (status) => {
    setProduct((prev) => ({ ...prev, pstatus: status }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`/apiv1/update-product/${id}`, product)
      router.push("/products")
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  if (!product) return <div>Loading...</div>

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-xl font-semibold">{product.title || "Unknown Product"}</h1>
          
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          {/* Main product information */}
          <div className="grid gap-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>{product.description || "No description available."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Label htmlFor="title">Name</Label>
                  <Input id="title" type="text" value={product.title} onChange={handleChange} />

                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={product.description} onChange={handleChange} />

                  <Label htmlFor="stockquantity">Stock</Label>
                  <Input id="stockquantity" type="number" value={product.stockquantity} onChange={handleChange} />

                  <Label htmlFor="sellingprice">Price</Label>
                  <Input id="sellingprice" type="text" value={product.sellingprice} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input id="category" type="text" value={category} readOnly />
                  <Input id="subcategory" type="text" value={subcategory} readOnly />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar for Product Images and Status */}
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={product.pstatus ? "active" : "draft"} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src={product.images?.[0] || "/images/placeholder.svg"}
                  width="300"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {product.images?.slice(1).map((img, idx) => (
                    <Image
                      key={idx}
                      alt={`Product image ${idx + 1}`}
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src={img}
                      width="84"
                    />
                  ))}
                  <button className="flex items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        <div className="flex justify-end mt-4 space-x-4">
          <Button type="submit" onClick={handleSubmit} variant="primary">Save</Button>
          <Button variant="secondary" onClick={() => handleStatusChange("draft")}>Save as Draft</Button>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails
