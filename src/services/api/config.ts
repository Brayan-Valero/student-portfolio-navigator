
// Base API configuration
export const API_URL = "https://ubsuofrvgbvtryjuzxhb.supabase.co/rest/v1";
export const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVic3VvZnJ2Z2J2dHJ5anV6eGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Mjc4MDUsImV4cCI6MjA1NjIwMzgwNX0.-SOdP6tT6URg_Z9x-L9j3R4jw-mSNofm4zIiykmcGYA";

// Default headers for all requests
export const headers = {
  "apikey": API_KEY,
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// Common error handling function
import { toast } from "sonner";

export const handleError = (error: any) => {
  console.error("API Error:", error);
  
  // Don't show toast errors for 404 on available_technology (we know it doesn't exist)
  if (error && error.message && error.message.includes("available_technology")) {
    console.log("Ignoring known 404 error for available_technology");
    return null;
  }
  
  toast.error("An error occurred while fetching data");
  return null;
};
