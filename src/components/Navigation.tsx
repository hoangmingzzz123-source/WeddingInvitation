import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Menu, X, Heart } from 'lucide-react';
import logoWeb from '../asset/logoweb.jpg';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Trang chủ', href: '#home' },
    { label: 'Gói thiệp', href: '#packages' },
    { label: 'Mẫu thiệp', href: '#templates' },
    { label: 'Tính năng', href: '#features' },
    { label: 'Đánh giá', href: '#testimonials' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-28 md:h-32">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <img 
              src={logoWeb} 
              alt="Thiệp Cưới Online Logo" 
              className="h-24 md:h-28 w-auto object-contain"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#333] hover:text-[#C29B43] transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                {item.label}
              </a>
            ))}
            <Button
              className="bg-[#C29B43] hover:bg-[#A88434] text-white px-6 py-2 rounded-full"
              style={{ fontFamily: '"Poppins", sans-serif' }}
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tạo thiệp ngay
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#C29B43]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#C29B43]/20"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-[#333] hover:text-[#C29B43] py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  {item.label}
                </a>
              ))}
              <Button
                className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white px-6 py-3 rounded-full"
                style={{ fontFamily: '"Poppins", sans-serif' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Tạo thiệp ngay
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}