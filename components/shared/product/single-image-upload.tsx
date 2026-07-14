"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader, Upload, X } from "lucide-react";
import Image from "next/image";

interface SingleImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function SingleImageUpload({
  value,
  onChange,
  label = "Upload Image",
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large (max 5MB)");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Extract public ID from Cloudinary URL
      if (value.includes("cloudinary.com")) {
        const urlParts = value.split("/");
        const fileWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileWithExtension.split(".")[0];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${fileName}`;

        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }

      onChange("");
      toast.success("Image removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-[3/1] rounded-lg border overflow-hidden group max-w-2xl">
          <Image
            src={value}
            alt="Banner"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() =>
              document.getElementById("single-image-upload")?.click()
            }
          >
            {uploading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {label}
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Upload a banner image (max 5MB)
          </p>
        </>
      )}

      <Input
        id="single-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={uploading}
      />
    </div>
  );
}
