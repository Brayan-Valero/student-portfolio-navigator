
import { API_URL, headers, handleError } from './config';
import { Technology, AvailableTechnology, FALLBACK_TECHNOLOGIES } from './types';
import { toast } from "sonner";

// Get technologies for a student
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
    
    // Map the data to match our front-end model
    const technologies = data.map((tech: any) => ({
      id: tech.id,
      code: tech.code,
      name: tech.name,
      // Map skill_level from the database to level in our frontend model
      level: tech.level !== undefined ? tech.level : tech.skill_level
    }));
    
    console.log("Mapped technologies:", technologies);
    return technologies;
  } catch (error) {
    console.error("Error fetching technologies:", error);
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

// Add technology with correct field mapping
export const addTechnology = async (technology: Omit<Technology, 'id'>): Promise<Technology | null> => {
  try {
    console.log("Adding technology:", technology);
    
    // Validate required fields
    if (!technology.code || !technology.name) {
      console.error("Invalid technology data:", technology);
      toast.error("Invalid technology data");
      return null;
    }
    
    // Create the payload based on the database schema
    // The database uses skill_level instead of level
    const payload = {
      code: technology.code,
      name: technology.name,
      skill_level: technology.level // Rename to match database schema
    };
    
    console.log("Sending payload to API:", payload);
    
    const response = await fetch(`${API_URL}/technology`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error status: ${response.status}, Details:`, errorText);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Technology added successfully:", data);
    
    if (data.length > 0) {
      // Map the response to match our front-end model
      return {
        id: data[0].id,
        code: data[0].code,
        name: data[0].name,
        level: data[0].skill_level || 3 // Map skill_level to level
      };
    }
    return null;
  } catch (error) {
    console.error("Error adding technology:", error);
    toast.error("Failed to add technology. Please try again.");
    return null;
  }
};

// Update technology with correct field mapping
export const updateTechnology = async (id: number, technology: Partial<Technology>): Promise<Technology | null> => {
  try {
    console.log(`Updating technology with ID ${id}:`, technology);
    
    // Prepare the payload based on database schema
    const payload: any = {};
    if (technology.name) payload.name = technology.name;
    if (technology.level !== undefined) payload.skill_level = technology.level;
    
    console.log("Update payload:", payload);
    
    const response = await fetch(`${API_URL}/technology?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error status: ${response.status}, Details:`, errorText);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Technology updated successfully:", data);
    
    if (data.length > 0) {
      // Map the response to match our front-end model
      return {
        id: data[0].id,
        code: data[0].code,
        name: data[0].name,
        level: data[0].skill_level || technology.level || 3
      };
    }
    return null;
  } catch (error) {
    console.error("Error updating technology:", error);
    toast.error("Failed to update technology");
    return null;
  }
};

// Delete technology function remains the same
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
