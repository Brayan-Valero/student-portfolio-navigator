
// API Data Types
export interface Student {
  code: string;
  name: string;
  email: string;
  photo: string;
  github_link: string;
  description: string;
}

// Updated Technology interface to handle both database and front-end models
export interface Technology {
  id: number;
  code: string; 
  name: string;
  level: number;
  // Optional field that might exist in the database
  skill_level?: number;
}

export interface AvailableTechnology {
  id: number;
  name: string;
}

// Default fallback technologies if the API fails
export const FALLBACK_TECHNOLOGIES: AvailableTechnology[] = [
  { id: 1, name: "JavaScript" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "React" },
  { id: 4, name: "Node.js" },
  { id: 5, name: "Python" },
  { id: 6, name: "Java" },
  { id: 7, name: "C#" },
  { id: 8, name: "PHP" },
  { id: 9, name: "Ruby" },
  { id: 10, name: "Go" }
];
