import React, { useState } from 'react';
import { PROTON_LOGO_URL } from '../data/mockData';

interface HeaderProps {
  onOpenDownload: (platform?: string) => void;
  onOpenSignIn: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDownload, onOpenSignIn, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Why Free?', href: '#why-free', id: 'why-free' },
    { label: 'Server Locations', href: '#servers-showcase', id: 'server-locations' },
    { label: 'Security & Audits', href: '#security', id: 'security-and-audits' },
    { label: 'Downloads', href: '#downloads', id: 'downloads' },
    { label: 'Support', href: '#faq', id: 'support' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#1C1D27]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-20 w-full px-4 sm:px-8 max-w-[1360px] mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 group">
            {!logoError ? (
              <img
                alt="Proton VPN Free Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src={PROTON_LOGO_URL}
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#6D4AFF] flex items-center justify-center text-white font-bold text-base shadow-[0_0_12px_rgba(109,74,255,0.6)]">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight">
                Proton <span className="text-[#8E72FF]">VPN</span>
              </span>
            </div>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#292931] font-['JetBrains_Mono'] text-[11px] font-semibold text-[#00E5FF] border border-white/10 uppercase tracking-wider hidden sm:inline-block">
              Free Edition
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-2 ml-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`transition-all font-['Manrope'] text-[14px] font-semibold px-3.5 py-1.5 rounded-full ${
                    isActive
                      ? 'bg-[#6D4AFF] text-[#f4eeff] shadow-[0_0_16px_rgba(109,74,255,0.4)]'
                      : 'text-[#c9c4d9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenSignIn}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 font-['Manrope'] text-[14px] font-semibold text-[#c9c4d9] hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={() => onOpenDownload()}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#6D4AFF] text-white font-['Manrope'] text-[14px] font-semibold shadow-[0_0_24px_rgba(109,74,255,0.45)] hover:bg-[#5833ea] hover:shadow-[0_0_32px_rgba(109,74,255,0.65)] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Free</span>
          </button>

          <button
            onClick={onOpenSignIn}
            title="User Account"
            className="w-9 h-9 rounded-full bg-[#c9bfff] hover:bg-white flex items-center justify-center transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-[#2f009c] text-[19px]">person</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-lg bg-[#292931] border border-white/10 flex items-center justify-center text-[#e3e1ec] hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#13141B] border-b border-white/10 px-6 py-5 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="px-4 py-2.5 rounded-lg text-[#e3e1ec] hover:text-white hover:bg-[#292931] font-['Manrope'] text-[15px] font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
              className="w-full py-2.5 text-center text-[#c9c4d9] hover:text-white font-['Manrope'] text-[14px] font-semibold"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDownload();
              }}
              className="w-full py-3 rounded-full bg-[#6D4AFF] text-white font-['Manrope'] text-[14px] font-semibold text-center shadow-[0_0_20px_rgba(109,74,255,0.4)]"
            >
              Download Free Edition
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
