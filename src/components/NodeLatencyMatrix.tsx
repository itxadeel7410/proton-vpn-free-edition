import React from 'react';
import { ServerNode } from '../types';

interface NodeLatencyMatrixProps {
  servers: ServerNode[];
  activeNode: ServerNode;
  onSelectNode: (node: ServerNode) => void;
  benchmarkedLatencies: Record<string, { latency: number; speed: number; tested: boolean }>;
  isBenchmarkingAll: boolean;
  onBenchmarkAll: () => void;
}

export const NodeLatencyMatrix: React.FC<NodeLatencyMatrixProps> = ({
  servers,
  activeNode,
  onSelectNode,
  benchmarkedLatencies,
  isBenchmarkingAll,
  onBenchmarkAll,
}) => {
  return (
    <div className="w-full flex flex-col space-y-3 p-4 rounded-xl bg-[#14151e] border border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00E5FF] text-[16px]">
              hub
            </span>
            <h4 className="font-['Space_Grotesk'] text-[15px] font-bold text-white">
              Global Node Latency Matrix
            </h4>
          </div>
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#6C6F82]">
            Visual comparison across free Swiss-certified datacenter endpoints
          </p>
        </div>

        <button
          id="btn-benchmark-all-nodes"
          onClick={onBenchmarkAll}
          disabled={isBenchmarkingAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#292931] hover:bg-[#343440] text-xs font-['JetBrains_Mono'] font-semibold text-[#00E5FF] border border-[#00E5FF]/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <span
            className={`material-symbols-outlined text-[15px] ${
              isBenchmarkingAll ? 'animate-spin text-[#FFB020]' : 'text-[#00E5FF]'
            }`}
          >
            {isBenchmarkingAll ? 'sync' : 'network_check'}
          </span>
          <span>{isBenchmarkingAll ? 'Probing All Nodes...' : 'Benchmark All Free Nodes'}</span>
        </button>
      </div>

      {/* Comparative Server List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {servers.map((node) => {
          const isActive = activeNode.id === node.id;
          const benchmark = benchmarkedLatencies[node.id];
          const currentLatency = benchmark?.latency || node.latency;
          const currentSpeed = benchmark?.speed || node.baselineDlSpeed;

          // Latency tier styling
          const latencyColor =
            currentLatency < 25
              ? 'text-[#00D182]'
              : currentLatency < 60
              ? 'text-[#00E5FF]'
              : currentLatency < 100
              ? 'text-[#FFB020]'
              : 'text-[#FF453A]';

          return (
            <div
              key={node.id}
              className={`p-2.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                isActive
                  ? 'bg-[#1e1f2b] border-[#6D4AFF] shadow-[0_0_12px_rgba(109,74,255,0.25)]'
                  : 'bg-[#1a1b24] border-white/5 hover:border-white/20'
              }`}
            >
              {/* Server Ident & Flag */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{node.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] text-[14px] font-bold text-white">
                      {node.country}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#6C6F82] px-1.5 py-0.2 rounded bg-black/40">
                      #{node.id.toUpperCase()}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-[#00D182]/20 text-[#00D182] font-['JetBrains_Mono'] text-[10px] font-bold">
                        ACTIVE PIPE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] text-[#6C6F82]">
                    <span>{node.city}</span>
                    <span>•</span>
                    <a
                      href={node.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[#00E5FF] hover:underline cursor-pointer"
                      title="View Datacenter Coordinates on Google Maps"
                    >
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      <span>{node.coordinates.lat.toFixed(2)}°, {node.coordinates.lng.toFixed(2)}° (Google Maps)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Latency bar & Switch Button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 font-['JetBrains_Mono'] text-[12px]">
                {/* Latency value */}
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-[#6C6F82] text-[10px]">RTT:</span>
                    <span className={`font-bold ${latencyColor}`}>
                      {currentLatency} ms
                    </span>
                  </div>
                  <span className="text-[#A2A4B5] text-[10px] block">
                    ~{currentSpeed.toFixed(0)} Mbps max
                  </span>
                </div>

                {/* Switch Action */}
                <button
                  id={`btn-switch-to-${node.id}`}
                  onClick={() => onSelectNode(node)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Manrope'] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'bg-[#00D182]/20 text-[#00D182] border border-[#00D182]/40'
                      : 'bg-[#292931] hover:bg-[#6D4AFF] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isActive ? 'check' : 'swap_horiz'}
                  </span>
                  <span>{isActive ? 'Selected' : 'Test Route'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
