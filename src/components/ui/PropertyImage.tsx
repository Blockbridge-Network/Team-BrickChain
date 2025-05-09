"use client";

import Image from "next/image";
import { useState } from "react";

interface PropertyImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
}

export default function PropertyImage({
  src,
  alt,
  fill = false,
  className = "",
}: PropertyImageProps) {
  const [error, setError] = useState(false);
  
  // Use placeholder if there's an error or no source
  const imageSrc = error || !src ? '/placeholder-property.jpg' : src;

  // Basic dimensions for non-fill images
  const baseProps = {
    width: fill ? undefined : 400,
    height: fill ? undefined : 300,
  };

  return (
    <div className={`relative ${fill ? 'h-full' : ''} ${className}`}>
      <Image
        {...baseProps}
        src={imageSrc}
        alt={alt}
        fill={fill}
        className={`${fill ? 'object-cover' : ''}`}
        onError={() => setError(true)}
        priority={false}
        quality={75}
      />
    </div>
  );
}
