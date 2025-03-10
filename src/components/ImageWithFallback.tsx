
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(
        "lazy-image",
        isLoaded && "loaded",
        className
      )}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
