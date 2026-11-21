"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

type EquipmentImageProps = {
  src?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
};

export default function EquipmentImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "object-contain",
}: EquipmentImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc = src?.trim() || "";

  const isValid =
    imageSrc.startsWith("https://") ||
    imageSrc.startsWith("http://") ||
    (imageSrc.startsWith("/") && !imageSrc.startsWith("//"));

  if (!isValid || failedSrc === imageSrc) {
    return (
      <div
        role="img"
        aria-label={`${alt} — Image unavailable`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted text-muted-foreground"
      >
        <Package
          size={56}
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <span className="text-xs font-medium">
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      className={`${className} transition-transform duration-500 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100`}
      onError={() => setFailedSrc(imageSrc)}
    />
  );
}