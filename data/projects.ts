// This type definition is used across the application.
// It matches the Supabase table structure while keeping optional fields for UI compatibility.
export type Project = {
  id: string; // Changed from number to string for Supabase IDs
  title: string;
  description: string;
  imageURL: string; // Renamed from imageUrl
  category: string;
  // Optional fields to maintain design compatibility without breaking components
  tech?: string[];
  author?: string;
  liveUrl?: string;
};

// This file is now only for the type definition.
// The static project data has been removed as it's now managed in Supabase.
export const projectsData: Project[] = [];