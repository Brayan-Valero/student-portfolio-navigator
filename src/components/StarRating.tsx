
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
}

const StarRating = ({
  value,
  max = 5,
  size = 18,
  onChange,
  readOnly = false,
  className,
}: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const handleMouseMove = (index: number) => {
    if (readOnly) return;
    setHoverValue(index);
  };
  
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };
  
  const handleClick = (index: number) => {
    if (readOnly) return;
    onChange?.(index);
  };

  return (
    <div 
      className={cn("stars-container gap-0.5", className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverValue !== null ? starValue <= hoverValue : starValue <= value);
        
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "star transition-all duration-200",
              isFilled ? "text-orange-500 fill-orange-500" : "text-gray-300",
              !readOnly && "cursor-pointer hover:scale-110"
            )}
            onMouseMove={() => handleMouseMove(starValue)}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
