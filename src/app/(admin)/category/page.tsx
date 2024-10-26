"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axiosInstance";

function Category() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [parentOptions, setParentOptions] = useState([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();


  // Fetch categories for parent category options
  useEffect(() => {
    const fetchCategories = async () => {
      try {
         const response = await axiosInstance.get("/apiv1/get-categories/");
        if (response.data?.data) {
          const categoriesWithSubcategories = response.data.data.map(category => ({
            ...category,
            subcategories: category.subcategories || [] // Ensure subcategories is an array
          }));
          setParentOptions(categoriesWithSubcategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file (first one only)
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a URL for image preview
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleAddCategory = async () => {
    if (!category || !status) {
      alert("Please fill all fields");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", category);
    formData.append("parent", subcategory);
    formData.append("status", status);
    if(!subcategory && description) {
      formData.append("description", description);
    }
    if (!subcategory && selectedImage) {
      formData.append("file", selectedImage);
    }
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/apiv1/create-product-categories/",
        formData
      );
      console.log("Category created successfully", response.data);
      toast({
        title: 'Success',
        description: `Category created successfully`,
        variant: 'default',
      });
      
      // Assuming response.data contains the newly created category object
      setParentOptions((prev) => [...prev, response.data]); // Update the state to include the new category
  
      // Clear form or give feedback as needed
      setCategory("");
      setSubcategory("");
      setStatus("");
      setDescription("");
      setSelectedImage(null);
      setPreviewImage(null);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to  create category`,
        variant: 'destructive',
      });
    }
  };
  


  // API call to update status
  const handleStatusUpdate = async (prodcat_id, currentStatus) => {
    try {
     
      const response = await axiosInstance.put(
        `/update-product-cat-status/${prodcat_id}`, {
          status: currentStatus,
        });
  
      toast({
        title: 'Success',
        description: `Status updated successfully`,
        variant: 'default',
      });
  
      // Optionally, update the category status in local state after success
      setParentOptions((prevOptions) =>
        prevOptions.map((category) =>
          category.prodcat_id === prodcat_id
            ? { ...category, prod_status: currentStatus }
            : category
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.response?.data?.detail?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };
  

  

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <h2 className="text-xl font-semibold mb-4">Add Category</h2>
      <div className="flex">
        <div className="grid grid-cols-4 gap-4 w-full">
          {/* First Card (1/4 width) */}
          <div className="col-span-1 p-4 border rounded-lg shadow-md">
            <div className="mb-4">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="parent">Parent</Label>
              <Select onValueChange={(value) => setSubcategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((parent) => (
                    <SelectItem
                      key={parent.category_id}
                      value={parent.category_name}
                    >
                      {parent.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!subcategory && (
            <div className="mb-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter description"
                value={description} // Fix: bind to description state
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            )}

            {/* Conditionally render the image field based on whether a parent category is selected */}
            {!subcategory && (
              <div className="mb-4">
                <Label htmlFor="image-upload">Image</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input" // Consistent styling
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Selected preview"
                      className="w-30 h-32 object-cover rounded-md shadow-md" // Add styles to improve the preview image
                    />
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Active</SelectItem>
                  <SelectItem value="1">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="button" className="w-full" onClick={handleAddCategory}>
              Add
            </Button>
          </div>

          {/* Second Card (3/4 width) */}
          <div className="col-span-3 p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Categories Table</h2>
            <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">S.No</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Parent Category</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
  {parentOptions.map((category, categoryIndex) => (
    <React.Fragment key={category.prodcat_id}>
      <tr>
        <td className="border px-4 py-2">{categoryIndex + 1}</td>
        <td className="border px-4 py-2">{category.category_name}</td> {/* Check this field */}
        <td className="border px-4 py-2">{category.description}</td> {/* Check this field */}
        <td className="border px-4 py-2">{category.parent ? category.parent : 'N/A'}</td>
        <td className="border px-4 py-2">
          {category.imgthumbnail ? (
            <img src={category.imgthumbnail} className="h-12 w-12" />
          ) : (
            'No Image'
          )}
        </td>
        

        <td className="border px-4 py-2">
  <Button
    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
    onClick={() => handleStatusUpdate(category.category_id, category.prod_status ? '0' : '1')}
  >
    {category.prod_status ? "Draft" : "Active"}
  </Button>
</td>



      </tr>
      {(category.subcategories || []).map((subcategory, subcategoryIndex) => (
        <tr key={subcategory.product_sub_id}>
          <td className="border px-4 py-2">{`${categoryIndex + 1}.${subcategoryIndex + 1}`}</td>
          <td className="border px-4 py-2">{subcategory.subcategory_name}</td>
          <td className="border px-4 py-2">N/A</td>
          <td className="border px-4 py-2">{category.category_name}</td>
          <td className="border px-4 py-2">N/A</td>
          

                    <td className="border px-4 py-2">
  <button
    className={`px-4 py-2 rounded-md text-black ${
      subcategory.psub_status ? 'bg-blue-100' : 'bg-blue-100'
    }`}
  >
    {subcategory.psub_status ? "Draft" : "Active"}
  </button>
</td>

          
        </tr>
      ))}
    </React.Fragment>
  ))}
</tbody>

            
          </table>

           
          </div>
        </div>
      </div>
    </main>
  );
}

export default Category;
