import React, { useState } from 'react';
import { PLATFORMS } from '../data/mockData';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlatform?: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  defaultPlatform = 'Windows',
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(defaultPlatform);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);

  if (!isOpen) return null;

  const currentPlatform =
    PLATFORMS.find((p) => p.name.toLowerCase().includes(selectedPlatform.toLowerCase())) ||
    PLATFORMS[0];

  const handleStartDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadComplete(true);

          // Trigger simulated file download for WireGuard sample config
          const configContent = `[Interface]
# Proton VPN Free Edition WireGuard Configuration
# Protocol: WireGuard UDP • Port 51820
PrivateKey = aP4k9X...[ANONYMOUS_CLIENT_KEY]
Address = 10.2.0.2/32
DNS = 10.2.0.1

[Peer]
# Node: Netherlands #14 (Amsterdam Core Hub)
PublicKey = bR7m2Q...[PROTON_SWISS_PUBKEY]
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = 185.107.56.24:51820
PersistentKeepalive = 25`;

          const blob = new Blob([configContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `proton-free-${currentPlatform.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.conf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  const copySha = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13141B] border border-white/10 p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#1e1f26] border border-white/10 flex items-center justify-center text-[#A2A4B5] hover:text-white hover:bg-[#292931] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#6D4AFF] flex items-center justify-center text-white shadow-[0_0_16px_rgba(109,74,255,0.4)]">
            <span className="material-symbols-outlined text-[22px]">download</span>
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Download Proton VPN Free
            </h3>
            <p className="font-['Manrope'] text-[13px] text-[#A2A4B5]">
              No card required • Unlimited bandwidth • 100% Free forever
            </p>
          </div>
        </div>

        {/* Platform selection tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {PLATFORMS.map((p) => {
            const isSelected = p.name === currentPlatform.name;
            return (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedPlatform(p.name);
                  setDownloadComplete(false);
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#292931] border-[#6D4AFF] shadow-[0_0_12px_rgba(109,74,255,0.3)]'
                    : 'bg-[#1a1b22] border-white/5 hover:border-white/20 text-[#A2A4B5]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{p.iconName}</span>
                <span className="font-['Manrope'] text-[11px] font-semibold truncate w-full text-center">
                  {p.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Platform Details */}
        <div className="p-4 rounded-xl bg-[#1a1b22] border border-white/10 space-y-3 mb-6 font-['Manrope'] text-[13px]">
          <div className="flex justify-between items-center text-[#A2A4B5]">
            <span>Package Name</span>
            <span className="text-white font-['JetBrains_Mono'] text-[12px] font-medium">
              {currentPlatform.fileName}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#A2A4B5]">
            <span>Version / Arch</span>
            <span className="text-white font-['JetBrains_Mono'] text-[12px]">
              {currentPlatform.version} ({currentPlatform.architecture})
            </span>
          </div>

          <div className="flex justify-between items-center text-[#A2A4B5]">
            <span>File Size</span>
            <span className="text-[#00E5FF] font-['JetBrains_Mono'] text-[12px] font-semibold">
              {currentPlatform.fileSize}
            </span>
          </div>

          {/* SHA256 Checksum with copy */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-[#6C6F82] text-[11px] mb-1">
              <span>SHA-256 Checksum:</span>
              <button
                onClick={() => copySha(currentPlatform.sha256)}
                className="text-[#8E72FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[12px]">content_copy</span>
                <span>{copiedSha ? 'Copied!' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="font-['JetBrains_Mono'] text-[10px] text-[#A2A4B5] truncate bg-[#0d0e15] p-1.5 rounded border border-white/5">
              {currentPlatform.sha256}
            </div>
          </div>
        </div>

        {/* Download Action / Progress */}
        {isDownloading ? (
          <div className="space-y-2">
            <div className="flex justify-between font-['JetBrains_Mono'] text-[12px]">
              <span className="text-white">Connecting to Swiss CDN & downloading...</span>
              <span className="text-[#00E5FF]">{downloadProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#1e1f26] rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#6D4AFF] to-[#00E5FF] transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : downloadComplete ? (
          <div className="p-4 rounded-xl bg-[#00D182]/15 border border-[#00D182]/40 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#00D182] font-semibold">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Package Downloaded & WireGuard Profile Ready</span>
            </div>
            <p className="text-[12px] text-[#A2A4B5]">
              Run the installer or import the profile into your client to connect immediately.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-full bg-[#00D182] text-[#0B0C10] font-semibold text-[13px] hover:bg-emerald-400 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartDownload}
            className="w-full py-3.5 rounded-full bg-[#6D4AFF] hover:bg-[#5b37ea] text-white font-['Manrope'] text-[15px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(109,74,255,0.45)] hover:shadow-[0_0_32px_rgba(109,74,255,0.65)] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Download {currentPlatform.name} Client Free</span>
          </button>
        )}
      </div>
    </div>
  );
};
