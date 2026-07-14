"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { insertProductSchema } from "@/lib/validators";
import { createProduct, updateProduct } from "@/lib/actions/admin.actions";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/shared/product/image-upload";
import SingleImageUpload from "@/components/shared/product/single-image-upload";

type ProductFormData = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  price: string;
  banner?: string | null;
};

type ProductFormProps = {
  type: "create" | "update";
  product?: ProductFormData & { id: string };
};

export default function ProductForm({ type, product }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(insertProductSchema) as any,
    defaultValues: product || {
      name: "",
      slug: "",
      category: "",
      brand: "",
      description: "",
      price: "0.00",
      stock: 0,
      images: [],
      isFeatured: false,
      banner: "",
    },
  });

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (type === "create" || !product) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug);
    }
  };

  const onSubmit: SubmitHandler<ProductFormData> = (values) => {
    startTransition(async () => {
      let result;

      if (type === "create") {
        result = await createProduct(values);
      } else if (product) {
        result = await updateProduct(product.id, values);
      }

      if (result && !result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result?.message || "Product saved successfully");
      router.push("/admin/products");
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter product name"
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="product-slug" />
                </FormControl>
                <FormDescription>
                  URL-friendly version of the name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Electronics" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Apple" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter product description"
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || []}
                  onChange={field.onChange}
                  maxImages={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Banner */}
        <FormField
          control={form.control}
          name="banner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image (Optional)</FormLabel>
              <FormControl>
                <SingleImageUpload
                  value={field.value || undefined}
                  onChange={field.onChange}
                  label="Upload Banner"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Featured */}
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Product</FormLabel>
                <FormDescription>
                  This product will be highlighted on the homepage
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {type === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>{type === "create" ? "Create Product" : "Update Product"}</>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
