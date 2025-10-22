import { Project } from '../components/ProjectCard';

// NOTE FOR DEPLOYMENT:
// Replace the placeholder 'https://picsum.photos/...' URLs with the actual URLs of your project screenshots.
export const projectsData: Project[] = [
  { id: 1, title: 'E-commerce Platform', author: 'SJK Studio', description: 'A cutting-edge e-commerce platform with a focus on user experience.', tech: ['React', 'Next.js', 'Stripe'], imageUrl: 'https://picsum.photos/seed/alpha/600/400', category: 'website', liveUrl: '#' },
  { id: 2, title: 'Data Viz Dashboard', author: 'SJK Studio', description: 'Interactive data visualization dashboard for a fintech company.', tech: ['React', 'D3.js', 'TypeScript'], imageUrl: 'https://picsum.photos/seed/beta/600/400', category: 'website', liveUrl: '#' },
  { id: 5, title: 'Corporate Redesign', author: 'SJK Studio', description: 'Corporate website redesign with a focus on modern aesthetics.', tech: ['Gatsby', 'Contentful', 'Framer Motion'], imageUrl: 'https://picsum.photos/seed/epsilon/600/400', category: 'website', liveUrl: '#' },
];
