import React, { useState } from 'react';
import { ServerNode } from '../types';
import { FREE_SERVERS } from '../data/mockData';

interface ServerLocationsSectionProps {
  activeNode: ServerNode;
  onSelectNode: (node: ServerNode) => void;
}

export const ServerLocationsSection: React.FC<ServerLocationsSectionProps> = ({
  activeNode,
  onSelectNode,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Europe' | 'North America' | 'Asia'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [justConnectedId, setJustConnectedId] = useState<string | null>(null);

  const filteredServers = FREE_SERVERS.filter((server) => {
    const matchesRegion = selectedRegion === 'All' || server.region === selectedRegion;
    const matchesSearch =
      server.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleConnect = (server: ServerNode) => {
    onSelectNode(server);
    setJustConnectedId(server.id);
    setTimeout(() => setJustConnectedId(null), 2500);

    // Smooth scroll to top terminal if clicked
    const heroElem = document.getElementById('features');
    if (heroElem) {
      heroElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#13141B] border-y border-white/10 py-16 sm:py-20 px-4 sm:px-8" id="servers-showcase">
      <div className="max-w-[1280px] mx-auto space-y-8 sm:space-y-10">
        {/* Header & Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#00E5FF] uppercase tracking-wider">
              Free Global Routing Network
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
              High-Speed Free Server Locations
            </h2>
            <p className="font-['Manrope'] text-base text-[#A2A4B5]">
              Connect to dedicated, high-capacity servers optimized for zero logging, low latency, and unthrottled throughput across key global hubs.
            </p>
          </div>

          <div className="font-['JetBrains_Mono'] text-[12px] text-[#00D182] flex items-center gap-2 bg-[#1e1f26] px-4 py-2 rounded-full border border-white/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#00D182] animate-pulse"></span>
            <span>{FREE_SERVERS.length} Core Free Hubs • WireGuard Ready • 10 Gbps Links</span>
          </div>
        </div>

        {/* Filters and search bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1e1f26] border border-white/10 w-full sm:w-auto overflow-x-auto">
            {(['All', 'Europe', 'North America', 'Asia'] as const).map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-['Manrope'] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-[#6D4AFF] text-white shadow-[0_0_12px_rgba(109,74,255,0.4)]'
                    : 'text-[#A2A4B5] hover:text-white hover:bg-white/5'
                }`}
              >
                {region === 'All' ? 'All Free Hubs' : region}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6C6F82] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search country or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1b22] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#6C6F82] focus:outline-none focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF] transition-colors"
            />
          </div>
        </div>

        {/* Free Servers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredServers.map((server) => {
            const isActive = activeNode.id === server.id;
            const isJustConnected = justConnectedId === server.id;

            return (
              <div
                key={server.id}
                className={`p-4 rounded-xl bg-[#1a1b22] border transition-all flex flex-col justify-between group ${
                  isActive
                    ? 'border-[#6D4AFF] shadow-[0_0_20px_rgba(109,74,255,0.3)] bg-[#1e1f26]'
                    : 'border-white/10 hover:border-[#00E5FF]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{server.flag}</span>
                    <span className="font-['JetBrains_Mono'] text-[11px] font-semibold px-2 py-0.5 rounded bg-[#1e1f26] text-[#00E5FF] border border-white/5">
                      {isActive ? 'ACTIVE ROUTE' : 'FREE NODE'}
                    </span>
                  </div>

                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    {server.country}
                  </h4>
                  <p className="font-['JetBrains_Mono'] text-[12px] text-[#6C6F82]">
                    {server.city}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-2 font-['JetBrains_Mono'] text-[12px]">
                  <div className="flex justify-between text-[#A2A4B5]">
                    <span>Latency</span>
                    <span
                      className={`font-semibold ${
                        server.latency < 30
                          ? 'text-[#00D182]'
                          : server.latency < 70
                          ? 'text-[#00D182]'
                          : 'text-[#00E5FF]'
                      }`}
                    >
                      {server.latency} ms
                    </span>
                  </div>

                  <div className="flex justify-between text-[#A2A4B5]">
                    <span>Port Speed</span>
                    <span className="text-white font-medium">{server.portSpeed}</span>
                  </div>

                  <div className="flex justify-between text-[#A2A4B5]">
                    <span>Protocol</span>
                    <span className="text-[#8E72FF]">{server.protocol}</span>
                  </div>

                  {/* Server load indicator */}
                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] text-[#6C6F82] mb-1">
                      <span>Server Capacity</span>
                      <span>{server.load}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#13141B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00D182] to-[#00E5FF] rounded-full"
                        style={{ width: `${server.load}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Google Maps Datacenter Pin */}
                  <div className="pt-1 flex items-center justify-between text-[10px] text-[#6C6F82] border-t border-white/5 pt-2">
                    <span className="truncate">{server.coordinates.lat.toFixed(1)}°, {server.coordinates.lng.toFixed(1)}°</span>
                    <a
                      href={server.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00E5FF] hover:underline flex items-center gap-0.5"
                      title="View Datacenter on Google Maps"
                    >
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      <span>Maps</span>
                    </a>
                  </div>

                  {/* Connect Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleConnect(server)}
                      className={`w-full py-2 px-3 rounded-lg text-[13px] font-['Manrope'] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-[#00D182]/20 text-[#00D182] border border-[#00D182]/40'
                          : 'bg-[#292931] hover:bg-[#6D4AFF] text-white hover:shadow-[0_0_16px_rgba(109,74,255,0.4)]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isActive ? 'check_circle' : 'speed'}
                      </span>
                      <span>
                        {isJustConnected
                          ? 'Routing Pipeline...'
                          : isActive
                          ? 'Active Route'
                          : 'Test Route Speed'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
