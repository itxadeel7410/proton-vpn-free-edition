import React, { useState, useEffect, useRef } from 'react';
import { ServerNode, SpeedTestPhase, SpeedTestResult } from '../types';
import { FREE_SERVERS } from '../data/mockData';
import { SpeedometerGauge } from './SpeedometerGauge';
import { NodeLatencyMatrix } from './NodeLatencyMatrix';

interface HeroTelemetryProps {
  onOpenDownload: (platform?: string) => void;
  onOpenDnsLeakTest: () => void;
  activeNode: ServerNode;
  onSelectNode: (node: ServerNode) => void;
}

export const HeroTelemetry: React.FC<HeroTelemetryProps> = ({
  onOpenDownload,
  onOpenDnsLeakTest,
  activeNode,
  onSelectNode,
}) => {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnecting' | 'disconnected'>('connected');
  const [killSwitchArmed, setKillSwitchArmed] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(16939); // Starts at 04:42:19
  const [downloadSpeed, setDownloadSpeed] = useState<number>(activeNode.baselineDlSpeed || 342.8);
  const [uploadSpeed, setUploadSpeed] = useState<number>(activeNode.baselineUlSpeed || 118.4);
  const [sparklineHistory, setSparklineHistory] = useState<number[]>([70, 75, 68, 85, 78, 82, 55, 60, 40, 48, 30, 35, 18, 22, 15]);
  const [totalDataTransferred, setTotalDataTransferred] = useState(2.48); // in GB
  const [terminalNotification, setTerminalNotification] = useState<string | null>(null);

  // Speed Test Engine States
  const [activeTab, setActiveTab] = useState<'speedtest' | 'telemetry' | 'matrix'>('speedtest');
  const [speedTestPhase, setSpeedTestPhase] = useState<SpeedTestPhase>('idle');
  const [isSpeedTesting, setIsSpeedTesting] = useState(false);
  const [speedTestProgress, setSpeedTestProgress] = useState(0);
  const [gaugeSpeed, setGaugeSpeed] = useState<number>(activeNode.baselineDlSpeed || 342.8);
  const [testLatency, setTestLatency] = useState<number>(activeNode.latency);
  const [testJitter, setTestJitter] = useState<number>(1.8);
  const [autoBenchmarkOnSwitch, setAutoBenchmarkOnSwitch] = useState(true);
  const [benchmarkedLatencies, setBenchmarkedLatencies] = useState<Record<string, { latency: number; speed: number; tested: boolean }>>({
    'nl-14': { latency: 14, speed: 384.5, tested: true },
    'ch-01': { latency: 18, speed: 392.0, tested: true },
  });
  const [isBenchmarkingAll, setIsBenchmarkingAll] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<SpeedTestResult | null>(null);

  const speedTestTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speedTestIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for session duration
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
      setTotalDataTransferred((prev) => Number((prev + 0.0004).toFixed(3)));
    }, 1000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  // Ambient speed fluctuations during normal connected mode (when speed test is not actively running)
  useEffect(() => {
    if (connectionStatus !== 'connected' || isSpeedTesting) {
      if (connectionStatus !== 'connected') {
        setDownloadSpeed(0);
        setUploadSpeed(0);
      }
      return;
    }
    const interval = setInterval(() => {
      const baseDl = activeNode.baselineDlSpeed || 340;
      const baseUl = activeNode.baselineUlSpeed || 115;
      const dlVariation = (Math.random() - 0.5) * 16;
      const ulVariation = (Math.random() - 0.5) * 8;
      const newDl = Math.max(150, Math.min(480, baseDl + dlVariation));
      const newUl = Math.max(70, Math.min(160, baseUl + ulVariation));
      setDownloadSpeed(Number(newDl.toFixed(1)));
      setUploadSpeed(Number(newUl.toFixed(1)));
      setGaugeSpeed(Number(newDl.toFixed(1)));

      // Update sparkline points
      setSparklineHistory((prev) => {
        const nextVal = Math.max(10, Math.min(90, 100 - (newDl / 450) * 100 + (Math.random() - 0.5) * 8));
        return [...prev.slice(1), nextVal];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [connectionStatus, isSpeedTesting, activeNode]);

  // Format session seconds to hh:mm:ss
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Run real-time speed test on the specified node
  const startSpeedTest = (targetNode: ServerNode = activeNode) => {
    if (speedTestIntervalRef.current) clearInterval(speedTestIntervalRef.current);
    if (speedTestTimerRef.current) clearTimeout(speedTestTimerRef.current);

    setIsSpeedTesting(true);
    setSpeedTestProgress(0);
    setSpeedTestPhase('ping');
    setGaugeSpeed(0);
    setActiveTab('speedtest');

    const expectedLatency = targetNode.latency;
    const baselineDl = targetNode.baselineDlSpeed;
    const baselineUl = targetNode.baselineUlSpeed;

    setTerminalNotification(
      `⚡ Probing ICMP / WireGuard UDP latency to ${targetNode.country} (${targetNode.city})...`
    );

    let stepCounter = 0;
    const totalSteps = 40; // 40 steps * 100ms = 4.0s full realistic diagnostic run

    speedTestIntervalRef.current = setInterval(() => {
      stepCounter++;
      const currentPct = (stepCounter / totalSteps) * 100;
      setSpeedTestProgress(currentPct);

      // Phase 1: Ping / Latency Handshake (0% - 25%, 0 - 1.0s)
      if (stepCounter <= 10) {
        setSpeedTestPhase('ping');
        const simulatedPing = Math.round(expectedLatency + (Math.random() - 0.5) * 4);
        setTestLatency(Math.max(8, simulatedPing));
        setTestJitter(Number((1.2 + Math.random() * 1.5).toFixed(1)));
        setGaugeSpeed(Math.max(5, (simulatedPing % 30) * 2));
      }
      // Phase 2: Download Burst Testing (25% - 65%, 1.0s - 2.6s)
      else if (stepCounter <= 26) {
        setSpeedTestPhase('download');
        const dlRampRatio = (stepCounter - 10) / 16;
        // Ease-out ramp up to full capacity with minor packet fluctuation
        const currentTargetDl = baselineDl * Math.pow(dlRampRatio, 0.7);
        const fluctuation = (Math.random() - 0.5) * 20;
        const currentDl = Math.max(10, Math.min(500, currentTargetDl + fluctuation));
        setGaugeSpeed(Number(currentDl.toFixed(1)));
        setDownloadSpeed(Number(currentDl.toFixed(1)));

        // Feed burst into sparkline
        setSparklineHistory((prev) => {
          const val = Math.max(8, Math.min(92, 100 - (currentDl / 450) * 100));
          return [...prev.slice(1), val];
        });

        if (stepCounter === 18) {
          setTerminalNotification(
            `🚀 Download stream established: ${currentDl.toFixed(1)} Mbps via ${targetNode.protocol}`
          );
        }
      }
      // Phase 3: Upload Pipe Stream Testing (65% - 90%, 2.6s - 3.6s)
      else if (stepCounter <= 36) {
        setSpeedTestPhase('upload');
        const ulRampRatio = (stepCounter - 26) / 10;
        const currentTargetUl = baselineUl * Math.pow(ulRampRatio, 0.6);
        const ulFluctuation = (Math.random() - 0.5) * 12;
        const currentUl = Math.max(5, Math.min(200, currentTargetUl + ulFluctuation));
        setGaugeSpeed(Number(currentUl.toFixed(1)));
        setUploadSpeed(Number(currentUl.toFixed(1)));

        if (stepCounter === 30) {
          setTerminalNotification(
            `🔒 Upstream cryptographic pipe tested: ${currentUl.toFixed(1)} Mbps (Zero Bufferbloat)`
          );
        }
      }
      // Phase 4: Complete & Results Verification (90% - 100%, 3.6s - 4.0s)
      else {
        clearInterval(speedTestIntervalRef.current!);
        setSpeedTestPhase('complete');
        setIsSpeedTesting(false);
        setSpeedTestProgress(100);

        const finalLatency = expectedLatency;
        const finalDl = Number((baselineDl + (Math.random() - 0.5) * 8).toFixed(1));
        const finalUl = Number((baselineUl + (Math.random() - 0.5) * 5).toFixed(1));
        setGaugeSpeed(finalDl);
        setDownloadSpeed(finalDl);
        setUploadSpeed(finalUl);
        setTestLatency(finalLatency);

        const result: SpeedTestResult = {
          nodeId: targetNode.id,
          nodeName: `${targetNode.country} (${targetNode.city})`,
          latency: finalLatency,
          jitter: testJitter,
          downloadSpeed: finalDl,
          uploadSpeed: finalUl,
          grade: finalLatency < 35 ? 'A+' : finalLatency < 75 ? 'A' : 'B+',
          timestamp: new Date().toLocaleTimeString(),
        };

        setLastTestResult(result);
        setBenchmarkedLatencies((prev) => ({
          ...prev,
          [targetNode.id]: { latency: finalLatency, speed: finalDl, tested: true },
        }));

        setTerminalNotification(
          `✅ Speed Test Verified: ${targetNode.country} #${targetNode.id.toUpperCase()} • Ping: ${finalLatency}ms • DL: ${finalDl} Mbps • UL: ${finalUl} Mbps (Grade ${result.grade})`
        );
      }
    }, 100);
  };

  // Abort speed test
  const stopSpeedTest = () => {
    if (speedTestIntervalRef.current) clearInterval(speedTestIntervalRef.current);
    setIsSpeedTesting(false);
    setSpeedTestPhase('idle');
    setTerminalNotification('Speed test halted by user.');
    setGaugeSpeed(activeNode.baselineDlSpeed || 340);
  };

  // Benchmark all nodes sequentially
  const handleBenchmarkAllNodes = () => {
    setIsBenchmarkingAll(true);
    setActiveTab('matrix');
    setTerminalNotification('⚡ Pinging and profiling all 7 free Swiss nodes concurrently...');

    let completed = 0;
    FREE_SERVERS.forEach((node, idx) => {
      setTimeout(() => {
        const pingVariance = Math.round((Math.random() - 0.5) * 4);
        const dlVariance = (Math.random() - 0.5) * 10;
        const measuredLatency = Math.max(10, node.latency + pingVariance);
        const measuredSpeed = Number((node.baselineDlSpeed + dlVariance).toFixed(1));

        setBenchmarkedLatencies((prev) => ({
          ...prev,
          [node.id]: { latency: measuredLatency, speed: measuredSpeed, tested: true },
        }));

        completed++;
        if (completed === FREE_SERVERS.length) {
          setIsBenchmarkingAll(false);
          setTerminalNotification('✅ Multi-node benchmark complete. All 7 free nodes operational with 10 Gbps pipes.');
        }
      }, (idx + 1) * 350);
    });
  };

  // Toggle connection state with authentic progression
  const handleToggleConnection = () => {
    if (connectionStatus === 'connected') {
      setConnectionStatus('disconnecting');
      setTerminalNotification('Severing cryptographic tunnel...');
      setTimeout(() => {
        setConnectionStatus('disconnected');
        setTerminalNotification('Disconnected. Direct unencrypted IP exposed.');
        setTimeout(() => setTerminalNotification(null), 3000);
      }, 900);
    } else if (connectionStatus === 'disconnected') {
      setConnectionStatus('connecting');
      setTerminalNotification(`Handshaking WireGuard UDP with ${activeNode.city}...`);
      setTimeout(() => {
        setConnectionStatus('connected');
        setTerminalNotification(`Connected to ${activeNode.country} #${activeNode.id.toUpperCase()}`);
        setTimeout(() => setTerminalNotification(null), 3000);
      }, 1400);
    } else {
      setConnectionStatus('connecting');
      setTimeout(() => {
        setConnectionStatus('connected');
        setTerminalNotification('Reconnected to optimal route.');
        setTimeout(() => setTerminalNotification(null), 2500);
      }, 1000);
    }
  };

  // Switch server helper with visual speed test demo
  const handleServerPick = (node: ServerNode) => {
    onSelectNode(node);
    setTestLatency(node.latency);

    if (autoBenchmarkOnSwitch && connectionStatus === 'connected') {
      // Trigger live speed test to demonstrate latency & speed difference
      startSpeedTest(node);
    } else {
      setGaugeSpeed(node.baselineDlSpeed);
      setDownloadSpeed(node.baselineDlSpeed);
      setUploadSpeed(node.baselineUlSpeed);
      setTerminalNotification(`Switched tunnel to ${node.country} (${node.city}) • Ping: ${node.latency}ms`);
    }
  };

  // SVG path points generation for the sparkline
  const svgWidth = 500;
  const svgHeight = 100;
  const step = svgWidth / (sparklineHistory.length - 1);
  const dlPoints = sparklineHistory
    .map((val, idx) => `${idx * step},${val}`)
    .join(' ');
  const dlPolygonPoints = `0,100 ${dlPoints} ${svgWidth},100`;

  // Secondary upload points
  const ulPoints = sparklineHistory
    .map((val, idx) => `${idx * step},${Math.min(95, val + 25)}`)
    .join(' ');

  return (
    <div className="relative w-full overflow-hidden pt-6">
      {/* Top Ambient Glow Fields */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[780px] h-[380px] bg-[#6D4AFF]/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-80 left-8 w-[320px] h-[320px] bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-96 right-10 w-[300px] h-[300px] bg-[#8E72FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HERO SECTION CONTAINER */}
      <section className="relative w-full px-4 sm:px-8 pt-8 pb-16 max-w-[1280px] mx-auto" id="features">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Swiss Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1D27]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D182] animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-white tracking-wider uppercase">
              Swiss Privacy • 100% Free Forever • No Ads, No Logs
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl lg:text-[56px] lg:leading-[64px] font-bold text-white tracking-tight max-w-3xl">
            The best free VPN to take control of your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8E72FF] via-[#c9bfff] to-[#00E5FF]">
              online world
            </span>
          </h1>

          {/* Subhead */}
          <p className="font-['Manrope'] text-lg sm:text-xl text-[#A2A4B5] max-w-2xl leading-relaxed">
            Join over 100 million people using Proton VPN without paying a cent. Unlimited bandwidth, European privacy laws, and real-time network speed benchmarking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
            <button
              id="hero-btn-get-proton"
              onClick={() => onOpenDownload()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#6D4AFF] text-white font-['Manrope'] text-[15px] font-semibold shadow-[0_0_32px_rgba(109,74,255,0.45)] hover:bg-[#5a36ea] hover:shadow-[0_0_40px_rgba(109,74,255,0.65)] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span>Get Proton VPN Free</span>
            </button>

            <button
              id="hero-btn-speed-test"
              onClick={() => {
                setActiveTab('speedtest');
                startSpeedTest();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#1e1f26] border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#252632] hover:border-[#00E5FF] transition-all font-['Manrope'] text-[15px] font-semibold cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.15)]"
            >
              <span className="material-symbols-outlined text-[18px]">speed</span>
              <span>Run Live Speed Test</span>
            </button>
          </div>

          {/* Reassurance Checkmarks */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 font-['JetBrains_Mono'] text-[13px] text-[#6C6F82] pt-1">
            <span className="inline-flex items-center gap-1.5 text-[#e3e1ec]">
              <span className="material-symbols-outlined text-[#00D182] text-[16px]">check_circle</span>
              No credit card required
            </span>
            <span className="text-[#484556]">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#e3e1ec]">
              <span className="material-symbols-outlined text-[#00D182] text-[16px]">check_circle</span>
              Strictly zero logs
            </span>
            <span className="text-[#484556]">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#e3e1ec]">
              <span className="material-symbols-outlined text-[#00D182] text-[16px]">check_circle</span>
              Unlimited data usage
            </span>
          </div>

          {/* Third Party Endorsement Ribbons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full pt-4 max-w-3xl">
            <div className="p-3 rounded-xl bg-[#13141B] border border-white/10 flex flex-col items-center justify-center text-center group hover:border-[#00E5FF]/40 transition-colors">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-white">Which?</span>
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#00E5FF] uppercase tracking-wider">
                Endorsed Best Buy
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#13141B] border border-white/10 flex flex-col items-center justify-center text-center group hover:border-[#8E72FF]/40 transition-colors">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-white">100M+</span>
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#A2A4B5] uppercase tracking-wider">
                Global Users
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#13141B] border border-white/10 flex flex-col items-center justify-center text-center group hover:border-[#00D182]/40 transition-colors">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-white">Securitum</span>
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#00D182] uppercase tracking-wider">
                Audited No-Logs
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#13141B] border border-white/10 flex flex-col items-center justify-center text-center group hover:border-[#8E72FF]/40 transition-colors">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-white">CH FADP</span>
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#8E72FF] uppercase tracking-wider">
                Swiss Protected
              </span>
            </div>
          </div>
        </div>

        {/* HERO TERMINAL & SPEED TEST TELEMETRY INTERFACE MOCKUP */}
        <div className="mt-12 relative mx-auto max-w-5xl rounded-2xl bg-[#13141B] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden" id="hero-telemetry-console">
          {/* Mockup Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#0d0e15] border-b border-white/10 gap-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setTerminalNotification('Minimized to secure background tray.')}
                  title="Close / Tray"
                  className="w-3 h-3 rounded-full bg-[#FF453A]/80 hover:bg-[#FF453A] cursor-pointer transition-colors"
                ></button>
                <button
                  onClick={() => setTerminalNotification('Diagnostics window opened.')}
                  title="Diagnostics"
                  className="w-3 h-3 rounded-full bg-[#FFB020]/80 hover:bg-[#FFB020] cursor-pointer transition-colors"
                ></button>
                <button
                  onClick={() => setTerminalNotification('Full-screen cryptographic telemetry mode.')}
                  title="Expand"
                  className="w-3 h-3 rounded-full bg-[#00D182]/80 hover:bg-[#00D182] cursor-pointer transition-colors"
                ></button>
              </div>
              <span className="font-['JetBrains_Mono'] text-[12px] text-[#6C6F82] ml-1">
                proton-vpn-desktop-v5.4.1 [{connectionStatus === 'connected' ? 'FREE_TIER_ACTIVE' : 'STANDBY'}]
              </span>
            </div>

            {/* View Tab Switcher */}
            <div className="flex items-center gap-1 bg-[#1a1b22] p-1 rounded-xl border border-white/10 text-[11px] font-['JetBrains_Mono']">
              <button
                id="tab-speed-test"
                onClick={() => setActiveTab('speedtest')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'speedtest'
                    ? 'bg-[#6D4AFF] text-white font-semibold shadow-[0_0_12px_rgba(109,74,255,0.4)]'
                    : 'text-[#A2A4B5] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">speed</span>
                <span>Speed Test</span>
              </button>

              <button
                id="tab-telemetry"
                onClick={() => setActiveTab('telemetry')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'telemetry'
                    ? 'bg-[#6D4AFF] text-white font-semibold shadow-[0_0_12px_rgba(109,74,255,0.4)]'
                    : 'text-[#A2A4B5] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">timeline</span>
                <span>Live Route</span>
              </button>

              <button
                id="tab-latency-matrix"
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'matrix'
                    ? 'bg-[#6D4AFF] text-white font-semibold shadow-[0_0_12px_rgba(109,74,255,0.4)]'
                    : 'text-[#A2A4B5] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">hub</span>
                <span>Latency Matrix</span>
              </button>
            </div>
          </div>

          {/* Real-time feedback notification banner */}
          {terminalNotification && (
            <div className="bg-[#6D4AFF]/20 border-b border-[#6D4AFF]/40 px-4 py-1.5 text-center font-['JetBrains_Mono'] text-[12px] text-[#f4eeff] animate-in fade-in duration-200">
              {terminalNotification}
            </div>
          )}

          {/* Terminal Body Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 sm:p-6">
            {/* Left Column: Quick Connect & Active Node Telemetry */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4 p-4 rounded-xl bg-[#1a1b22] border border-white/10">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#6C6F82] uppercase tracking-wider">
                    Active VPN Node
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#231656] text-[#8E72FF] font-['JetBrains_Mono'] text-[11px] font-semibold">
                    100% Free Node
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1e1f26] border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {activeNode.flag}
                  </div>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white leading-tight">
                      {activeNode.country} #{activeNode.id.toUpperCase()}
                    </h3>
                    <p className="font-['JetBrains_Mono'] text-[12px] text-[#6C6F82]">
                      {activeNode.city} • {connectionStatus === 'connected' ? activeNode.ip : '82.165.20.104 (Original)'}
                    </p>
                  </div>
                </div>

                {/* Google Maps Datacenter Pin Link */}
                <div className="mt-3 p-2 rounded-lg bg-[#14151e] border border-white/5 flex items-center justify-between font-['JetBrains_Mono'] text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#A2A4B5]">
                    <span className="material-symbols-outlined text-[#00E5FF] text-[15px]">pin_drop</span>
                    <span className="truncate">{activeNode.coordinates.lat.toFixed(2)}°, {activeNode.coordinates.lng.toFixed(2)}°</span>
                  </div>
                  <a
                    href={activeNode.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00E5FF] hover:underline font-semibold flex items-center gap-0.5"
                    title="Open server datacenter in Google Maps"
                  >
                    <span>Google Maps</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Telemetry rows */}
              <div className="space-y-2 font-['JetBrains_Mono'] text-[12px]">
                <div className="flex justify-between py-1.5 border-b border-white/5 text-[#A2A4B5]">
                  <span>Session Duration</span>
                  <span className="text-white font-medium">
                    {connectionStatus === 'connected' ? formatTime(sessionSeconds) : '--:--:--'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5 text-[#A2A4B5]">
                  <span>Kill Switch</span>
                  <button
                    onClick={() => setKillSwitchArmed(!killSwitchArmed)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      killSwitchArmed
                        ? 'bg-[#00D182]/15 text-[#00D182]'
                        : 'bg-[#FFB020]/15 text-[#FFB020]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {killSwitchArmed ? 'lock' : 'lock_open'}
                    </span>
                    {killSwitchArmed ? 'ARMED' : 'BYPASS'}
                  </button>
                </div>

                <div className="flex justify-between py-1.5 border-b border-white/5 text-[#A2A4B5]">
                  <span>Bandwidth Cap</span>
                  <span className="text-[#00E5FF] font-bold">
                    UNLIMITED <span className="text-[#6C6F82] font-normal">({totalDataTransferred} GB)</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 text-[#A2A4B5]">
                  <span>Auto-Test on Switch</span>
                  <button
                    onClick={() => setAutoBenchmarkOnSwitch(!autoBenchmarkOnSwitch)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      autoBenchmarkOnSwitch
                        ? 'bg-[#6D4AFF]/20 text-[#8E72FF] border border-[#6D4AFF]/40'
                        : 'bg-white/5 text-[#6C6F82]'
                    }`}
                  >
                    {autoBenchmarkOnSwitch ? 'ENABLED' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Connect / Disconnect Action Button */}
              <div className="pt-2">
                <button
                  id="btn-toggle-connection"
                  onClick={handleToggleConnection}
                  className={`w-full py-3 px-4 rounded-full font-['Manrope'] text-[14px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    connectionStatus === 'connected'
                      ? 'bg-[#292931] hover:bg-[#34343c] text-white border border-white/10'
                      : connectionStatus === 'connecting' || connectionStatus === 'disconnecting'
                      ? 'bg-[#6D4AFF]/50 text-white animate-pulse'
                      : 'bg-[#6D4AFF] hover:bg-[#5b37ea] text-white shadow-[0_0_24px_rgba(109,74,255,0.4)]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      connectionStatus === 'connected'
                        ? 'text-[#00D182]'
                        : connectionStatus === 'disconnected'
                        ? 'text-[#FF453A]'
                        : 'text-[#FFB020] animate-spin'
                    }`}
                  >
                    power_settings_new
                  </span>
                  <span>
                    {connectionStatus === 'connected'
                      ? 'Connected (Quick Reconnect)'
                      : connectionStatus === 'disconnecting'
                      ? 'Disconnecting Tunnel...'
                      : connectionStatus === 'connecting'
                      ? 'Connecting to Best Server...'
                      : 'Connect to Swiss VPN'}
                  </span>
                </button>
              </div>
            </div>

            {/* Center/Right: Interactive Speed Test Gauge / Sparkline / Matrix */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4 p-4 sm:p-5 rounded-xl bg-[#1a1b22] border border-white/10">
              {/* Tab 1: Real-Time Speedometer Speed Test */}
              {activeTab === 'speedtest' && (
                <div className="w-full flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#6C6F82] uppercase tracking-wider">
                        Live Speedometer Benchmark
                      </span>
                      <h4 className="font-['Space_Grotesk'] text-lg font-semibold text-white">
                        Network Latency & Throughput Tester
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-['JetBrains_Mono'] font-bold ${
                          activeNode.latency < 25
                            ? 'bg-[#00D182]/20 text-[#00D182]'
                            : activeNode.latency < 60
                            ? 'bg-[#00E5FF]/20 text-[#00E5FF]'
                            : 'bg-[#FFB020]/20 text-[#FFB020]'
                        }`}
                      >
                        Ping: {testLatency}ms
                      </span>
                    </div>
                  </div>

                  {/* Speedometer Gauge Component */}
                  <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/5">
                    <SpeedometerGauge
                      currentSpeed={gaugeSpeed}
                      maxSpeed={500}
                      phase={speedTestPhase}
                      latency={testLatency}
                      jitter={testJitter}
                      progress={speedTestProgress}
                      isRunning={isSpeedTesting}
                      onStartTest={() => startSpeedTest(activeNode)}
                      onStopTest={stopSpeedTest}
                      activeNodeCountry={activeNode.country}
                      activeNodeCity={activeNode.city}
                    />
                  </div>

                  {/* Free Server Node Quick-Switch Bar with Live Latency */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#6C6F82] mb-1.5 uppercase tracking-wider">
                      <span>Switch Node to Test Latency Differential:</span>
                      {autoBenchmarkOnSwitch && (
                        <span className="text-[#00E5FF] lowercase font-normal">
                          ⚡ auto-tests speed on switch
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-['JetBrains_Mono'] text-[12px]">
                      {FREE_SERVERS.slice(0, 4).map((node) => {
                        const isCurrent = activeNode.id === node.id;
                        return (
                          <button
                            key={node.id}
                            id={`quick-node-${node.id}`}
                            onClick={() => handleServerPick(node)}
                            className={`p-2 rounded-lg flex items-center justify-between transition-all cursor-pointer text-left border ${
                              isCurrent
                                ? 'bg-[#292931] border-[#6D4AFF] shadow-[0_0_12px_rgba(109,74,255,0.3)]'
                                : 'bg-[#1e1f26] border-white/5 hover:border-white/20 hover:bg-[#252630]'
                            }`}
                          >
                            <span className="text-white truncate font-medium text-[11px]">
                              {node.flag} {node.country}
                            </span>
                            <span
                              className={`text-[11px] font-bold ${
                                node.latency < 30
                                  ? 'text-[#00D182]'
                                  : node.latency < 70
                                  ? 'text-[#00E5FF]'
                                  : 'text-[#FFB020]'
                              }`}
                            >
                              {node.latency}ms
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Live Telemetry Sparkline & Graph */}
              {activeTab === 'telemetry' && (
                <div className="w-full flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#6C6F82] uppercase tracking-wider">
                        Live Cryptographic Route
                      </span>
                      <h4 className="font-['Space_Grotesk'] text-lg font-semibold text-white">
                        Encrypted WireGuard Pipeline
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-right font-['JetBrains_Mono'] text-[12px]">
                      <div>
                        <span className="text-[#00E5FF] font-semibold block">
                          DL: {downloadSpeed} Mbps
                        </span>
                        <span className="text-[#8E72FF] font-semibold block">
                          UL: {uploadSpeed} Mbps
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vector Chart & Nodes */}
                  <div className="w-full h-44 bg-[#0d0e15] rounded-xl p-3 relative overflow-hidden flex flex-col justify-end border border-white/5">
                    <div className="absolute inset-0 opacity-10 flex items-center justify-around pointer-events-none">
                      <div className="w-px h-full bg-[#938ea2]"></div>
                      <div className="w-px h-full bg-[#938ea2]"></div>
                      <div className="w-px h-full bg-[#938ea2]"></div>
                      <div className="w-px h-full bg-[#938ea2]"></div>
                    </div>

                    {/* SVG Sparkline */}
                    <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                      <defs>
                        <linearGradient id="dl-grad" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="ul-grad" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#8E72FF" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#8E72FF" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fills */}
                      {connectionStatus === 'connected' && (
                        <polygon fill="url(#dl-grad)" points={dlPolygonPoints} className="transition-all duration-700" />
                      )}

                      {/* Trace 1: Download */}
                      <polyline
                        points={connectionStatus === 'connected' ? dlPoints : '0,90 500,90'}
                        fill="none"
                        stroke={connectionStatus === 'connected' ? '#00E5FF' : '#FF453A'}
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        className="transition-all duration-700"
                      />

                      {/* Trace 2: Upload */}
                      {connectionStatus === 'connected' && (
                        <polyline
                          points={ulPoints}
                          fill="none"
                          stroke="#8E72FF"
                          strokeDasharray="4,4"
                          strokeLinecap="round"
                          strokeWidth="2"
                          className="transition-all duration-700"
                        />
                      )}
                    </svg>

                    <div className="flex justify-between items-center text-[#6C6F82] font-['JetBrains_Mono'] text-[10px] pt-1 border-t border-white/5">
                      <span>T-60s</span>
                      <span>T-45s</span>
                      <span>T-30s</span>
                      <span>T-15s</span>
                      <span className="text-[#00E5FF] font-bold">
                        {connectionStatus === 'connected'
                          ? `LIVE (${activeNode.latency}ms Latency • ${activeNode.city})`
                          : 'OFFLINE'}
                      </span>
                    </div>
                  </div>

                  {/* Free Server Node Pool Pills */}
                  <div>
                    <div className="text-[11px] font-['JetBrains_Mono'] text-[#6C6F82] mb-1.5 uppercase tracking-wider">
                      Quick Switch Node Pool:
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-['JetBrains_Mono'] text-[12px]">
                      {FREE_SERVERS.slice(0, 3).map((node) => {
                        const isCurrent = activeNode.id === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => handleServerPick(node)}
                            className={`p-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer text-left border ${
                              isCurrent
                                ? 'bg-[#292931] border-[#6D4AFF] shadow-[0_0_12px_rgba(109,74,255,0.3)]'
                                : 'bg-[#1e1f26] border-white/5 hover:border-white/20 hover:bg-[#252630]'
                            }`}
                          >
                            <span className="text-white truncate font-medium">
                              {node.flag} {node.country}
                            </span>
                            <span
                              className={`text-[11px] font-semibold ${
                                node.latency < 30
                                  ? 'text-[#00D182]'
                                  : node.latency < 80
                                  ? 'text-[#00D182]'
                                  : 'text-[#00E5FF]'
                              }`}
                            >
                              {node.latency}ms
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Comparative Latency Matrix with Google Maps integration */}
              {activeTab === 'matrix' && (
                <NodeLatencyMatrix
                  servers={FREE_SERVERS}
                  activeNode={activeNode}
                  onSelectNode={handleServerPick}
                  benchmarkedLatencies={benchmarkedLatencies}
                  isBenchmarkingAll={isBenchmarkingAll}
                  onBenchmarkAll={handleBenchmarkAllNodes}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
