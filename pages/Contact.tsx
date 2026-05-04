import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, MailIcon } from '../components/Icons';

declare global {
  interface Window {
    turnstile: any;
    onTurnstileSuccess: (token: string) => void;
    onTurnstileExpired: () => void;
  }
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  lookingFor: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', lookingFor: 'General Inquiry', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
      console.log("Turnstile verified");
    };

    window.onTurnstileExpired = () => {
      setTurnstileToken(null);
      setStatus("Security check expired. Please refresh the page.");
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!turnstileToken) {
      setStatus("⚠️ Please complete the security check.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("Transmitting...");

    const payload = {
      ...formData,
      captchaToken: turnstileToken,
      timestamp: new Date().toISOString()
    };

    try {
      // REPLACE THIS with your worker URL from Cloudflare
      const res = await fetch("https://formofaeth.pardeshiranvir156.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success !== false) {
        setStatus("✅ Transmission successful! We will contact you soon.");
        setFormData({ name: '', email: '', subject: '', lookingFor: 'General Inquiry', message: '' });
        if (window.turnstile) {
          window.turnstile.reset();
        }
        setTurnstileToken(null);
      } else {
        setStatus("❌ " + (data.error || "Transmission failed."));
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("⚠️ Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
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
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
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
                <label htmlFor="lookingFor" className="absolute -top-3.5 left-0 text-sm text-brand-secondary">Interest</label>
                <select name="lookingFor" id="lookingFor" value={formData.lookingFor} onChange={handleChange} className="block w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 px-1 focus:outline-none focus:ring-0 focus:border-brand-dark transition-colors text-brand-dark">
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="Security Audit">Security Audit</option>
                </select>
              </div>
              <div className="relative">
                <label htmlFor="message" className="absolute -top-3.5 left-0 text-sm text-brand-secondary">Message</label>
                <textarea name="message" id="message" placeholder="Provide some project details..." rows={2} value={formData.message} onChange={handleChange} required className="block w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 px-1 focus:outline-none focus:ring-0 focus:border-brand-dark transition-colors"></textarea>
              </div>
              
              <div className="cf-turnstile" data-sitekey="0x4AAAAAADIuUSieP368XCOf" data-callback="onTurnstileSuccess" data-expired-callback="onTurnstileExpired"></div>

              <div>
                <button type="submit" disabled={isSubmitting || !turnstileToken} className="inline-flex items-center gap-3 px-8 py-3 rounded-lg font-semibold text-white bg-brand-dark hover:bg-black shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Transmitting...' : 'Send Transmission'} <SendIcon className="w-5 h-5"/>
                </button>
              </div>
            </form>
            {status && <p className={`mt-4 font-semibold text-center md:text-left ${status.includes('❌') || status.includes('⚠️') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
