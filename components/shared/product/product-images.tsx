"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images![current]}
        height={1000}
        width={1000}
        alt="Hero Image"
        className="object-cover object-center min-h-[300px]"
      />
      <div className="flex">
        {images.map((image, index) => {
          return (
            <div
              className={cn(
                "hover:border-orange-600 mr-2 cursor-pointer border",
                current === index && "border-orange-500"
              )}
              key={index}
              onClick={() => setCurrent(index)}
            >
              <Image src={image} alt="Image" width={100} height={100} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
