import { Project } from '../components/ProjectCard';

// NOTE FOR DEPLOYMENT:
// Replace the placeholder 'https://picsum.photos/...' URLs with the actual URLs of your project screenshots.
export const projectsData: Project[] = [
  { id: 1, title: 'E-commerce Platform', author: 'SJK Studio', description: 'A cutting-edge e-commerce platform with a focus on user experience.', tech: ['React', 'Next.js', 'Stripe'], imageUrl: 'https://picsum.photos/seed/alpha/600/400', category: 'website', liveUrl: '#' },
  { id: 2, title: 'Data Viz Dashboard', author: 'SJK Studio', description: 'Interactive data visualization dashboard for a fintech company.', tech: ['React', 'D3.js', 'TypeScript'], imageUrl: 'https://picsum.photos/seed/beta/600/400', category: 'website', liveUrl: '#' },
  { id: 5, title: 'Corporate Redesign', author: 'SJK Studio', description: 'Corporate website redesign with a focus on modern aesthetics.', tech: ['Gatsby', 'Contentful', 'Framer Motion'], imageUrl: 'https://picsum.photos/seed/epsilon/600/400', category: 'website', liveUrl: '#' },
  { id: 3, title: 'Social Media App', author: 'SJK Studio', description: 'A social media app for artists to showcase their work.', tech: ['React Native', 'Firebase', 'GraphQL'], imageUrl: 'https://picsum.photos/seed/gamma/600/400', category: 'app', liveUrl: '#' },
  { id: 4, title: 'AI Content Tool', author: 'SJK Studio', description: 'AI-powered content generation tool for marketing teams.', tech: ['Vue.js', 'Python', 'Gemini API'], imageUrl: 'https://picsum.photos/seed/delta/600/400', category: 'app' },
  { id: 6, title: 'Whiteboard App', author: 'SJK Studio', description: 'A real-time collaborative whiteboard application.', tech: ['WebSockets', 'React', 'Canvas API'], imageUrl: 'https://picsum.photos/seed/zeta/600/400', category: 'app' },
];