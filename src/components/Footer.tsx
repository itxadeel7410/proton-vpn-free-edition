import React, { useState } from 'react';
import { PROTON_LOGO_URL } from '../data/mockData';

interface FooterProps {
  onOpenDownload: (platform?: string) => void;
  onOpenDnsLeakTest: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDownload, onOpenDnsLeakTest }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="w-full bg-[#13141B] border-t border-white/10 pt-16 sm:pt-20 pb-12">
      <div className="w-full px-4 sm:px-8 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-16">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <div className="flex items-center gap-2.5">
              {!logoError ? (
                <img
                  alt="Proton VPN Free Logo"
                  className="h-7 w-auto object-contain"
                  src={PROTON_LOGO_URL}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#6D4AFF] flex items-center justify-center text-white text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">shield</span>
                </div>
              )}
              <span className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight">
                Proton VPN
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#1e1f26] font-['JetBrains_Mono'] text-[11px] text-[#00D182] border border-white/10">
                Swiss Privacy
              </span>
            </div>

            <p className="font-['Manrope'] text-[14px] text-[#A2A4B5] max-w-md leading-relaxed">
              Headquartered in Geneva, Switzerland. Built by scientists and engineers who met at CERN, Proton VPN defends internet freedom and digital confidentiality worldwide.
            </p>

            <div className="flex items-center gap-2 pt-2 text-[#00D182]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wide">
                100% Free Forever • No Ads • No Logs • No Speed Caps
              </p>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-3">
            <h4 className="font-['JetBrains_Mono'] text-[12px] font-semibold text-[#6C6F82] uppercase tracking-wider">
              Platforms
            </h4>
            <ul className="space-y-2 font-['Manrope'] text-[14px]">
              <li>
                <button
                  onClick={() => onOpenDownload('Windows')}
                  className="text-[#c9c4d9] hover:text-white transition-colors cursor-pointer"
                >
                  Windows VPN
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenDownload('macOS')}
                  className="text-[#c9c4d9] hover:text-white transition-colors cursor-pointer"
                >
                  macOS VPN
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenDownload('Linux')}
                  className="text-[#c9c4d9] hover:text-white transition-colors cursor-pointer"
                >
                  Linux CLI & GUI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenDownload('iOS & iPadOS')}
                  className="text-[#c9c4d9] hover:text-white transition-colors cursor-pointer"
                >
                  iOS & iPadOS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenDownload('Android')}
                  className="text-[#c9c4d9] hover:text-white transition-colors cursor-pointer"
                >
                  Android & Chromebook
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency */}
          <div className="space-y-3">
            <h4 className="font-['JetBrains_Mono'] text-[12px] font-semibold text-[#6C6F82] uppercase tracking-wider">
              Transparency
            </h4>
            <ul className="space-y-2 font-['Manrope'] text-[14px]">
              <li>
                <a
                  href="https://github.com/ProtonVPN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c9c4d9] hover:text-white transition-colors"
                >
                  100% Open Source Code
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDnsLeakTest}
                  className="text-[#c9c4d9] hover:text-white transition-colors cursor-pointer text-left"
                >
                  SEC Consult Audits
                </button>
              </li>
              <li>
                <a href="#why-free" className="text-[#c9c4d9] hover:text-white transition-colors">
                  Swiss Legal Protection
                </a>
              </li>
              <li>
                <a href="#security" className="text-[#c9c4d9] hover:text-white transition-colors">
                  Transparency Report
                </a>
              </li>
              <li>
                <a href="#servers-showcase" className="text-[#c9c4d9] hover:text-white transition-colors">
                  Server Network Status
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Community */}
          <div className="space-y-3">
            <h4 className="font-['JetBrains_Mono'] text-[12px] font-semibold text-[#6C6F82] uppercase tracking-wider">
              Legal & Community
            </h4>
            <ul className="space-y-2 font-['Manrope'] text-[14px]">
              <li>
                <a href="#why-free" className="text-[#c9c4d9] hover:text-white transition-colors">
                  No-Logs Privacy Policy
                </a>
              </li>
              <li>
                <a href="#faq" className="text-[#c9c4d9] hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#security" className="text-[#c9c4d9] hover:text-white transition-colors">
                  Bug Bounty Program
                </a>
              </li>
              <li>
                <a href="#features" className="text-[#c9c4d9] hover:text-white transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#faq" className="text-[#c9c4d9] hover:text-white transition-colors">
                  Customer Assistance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[#6C6F82] font-['Manrope'] text-[13px]">
          <div>
            © 2025 Proton AG. Route de la Galaise 32, 1228 Plan-les-Ouates, Geneva, Switzerland.
          </div>
          <div className="flex items-center gap-6 font-['JetBrains_Mono'] text-[12px]">
            <span className="flex items-center gap-2 text-[#00D182]">
              <span className="w-2 h-2 rounded-full bg-[#00D182] animate-pulse"></span>
              Swiss Infrastructure Operational
            </span>
            <span className="text-[#A2A4B5]">Proton Free Edition v5.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
