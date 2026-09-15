/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ServerNode } from './types';
import { FREE_SERVERS } from './data/mockData';
import { Header } from './components/Header';
import { HeroTelemetry } from './components/HeroTelemetry';
import { PlatformStrip } from './components/PlatformStrip';
import { WhyFreeSection } from './components/WhyFreeSection';
import { ServerLocationsSection } from './components/ServerLocationsSection';
import { SecurityArchitectureSection } from './components/SecurityArchitectureSection';
import { ReviewsSection } from './components/ReviewsSection';
import { DownloadSection } from './components/DownloadSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { SignInModal } from './components/SignInModal';
import { DnsLeakModal } from './components/DnsLeakModal';

export default function App() {
  const [activeNode, setActiveNode] = useState<ServerNode>(FREE_SERVERS[0]); // Netherlands #14
  const [activeSection, setActiveSection] = useState<string>('features');

  // Modals state
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadPlatform, setDownloadPlatform] = useState<string>('Windows');
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isDnsLeakOpen, setIsDnsLeakOpen] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleOpenDownload = (platform?: string) => {
    if (platform) setDownloadPlatform(platform);
    setIsDownloadOpen(true);
  };

  const handleSignInSuccess = (username: string) => {
    setCurrentUser(username);
    showToast(`Authenticated as @${username} (Encrypted Swiss Session)`);
  };

  const handleSelectNode = (node: ServerNode) => {
    setActiveNode(node);
    showToast(`Switched tunnel route to ${node.country} (${node.city})`);
  };

  // Track active section for nav highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'why-free', 'servers-showcase', 'security', 'downloads', 'faq'];
      const scrollPos = window.scrollY + 160;

      for (const sectionId of sections) {
        const elem = document.getElementById(sectionId);
        if (elem) {
          const top = elem.offsetTop;
          const height = elem.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#e3e1ec] font-['Manrope'] selection:bg-[#6D4AFF] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Toast feedback banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#1C1D27] border border-[#6D4AFF] shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 text-white font-['JetBrains_Mono'] text-[13px] animate-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D182] animate-ping"></span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#6C6F82] hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Persistent Navigation Header */}
      <Header
        onOpenDownload={handleOpenDownload}
        onOpenSignIn={() => setIsSignInOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full pt-20">
        <HeroTelemetry
          onOpenDownload={handleOpenDownload}
          onOpenDnsLeakTest={() => setIsDnsLeakOpen(true)}
          activeNode={activeNode}
          onSelectNode={handleSelectNode}
        />

        <PlatformStrip onOpenDownload={handleOpenDownload} />

        <WhyFreeSection />

        <ServerLocationsSection
          activeNode={activeNode}
          onSelectNode={handleSelectNode}
        />

        <SecurityArchitectureSection />

        <ReviewsSection />

        <DownloadSection onOpenDownload={handleOpenDownload} />

        <FaqSection />

        <CtaBanner onOpenDownload={handleOpenDownload} />
      </main>

      {/* Footer */}
      <Footer
        onOpenDownload={handleOpenDownload}
        onOpenDnsLeakTest={() => setIsDnsLeakOpen(true)}
      />

      {/* Interactive Modals */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        defaultPlatform={downloadPlatform}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSuccess={handleSignInSuccess}
      />

      <DnsLeakModal
        isOpen={isDnsLeakOpen}
        onClose={() => setIsDnsLeakOpen(false)}
        activeNode={activeNode}
      />
    </div>
  );
}
