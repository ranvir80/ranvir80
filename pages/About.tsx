import React from 'react';
import { CheckIcon } from '../components/Icons';

const skills = [
  'Automation',
  'AI Agents',
  'Artificial Intelligence (AI)',
  'LangChain',
  'JavaScript',
];

const SkillPill: React.FC<{name: string}> = ({ name }) => (
    <li className="flex items-center gap-3">
        <CheckIcon className="w-5 h-5 text-brand-dark" />
        <div>
            <h5 className="font-semibold text-sm">{name}</h5>
        </div>
    </li>
);

const About: React.FC = () => {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-5xl space-y-24">
        
        {/* About Me Section */}
        <section>
            <h2 className="text-3xl font-bold text-center mb-2">About Me</h2>
            <p className="text-center text-brand-secondary mb-12">A short introduction</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/ranvir80/ranvir80@main/images/1762347348414.jpg" 
                      alt="About Ranvir Pardeshi" 
                      className="rounded-2xl w-full max-w-sm object-cover" 
                      width="384" 
                      height="461" 
                      loading="lazy" 
                    />
                </div>
                <div className="space-y-6">
                    <p className="text-brand-secondary leading-relaxed">
                      I go by Ranvir Pardeshi. I am a student who feels pretty strongly about creating AI-powered automation and those smart agent systems. I really enjoy trying out different tools and frameworks. They make it possible to turn automation ideas into real working setups. This covers everything from personal productivity hacks to larger AI workflows.
                    </p>
                    <p className="text-brand-secondary leading-relaxed">
                      These days I spend time digging into advanced AI frameworks, APIs, and agent SDKs. All of this helps me build systems that can think on their own, act independently, and assist in ways that feel human. My bigger aim involves blending logic with creativity and technology to open up automation so more people can use it easily.
                    </p>
                </div>
            </div>
        </section>

        {/* Experience & Education Section */}
        <section className="max-w-4xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-6 text-center">Experience</h3>
                    <div className="border border-brand-border rounded-2xl p-8 space-y-4">
                        <h4 className="font-bold">Artificial Intelligence Intern</h4>
                        <p className="font-medium text-brand-secondary">BoardBro (Internship)</p>
                        <p className="text-sm text-gray-500">Sep 2025 - Oct 2025 · Remote</p>
                        <p className="text-sm text-brand-secondary">
                            I handle AI automation at BoardBro – building and managing WhatsApp, Instagram, and chat support systems to streamline workflows and make our processes more efficient.
                        </p>
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-6 text-center">Education</h3>
                     <div className="border border-brand-border rounded-2xl p-8 space-y-2">
                        <h4 className="font-bold">Sardar SK Pawar High-school</h4>
                        <p className="font-medium text-brand-secondary">Student</p>
                        <p className="text-sm text-gray-500">2024 - Jun 2027</p>
                        <p className="text-sm text-brand-secondary">
                            Currently in 11th Grade, focusing on technology and computer science.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Skills Section */}
        <section>
            <h2 className="text-3xl font-bold text-center mb-2">Skills</h2>
            <p className="text-center text-brand-secondary mb-12">Core Competencies</p>
            <div className="max-w-2xl mx-auto">
                <div className="border border-brand-border rounded-2xl p-8">
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                        {skills.map(skill => <SkillPill key={skill} name={skill} />)}
                    </ul>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default About;
