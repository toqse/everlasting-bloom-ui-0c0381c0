"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ShimmerImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
};

const ShimmerImage = ({
  src,
  alt = "",
  className,
  imgClassName,
  style,
}: ShimmerImageProps) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    const done = () => {
      if (!cancelled) setLoadedSrc(src);
    };
    img.onload = done;
    img.onerror = done;
    img.src = src;
    if (img.complete && img.naturalWidth > 0) done();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div
      className={cn("relative overflow-hidden bg-muted/40", className)}
      style={style}
    >
      {!loaded ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] shimmer-block"
          aria-hidden
        />
      ) : null}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
};

export default ShimmerImage;
