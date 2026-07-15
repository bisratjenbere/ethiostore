"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ZoomIn, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFullscreen, setShowFullscreen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div className="relative group">
        <div
          ref={imageRef}
          className="relative overflow-hidden rounded-lg bg-muted cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setShowFullscreen(true)}
        >
          <div className={cn(
            "relative transition-transform duration-200 ease-out",
            isZoomed && "scale-150"
          )}
          style={isZoomed ? {
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          } : {}}
          >
            <Image
              src={images![current]}
              height={1000}
              width={1000}
              alt="Product Image"
              className="object-cover object-center min-h-[300px] w-full"
              priority
            />
          </div>

          {/* Zoom Indicator */}
          <div className={cn(
            "absolute top-4 right-4 bg-black/60 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-opacity",
            isZoomed ? "opacity-0" : "opacity-100"
          )}>
            <ZoomIn className="h-4 w-4" />
            <span className="text-sm">Hover to zoom</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullscreen(true);
            }}
            className={cn(
              "absolute bottom-4 right-4 bg-white hover:bg-gray-100 p-2 rounded-lg shadow-lg transition-all",
              "opacity-0 group-hover:opacity-100"
            )}
            aria-label="View fullscreen"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:border-primary",
              current === index ? "border-primary ring-2 ring-primary ring-offset-2" : "border-gray-200"
            )}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
              className="object-cover w-20 h-20 sm:w-24 sm:h-24"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <Image
              src={images![current]}
              alt="Fullscreen product image"
              fill
              className="object-contain"
              sizes="95vw"
            />
            
            {/* Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-2 rounded-lg">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      current === index ? "bg-white w-8" : "bg-white/50"
                    )}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImages;
