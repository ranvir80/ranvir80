import React from 'react';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "LangChain vs N8n - Which Is Better for AI Agents?",
    excerpt: "A comparison of code-first (LangChain) and low-code (N8n) platforms for building AI agents, helping you choose based on your project goals and technical skill.",
    date: "October 21, 2025",
    imageUrl: "https://picsum.photos/seed/langchain-n8n/600/400",
    link: "https://www.linkedin.com/in/ranvirpardeshi/",
  },
  {
    title: "Optimizing Client Pricing Models: A Freelancer's Insight",
    excerpt: "A look into fixed project vs. subscription-based models for AI and web projects, and how to choose the right one for your freelance business.",
    date: "October 22, 2025",
    imageUrl: "https://picsum.photos/seed/pricing-models/600/400",
    link: "https://www.linkedin.com/in/ranvirpardeshi/",
  },
  {
    title: "My Journey into AI Agent Development at 16",
    excerpt: "Sharing my story of how I got started with AI, the resources I used, and the challenges I faced along the way.",
    date: "September 10, 2025",
    imageUrl: "https://picsum.photos/seed/blog3/600/400",
    link: "#",
  },
];

const BlogCard: React.FC<BlogPost> = ({ title, excerpt, date, imageUrl, link }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-border">
    <img 
      src={imageUrl} 
      alt={title} 
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
      width="600" 
      height="400" 
      loading="lazy"
    />
    <div className="p-6">
      <p className="text-sm text-gray-500 mb-2">{date}</p>
      <h3 className="text-lg font-bold text-brand-dark mb-2">{title}</h3>
      <p className="text-brand-secondary mb-4 text-sm">{excerpt}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-brand-dark hover:underline">
        Read More &rarr;
      </a>
    </div>
  </div>
);

const Blog: React.FC = () => {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-dark">Insights & Blogs</h2>
          <p className="mt-2 text-lg text-brand-secondary">Sharing my thoughts on AI, automation, and technology.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;