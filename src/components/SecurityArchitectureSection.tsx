import React from 'react';

export const SecurityArchitectureSection: React.FC = () => {
  const cards = [
    {
      icon: 'enhanced_encryption',
      iconColor: 'text-[#8E72FF]',
      title: 'AES-256 & ChaCha20 Ciphers',
      description:
        'All user traffic is guarded with AES-256 or ChaCha20 encryption with HMAC SHA-384 message authentication and 4096-bit RSA handshakes. Perfect Forward Secrecy ensures your past sessions can never be decrypted later.',
      tag: 'Full Forward Secrecy Enabled',
    },
    {
      icon: 'power_off',
      iconColor: 'text-[#FF453A]',
      title: 'Always-On Kill Switch',
      description:
        "If your network connection drops unexpectedly, Proton VPN's hardware-level Kill Switch immediately cuts all internet connectivity to prevent your real IP address or unencrypted data packets from leaking into the clear.",
      tag: 'Zero IP / DNS Leaks',
    },
    {
      icon: 'code',
      iconColor: 'text-[#00E5FF]',
      title: '100% Open-Source Client Apps',
      description:
        'We believe trust requires total verification. The entire codebase for our Windows, macOS, Android, and iOS apps is public on GitHub and subjected to continuous external vulnerability audits by independent security experts.',
      tag: 'Public GitHub Repositories',
    },
    {
      icon: 'dns',
      iconColor: 'text-[#FFB020]',
      title: 'Encrypted Swiss DNS Resolvers',
      description:
        'Proton operates its own encrypted DNS resolvers. Your URL queries are routed through encrypted tunnels directly to our own servers—protecting you completely from ISP eavesdropping and DNS poisoning attacks.',
      tag: 'Proprietary DNS Enclave',
    },
    {
      icon: 'bolt',
      iconColor: 'text-[#8E72FF]',
      title: 'WireGuard® Protocol Engine',
      description:
        'Equipped with state-of-the-art WireGuard protocol running on streamlined Linux kernel code. Experience lightning-fast handshake times, low CPU drain, and near-instant reconnection when switching between Wi-Fi and mobile networks.',
      tag: 'Optimized Throughput',
    },
    {
      icon: 'router',
      iconColor: 'text-[#00E5FF]',
      title: 'Router & Multi-Platform Support',
      description:
        'Run Proton VPN Free across your workstation, mobile devices, or install OpenVPN configuration profiles directly onto compatible home routers to cover every IoT sensor and game console on your home network.',
      tag: 'Multi-Platform Native',
    },
  ];

  return (
    <section className="w-full px-4 sm:px-8 py-16 sm:py-20 max-w-[1280px] mx-auto" id="security">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#8E72FF] uppercase tracking-wider">
          Enterprise-Grade Cryptography
        </span>
        <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Zero Cost. Zero Security Compromise.
        </h2>
        <p className="font-['Manrope'] text-base sm:text-lg text-[#A2A4B5] leading-relaxed">
          Every Proton VPN Free user receives the identical military-grade ciphers and anti-censorship protocols used by human rights defenders and investigative journalists worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-6 sm:p-7 rounded-2xl bg-[#13141B] border border-white/10 flex flex-col justify-between hover:border-[#6D4AFF]/50 transition-all group"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#1e1f26] border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <span className={`material-symbols-outlined text-[24px] ${card.iconColor}`}>
                  {card.icon}
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                {card.title}
              </h3>
              <p className="font-['Manrope'] text-[14px] text-[#A2A4B5] leading-relaxed">
                {card.description}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5 font-['JetBrains_Mono'] text-[11px] text-[#00D182] font-semibold uppercase tracking-wider">
              • {card.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
