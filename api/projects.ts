// This is a Vercel Serverless Function.
// NOTE: You will need to add the Vercel KV integration to your project for this to work.
// You will also need to add '@vercel/kv' as a dependency in your package.json.
import { kv } from '@vercel/kv';
import { projectsData } from '../data/projects';
// FIX: The 'Project' type is exported from '../data/projects.ts'.
import type { Project } from '../data/projects';

// Define simple interfaces for Vercel request/response
interface VercelRequest {
  method?: string;
  body: any; // Can be string or object
}

interface VercelResponse {
  status: (statusCode: number) => {
    json: (body: any) => void;
    send: (body: any) => void;
  };
  setHeader: (name: string, value: string) => void;
}

const PROJECTS_KEY = 'sjk-studio-projects';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers to allow requests from your frontend origin
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }
  
  try {
    if (req.method === 'GET') {
      let projects: Project[] | null = await kv.get(PROJECTS_KEY);
      
      // If no projects in KV, seed it with initial data from the projects file
      if (!projects || projects.length === 0) {
        // FIX: Add string IDs to the seed data to match the `Project[]` type before saving to KV.
        const projectsWithIds: Project[] = projectsData.map((p, index) => ({
            ...p,
            id: `seed-project-${index + 1}`,
        }));
        await kv.set(PROJECTS_KEY, projectsWithIds);
        projects = projectsWithIds;
      }
      
      return res.status(200).json(projects);
    }

    if (req.method === 'POST') {
      // The admin panel sends the entire updated array of projects
      const updatedProjects = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      if (!Array.isArray(updatedProjects)) {
        return res.status(400).json({ success: false, message: 'Invalid project data. Expected an array.' });
      }

      await kv.set(PROJECTS_KEY, updatedProjects);
      return res.status(200).json({ success: true, message: 'Projects updated successfully.' });
    }

    // If method is not GET or POST, it's not allowed
    // FIX: The 'Allow' header expects a comma-separated string, not an array.
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });

  } catch (error) {
    console.error('API Error in /api/projects:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: errorMessage });
  }
}