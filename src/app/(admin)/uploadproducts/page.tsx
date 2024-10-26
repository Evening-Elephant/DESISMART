"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation"; // Import useRouter

const UploadProducts = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length) {
      handleFiles(droppedFiles);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length) {
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (selectedFiles) => {
    const isValid = Array.from(selectedFiles).every(file => file.type === "text/csv" || file.name.endsWith(".csv"));
    if (!isValid) {
      alert("Please upload only CSV files.");
      return;
    }

    setFiles(selectedFiles);
    setUploadSuccess(false);
    setUploadError("");
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("file", file); // Assuming your API expects a single file under the key "file"
    });

    setIsUploading(true);
    setProgress(0);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:8000/apiv1/upload-products/", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadSuccess(true);
          setIsUploading(false);

          toast({
            title: "Success",
            description: `Products created successfully`,
            variant: "default",
          });

          router.push("/products");

        } else {
          setUploadError(`Upload failed: ${xhr.statusText}`);
          setIsUploading(false);

          toast({
            title: "Error",
            description: `Failed to create products`,
            variant: "destructive",
          });
        }
      };

      xhr.onerror = () => {
        setUploadError("An error occurred during file upload.");
        setIsUploading(false);
        toast({
          title: "Error",
          description: "An error occurred during file upload",
          variant: "destructive",
        });
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("An unexpected error occurred.");
      setIsUploading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen justify-center mt-10">
      <div className="grid w-full max-w-md">
        <div
          id="upload"
          className="flex flex-col items-center justify-center h-48 border border-dashed border-gray-400 rounded-lg cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
        >
          <p className="text-gray-500">Drop files to upload</p>
          <p className="text-gray-500">or</p>
          <Button variant="outline">Select Files</Button>
          <Input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>

        {/* Show Progress and Feedback */}
        {isUploading && (
          <div className="mt-4">
            <Progress value={progress} />
            <p>{progress.toFixed(0)}% uploaded</p>
          </div>
        )}

      

        {/* Upload Button */}
        <Button
          onClick={handleFileUpload}
          disabled={isUploading || files.length === 0}
          className="mt-4"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default UploadProducts;
