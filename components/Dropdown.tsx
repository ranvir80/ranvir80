import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from './Icons';

interface DropdownProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="absolute -top-3.5 left-0 text-sm text-brand-secondary transition-all">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 px-1 focus:outline-none focus:border-brand-dark transition-all text-left"
      >
        <span className={`${selected ? 'text-brand-dark' : 'text-gray-400'}`}>
          {selected || 'Select an option'}
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 text-brand-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1 bg-white border border-brand-border rounded-xl shadow-xl overflow-hidden"
          >
            <div className="py-2">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                    ${selected === option 
                      ? 'bg-gray-50 text-brand-dark font-semibold' 
                      : 'text-brand-secondary hover:bg-gray-50 hover:text-brand-dark'
                    }`}
                >
                  {option}
                  {selected === option && (
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
