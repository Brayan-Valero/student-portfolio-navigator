import { API_URL, headers, handleError } from './config';
import { Technology, AvailableTechnology, FALLBACK_TECHNOLOGIES } from './types';
import { toast } from "sonner";

// Get technologies for a student - Improved error handling and debugging
export const getStudentTechnologies = async (studentCode: string): Promise<Technology[]> => {
  try {
    console.log(`Fetching technologies for student code: ${studentCode}`);
    const url = `${API_URL}/technology?code=eq.${studentCode}&select=*`;
    console.log(`API URL: ${url}`);
    
    const response = await fetch(url, {
      headers
    });
    
    if (!response.ok) {
      console.error(`Error status: ${response.status}`);
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Technologies found: ${data.length}`, data);
    
    // Validate that each item in the response has the expected fields
    const validTechnologies = data.filter((tech: any) => 
      tech && typeof tech.id === 'number' && 
      typeof tech.code === 'string' && 
      typeof tech.name === 'string' && 
      typeof tech.level === 'number'
    );
    
    if (validTechnologies.length !== data.length) {
      console.warn(`Found ${data.length - validTechnologies.length} technologies with invalid format`);
    }
    
    return validTechnologies;
  } catch (error) {
    console.error("Error fetching technologies:", error);
    // Don't show error toast for empty technologies - this is normal for new students
    return [] as Technology[];
  }
};

// Get available technologies with fallback
export const getAvailableTechnologies = async (): Promise<AvailableTechnology[]> => {
  try {
    console.log("Fetching available technologies");
    const url = `${API_URL}/available_technology?select=id,name`;
    console.log(`API URL: ${url}`);
    
    const response = await fetch(url, {
      headers
    });
    
    if (!response.ok) {
      console.error(`Error status: ${response.status}`);
      // If 404, use fallback technologies instead of throwing
      if (response.status === 404) {
        console.log("Using fallback technologies list");
        return FALLBACK_TECHNOLOGIES;
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Available technologies found: ${data.length}`, data);
    return data;
  } catch (error) {
    console.error("Error fetching available technologies:", error);
    console.log("Using fallback technologies after error");
    // Always return fallback technologies when there's an error
    return FALLBACK_TECHNOLOGIES;
  }
};

// Add a technology for a student - Improve error handling
export const addTechnology = async (technology: Omit<Technology, 'id'>): Promise<Technology | null> => {
  try {
    console.log("Adding technology:", technology);
    
    // Validate required fields before sending
    if (!technology.code || !technology.name || typeof technology.level !== 'number') {
      console.error("Invalid technology data:", technology);
      toast.error("Invalid technology data");
      return null;
    }
    
    // Add additional debugging
    console.log("Sending request to:", `${API_URL}/technology`);
    console.log("With headers:", JSON.stringify(headers));
    console.log("With body:", JSON.stringify(technology));
    
    const response = await fetch(`${API_URL}/technology`, {
      method: "POST",
      headers,
      body: JSON.stringify(technology)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error status: ${response.status}, Details:`, errorText);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Technology added successfully:", data);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error adding technology:", error);
    toast.error("Failed to add technology. Please try again.");
    return null;
  }
};

// Update a technology - Keep existing code
export const updateTechnology = async (id: number, technology: Partial<Technology>): Promise<Technology | null> => {
  try {
    console.log(`Updating technology with ID ${id}:`, technology);
    const response = await fetch(`${API_URL}/technology?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(technology)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error status: ${response.status}, Details:`, errorText);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Technology updated successfully:", data);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error updating technology:", error);
    toast.error("Failed to update technology");
    return null;
  }
};

// Delete a technology - Keep existing code
export const deleteTechnology = async (id: number): Promise<boolean> => {
  try {
    console.log(`Deleting technology with ID ${id}`);
    const response = await fetch(`${API_URL}/technology?id=eq.${id}`, {
      method: "DELETE",
      headers
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error status: ${response.status}, Details:`, errorText);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    
    console.log("Technology deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting technology:", error);
    toast.error("Failed to delete technology");
    return false;
  }
};
