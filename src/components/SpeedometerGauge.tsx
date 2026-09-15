import React from 'react';
import { SpeedTestPhase } from '../types';

interface SpeedometerGaugeProps {
  currentSpeed: number; // in Mbps
  maxSpeed?: number; // default 500 Mbps
  phase: SpeedTestPhase;
  latency: number; // ms
  jitter: number; // ms
  progress: number; // 0 to 100
  isRunning: boolean;
  onStartTest: () => void;
  onStopTest?: () => void;
  activeNodeCountry: string;
  activeNodeCity: string;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  currentSpeed,
  maxSpeed = 500,
  phase,
  latency,
  jitter,
  progress,
  isRunning,
  onStartTest,
  onStopTest,
  activeNodeCountry,
  activeNodeCity,
}) => {
  // Speed percentage for the gauge angle (from -120 deg to +120 deg => 240 deg total arc)
  const normalizedSpeed = Math.min(maxSpeed, Math.max(0, currentSpeed));
  const speedRatio = normalizedSpeed / maxSpeed;
  const needleAngle = -120 + speedRatio * 240;

  // Arc math for SVG path
  // Radius = 100, Center = (140, 140)
  // Arc starts at -120 deg (150 in standard SVG coords: x = 140 + 100*cos(150), y = 140 + 100*sin(150))
  const radius = 96;
  const cx = 140;
  const cy = 135;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // Background arc: -120 deg to +120 deg
  const bgArcPath = describeArc(cx, cy, radius, -120, 120);

  // Active progress arc: -120 deg to (-120 + speedRatio * 240)
  const activeEndAngle = -120 + Math.max(1, speedRatio * 240);
  const activeArcPath = describeArc(cx, cy, radius, -120, activeEndAngle);

  // Tick marks (0, 100, 200, 300, 400, 500)
  const ticks = [0, 100, 200, 300, 400, 500];

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      {/* Top Phase Header */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-white/10 text-[11px] font-['JetBrains_Mono']">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-[#00E5FF] animate-ping' : 'bg-[#00D182]'
            }`}
          ></span>
          <span className="text-[#A2A4B5] uppercase tracking-wider">
            {phase === 'idle'
              ? 'Ready for Benchmark'
              : phase === 'ping'
              ? 'Probing Handshake & Latency'
              : phase === 'download'
              ? 'Measuring Download Stream'
              : phase === 'upload'
              ? 'Measuring Upload Pipe'
              : 'Speed Benchmark Complete'}
          </span>
        </div>

        <span className="text-[#6D4AFF] font-bold">
          {isRunning ? `${Math.round(progress)}%` : 'WIREGUARD 10G'}
        </span>
      </div>

      {/* Radial Speedometer Gauge */}
      <div className="relative w-[280px] h-[210px] flex items-center justify-center my-1 select-none">
        <svg
          viewBox="0 0 280 230"
          className="w-full h-full overflow-visible"
          id="speedometer-svg"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6D4AFF" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#00D182" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer track ring */}
          <path
            d={bgArcPath}
            fill="none"
            stroke="#212330"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Tick lines & labels */}
          {ticks.map((t) => {
            const angle = -120 + (t / maxSpeed) * 240;
            const pInner = polarToCartesian(cx, cy, radius - 14, angle);
            const pOuter = polarToCartesian(cx, cy, radius - 4, angle);
            const pText = polarToCartesian(cx, cy, radius - 26, angle);

            return (
              <g key={t}>
                <line
                  x1={pInner.x}
                  y1={pInner.y}
                  x2={pOuter.x}
                  y2={pOuter.y}
                  stroke="#484556"
                  strokeWidth="1.5"
                />
                <text
                  x={pText.x}
                  y={pText.y + 3}
                  fill="#6C6F82"
                  fontSize="9"
                  fontFamily="'JetBrains Mono', monospace"
                  textAnchor="middle"
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* Dynamic filled arc with gradient & glow */}
          {speedRatio > 0 && (
            <path
              d={activeArcPath}
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#gaugeGlow)"
              className="transition-all duration-150 ease-out"
            />
          )}

          {/* Pivot Center Hub */}
          <circle cx={cx} cy={cy} r="16" fill="#13141B" stroke="#6D4AFF" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="6" fill="#00E5FF" />

          {/* Dynamic Needle */}
          <g
            transform={`rotate(${needleAngle} ${cx} ${cy})`}
            className="transition-transform duration-150 ease-out"
          >
            <polygon
              points={`${cx - 3},${cy} ${cx + 3},${cy} ${cx},${cy - radius + 8}`}
              fill="#00E5FF"
              filter="url(#gaugeGlow)"
            />
            <circle cx={cx} cy={cy - radius + 8} r="2.5" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Central Monospace Digital Readout Overlay */}
        <div className="absolute top-[125px] flex flex-col items-center pointer-events-none">
          <div className="flex items-baseline gap-1">
            <span className="font-['JetBrains_Mono'] text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              {currentSpeed.toFixed(1)}
            </span>
            <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#00E5FF]">
              Mbps
            </span>
          </div>

          <span className="font-['JetBrains_Mono'] text-[11px] text-[#A2A4B5] mt-0.5">
            {phase === 'ping'
              ? `PING: ${latency} ms`
              : phase === 'download'
              ? 'DOWNLOAD TESTING'
              : phase === 'upload'
              ? 'UPLOAD TESTING'
              : `${activeNodeCity}`}
          </span>
        </div>
      </div>

      {/* Metrics Row: Latency, Jitter, Loss */}
      <div className="w-full grid grid-cols-3 gap-2 pt-1 pb-3 font-['JetBrains_Mono'] text-[11px]">
        <div className="p-2 rounded-lg bg-[#14151e] border border-white/5 text-center">
          <span className="text-[#6C6F82] block text-[10px] uppercase">Latency</span>
          <span
            className={`font-bold text-[13px] ${
              latency < 30 ? 'text-[#00D182]' : latency < 70 ? 'text-[#00E5FF]' : 'text-[#FFB020]'
            }`}
          >
            {latency} ms
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#14151e] border border-white/5 text-center">
          <span className="text-[#6C6F82] block text-[10px] uppercase">Jitter</span>
          <span className="text-white font-semibold text-[13px]">
            ±{jitter.toFixed(1)} ms
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#14151e] border border-white/5 text-center">
          <span className="text-[#6C6F82] block text-[10px] uppercase">Packet Loss</span>
          <span className="text-[#00D182] font-semibold text-[13px]">
            0.00%
          </span>
        </div>
      </div>

      {/* Progress bar across phases */}
      {isRunning && (
        <div className="w-full mb-3">
          <div className="flex justify-between text-[10px] font-['JetBrains_Mono'] text-[#6C6F82] mb-1">
            <span className={phase === 'ping' ? 'text-[#00E5FF] font-bold' : ''}>1. PING</span>
            <span className={phase === 'download' ? 'text-[#00E5FF] font-bold' : ''}>2. DOWNLOAD</span>
            <span className={phase === 'upload' ? 'text-[#8E72FF] font-bold' : ''}>3. UPLOAD</span>
            <span className={phase === 'complete' ? 'text-[#00D182] font-bold' : ''}>4. VERIFIED</span>
          </div>
          <div className="w-full h-1.5 bg-[#14151e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6D4AFF] via-[#00E5FF] to-[#00D182] transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full flex items-center gap-2">
        {isRunning ? (
          <button
            id="btn-cancel-speed-test"
            onClick={onStopTest}
            className="w-full py-2.5 px-4 rounded-xl bg-[#292931] hover:bg-[#383844] text-[#FF453A] font-['Manrope'] text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#FF453A]/30"
          >
            <span className="material-symbols-outlined text-[16px]">stop_circle</span>
            <span>Abort Speed Test</span>
          </button>
        ) : (
          <button
            id="btn-start-speed-test"
            onClick={onStartTest}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#5534e6] hover:from-[#5b37ea] hover:to-[#4a2ad1] text-white font-['Manrope'] text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(109,74,255,0.4)] active:scale-98"
          >
            <span className="material-symbols-outlined text-[17px] text-[#00E5FF]">speed</span>
            <span>Run Real-Time Speed Test ({activeNodeCountry})</span>
          </button>
        )}
      </div>
    </div>
  );
};
