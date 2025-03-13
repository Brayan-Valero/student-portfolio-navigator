
import { API_URL, headers, handleError } from './config';
import { Student } from './types';

// Get all students
export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(`${API_URL}/student?select=*`, {
      headers
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    return handleError(error) as Student[] || [];
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
    return handleError(error) as Student | null;
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
    return handleError(error) as Student | null;
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
    return handleError(error) as Student | null;
  }
};
