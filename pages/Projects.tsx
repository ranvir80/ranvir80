import React, { useState } from 'react';

interface Project {
  title: string;
  category: string;
  link: string;
  imageUrl: string;
  linkText: string;
}

const allProjects: Project[] = [
  {
    title: "Project 1",
    category: "A",
    link: "#",
    imageUrl: "https://placehold.co/600x400/e2e8f0/2d3748?text=Project+1+UI",
    linkText: "Demo",
  },
  {
    title: "Project 2",
    category: "B",
    link: "#",
    imageUrl: "https://placehold.co/600x400/e2e8f0/2d3748?text=Project+2+UI",
    linkText: "Demo",
  },
  {
    title: "Project 3",
    category: "C",
    link: "#",
    imageUrl: "https://placehold.co/600x400/e2e8f0/2d3748?text=Project+3+UI",
    linkText: "Demo",
  },
   {
    title: "Project 4",
    category: "A",
    link: "#",
    imageUrl: "https://placehold.co/600x400/e2e8f0/2d3748?text=Project+4+UI",
    linkText: "Demo",
  },
];

const ProjectCard: React.FC<Project> = ({ title, link, imageUrl }) => (
  <div className="bg-white rounded-2xl group transition-all duration-300 transform-gpu border border-brand-border p-6 hover:shadow-xl">
      <div className="overflow-hidden rounded-xl mb-6 bg-gray-50 flex items-center justify-center p-4">
        <img src={imageUrl} alt={title} className="w-full h-auto object-contain transition-transform duration-300" width="600" height="400" loading="lazy" />
      </div>
      <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
      <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-brand-secondary hover:text-brand-dark">
          View Project &rarr;
      </a>
  </div>
);

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void; }> = ({label, active, onClick}) => (
    <button onClick={onClick} className={`font-medium text-lg transition-colors ${active ? 'text-brand-dark font-semibold' : 'text-brand-secondary hover:text-brand-dark'}`} aria-pressed={active}>
        {label}
    </button>
)

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'A', 'B', 'C'];
  
  const filteredProjects = activeFilter === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === activeFilter);

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-dark">Portfolio</h2>
          <p className="mt-2 text-lg text-brand-secondary">Recent Projects</p>
        </div>
        <div className="flex justify-center items-center space-x-8 mb-12">
            {filters.map(filter => (
                <FilterButton 
                    key={filter} 
                    label={filter}
                    active={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                />
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;