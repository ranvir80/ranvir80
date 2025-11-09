import React, { useState } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SendIcon, MailIcon } from '../components/Icons';

// 🔑 IMPORTANT: Replace these with your own Supabase project credentials
const supabaseUrl = "https://dummvyivubbpltqcpszg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW12eWl2dWJicGx0cWNwc3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDA3NDIsImV4cCI6MjA3ODA3Njc0Mn0.mwgAO-MwnjhBVXGiSc0TlKaeULAuBmgkixclgkUNggI";
const supabase = createClient(supabaseUrl, supabaseKey);


// --- Helper Functions ---

// Computes SHA-256 hash in hex format
async function sha256Hex(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Gets the user's public IP address from ipify API
async function getPublicIp(): Promise<string> {
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) throw new Error("Failed to get IP address.");
  const data = await res.json();
  return data.ip;
}


const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic validation to ensure Supabase URL/Key are set
    if (!supabaseUrl.includes('supabase.co') || !supabaseKey.startsWith('ey')) {
         setStatus('⚠️ Supabase credentials are not configured. Please update the contact form component.');
         return;
    }

    setIsSubmitting(true);
    setStatus('Sending...');

    try {
      // 1. Get and hash the user's IP address
      const ip = await getPublicIp();
      const ip_hash = await sha256Hex(ip);

      // 2. Insert the form data into the Supabase table
      const { error } = await supabase.from("contact_messages").insert([
        { ...formData, ip_hash }
      ]);

      if (error) {
        // Handle potential errors, like rate-limiting from RLS
        if (error.message.includes("violates row-level security policy")) {
          setStatus("❌ Limit reached — please try again later.");
        } else {
          console.error('Supabase Error:', error);
          setStatus("❌ Failed to send message. Please try again.");
        }
      } else {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
      }
    } catch (err: any) {
      console.error('Submission Error:', err);
      setStatus(`⚠️ An error occurred: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(''), 5000); // Clear status after 5 seconds
    }
  };


  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-dark">Contact Me</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-semibold mb-6">Talk to me</h3>
            <div className="border border-brand-border rounded-2xl p-8 text-center w-full max-w-sm">
                <div className="flex justify-center mb-4">
                   <MailIcon className="w-8 h-8 text-brand-dark"/>
                </div>
                <h4 className="font-semibold text-lg">Email</h4>
                <a href="mailto:pardeshiranvir156@gmail.com" className="text-gray-500 hover:text-brand-dark break-all">pardeshiranvir156@gmail.com</a>
                 <a href="mailto:pardeshiranvir156@gmail.com" className="block mt-4 font-semibold text-sm">
                    Write Me &rarr;
                </a>
            </div>
          </div>
          
          <div className="w-full">
            <h3 className="text-2xl font-semibold mb-10">What's the project?</h3>
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="relative">
                <label htmlFor="name" className="absolute -top-3.5 left-0 text-sm text-brand-secondary">Name</label>
                <input type="text" name="name" id="name" placeholder="Type your name" value={formData.name} onChange={handleChange} required className="block w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 px-1 focus:outline-none focus:ring-0 focus:border-brand-dark transition-colors" />
              </div>
              <div className="relative">
                <label htmlFor="email" className="absolute -top-3.5 left-0 text-sm text-brand-secondary">Email</label>
                <input type="email" name="email" id="email" placeholder="Type your email" value={formData.email} onChange={handleChange} required className="block w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 px-1 focus:outline-none focus:ring-0 focus:border-brand-dark transition-colors" />
              </div>
              <div className="relative">
                <label htmlFor="subject" className="absolute -top-3.5 left-0 text-sm text-brand-secondary">Subject</label>
                <input type="text" name="subject" id="subject" placeholder="What's this about?" value={formData.subject} onChange={handleChange} required className="block w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 px-1 focus:outline-none focus:ring-0 focus:border-brand-dark transition-colors" />
              </div>
              <div className="relative">
                <label htmlFor="message" className="absolute -top-3.5 left-0 text-sm text-brand-secondary">Message</label>
                <textarea name="message" id="message" placeholder="Provide some project details..." rows={2} value={formData.message} onChange={handleChange} required className="block w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 px-1 focus:outline-none focus:ring-0 focus:border-brand-dark transition-colors"></textarea>
              </div>
              <div>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-3 px-8 py-3 rounded-lg font-semibold text-white bg-brand-dark hover:bg-black shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending...' : 'Send Message'} <SendIcon className="w-5 h-5"/>
                </button>
              </div>
            </form>
            {status && <p className="mt-4 font-semibold text-center md:text-left">{status}</p>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;