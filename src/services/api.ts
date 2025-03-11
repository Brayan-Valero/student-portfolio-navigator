
import { toast } from "sonner";

const API_URL = "https://ubsuofrvgbvtryjuzxhb.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVic3VvZnJ2Z2J2dHJ5anV6eGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Mjc4MDUsImV4cCI6MjA1NjIwMzgwNX0.-SOdP6tT6URg_Z9x-L9j3R4jw-mSNofm4zIiykmcGYA";

export interface Student {
  code: string;
  name: string;
  email: string;
  photo: string;
  github_link: string;
  description: string;
}

export interface Technology {
  id: number;
  code: string; 
  name: string;
  level: number;
}

// Default headers for all requests
const headers = {
  "apikey": API_KEY,
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// Error handling
const handleError = (error: any) => {
  console.error("API Error:", error);
  toast.error("An error occurred while fetching data");
  return null;
};

// Get all students
export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(`${API_URL}/student?select=*`, {
      headers
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleError(error) || [];
  }
};

// Get a single student by code
export const getStudentByCode = async (code: string): Promise<Student | null> => {
  try {
    const response = await fetch(`${API_URL}/student?code=eq.${code}&select=*`, {
      headers
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    return handleError(error);
  }
};

// Create a new student
export const createStudent = async (student: Student): Promise<Student | null> => {
  try {
    const response = await fetch(`${API_URL}/student`, {
      method: "POST",
      headers,
      body: JSON.stringify(student)
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    return handleError(error);
  }
};

// Update an existing student
export const updateStudent = async (code: string, student: Partial<Student>): Promise<Student | null> => {
  try {
    const response = await fetch(`${API_URL}/student?code=eq.${code}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(student)
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    return handleError(error);
  }
};

// Get technologies for a student - Log more information to help debug
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
    return data;
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return handleError(error) || [];
  }
};

// Add a technology for a student - Add detailed logging
export const addTechnology = async (technology: Omit<Technology, 'id'>): Promise<Technology | null> => {
  try {
    console.log("Adding technology:", technology);
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
    return handleError(error);
  }
};

// Update a technology - Add detailed logging
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
    return handleError(error);
  }
};

// Delete a technology - Add detailed logging
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
    handleError(error);
    return false;
  }
};
