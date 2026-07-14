"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader, Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed max
    if (value.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 5MB)`);
        }

        setUploadingIndex(value.length + index);

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

        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);
      toast.success(
        `${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded successfully`
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload images"
      );
    } finally {
      setUploading(false);
      setUploadingIndex(null);
      // Reset input
      event.target.value = "";
    }
  };

  const handleRemove = async (index: number, url: string) => {
    try {
      // Extract public ID from Cloudinary URL
      const urlParts = url.split("/");
      const fileWithExtension = urlParts[urlParts.length - 1];
      const fileName = fileWithExtension.split(".")[0];
      const folder = urlParts[urlParts.length - 2];
      const publicId = `${folder}/${fileName}`;

      // Delete from Cloudinary (only if it's a Cloudinary URL)
      if (url.includes("cloudinary.com")) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }

      // Remove from local state
      const newUrls = value.filter((_, i) => i !== index);
      onChange(newUrls);
      toast.success("Image removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={uploading || value.length >= maxImages}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {uploading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          {value.length} / {maxImages} images
        </span>
      </div>

      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileUpload}
        disabled={uploading || value.length >= maxImages}
      />

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg border overflow-hidden group"
            >
              {uploadingIndex === index ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(index, url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <p className="text-sm text-muted-foreground">
        Upload up to {maxImages} images. First image will be the main product
        image. Max 5MB per image.
      </p>
    </div>
  );
}
