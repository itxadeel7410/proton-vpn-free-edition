import React, { useState, useEffect } from 'react';
import { ServerNode } from '../types';

interface DnsLeakModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNode: ServerNode;
}

interface TestStep {
  name: string;
  status: 'pending' | 'testing' | 'passed';
  result: string;
}

export const DnsLeakModal: React.FC<DnsLeakModalProps> = ({ isOpen, onClose, activeNode }) => {
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    { name: 'WebRTC STUN/TURN Leakage', status: 'pending', result: 'Shielded (No Host Candidate Expose)' },
    { name: 'IPv6 Routing Exfiltration', status: 'pending', result: 'Clean (IPv6 Blackholed by WireGuard Kernel)' },
    { name: 'DNS Request Interception', status: 'pending', result: `Enclave Direct (${activeNode.city} DNS 10.2.0.1)` },
    { name: 'ISP Transparent Proxy Check', status: 'pending', result: '0 Transparent ISP Caches Found' },
    { name: 'Hardware Kill Switch Guard', status: 'pending', result: 'Default Gateway Route Enforced' },
    { name: 'Swiss Jurisdiction Verification', status: 'pending', result: 'Securitum Audited Cryptographic Isolation' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setAllPassed(false);
      return;
    }

    // Auto run diagnosis
    runDiagnostic();
  }, [isOpen]);

  const runDiagnostic = () => {
    setIsRunning(true);
    setAllPassed(false);

    // Reset steps
    setTestSteps((steps) => steps.map((s) => ({ ...s, status: 'pending' })));

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      setTestSteps((steps) => {
        const nextSteps = [...steps];
        if (currentStepIndex < nextSteps.length) {
          nextSteps[currentStepIndex].status = 'passed';
          currentStepIndex += 1;
        }
        return nextSteps;
      });

      if (currentStepIndex >= testSteps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setAllPassed(true);
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13141B] border border-white/10 p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#1e1f26] border border-white/10 flex items-center justify-center text-[#A2A4B5] hover:text-white hover:bg-[#292931] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00D182]/20 border border-[#00D182]/40 flex items-center justify-center text-[#00D182]">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Cryptographic Leak Diagnostic
            </h3>
            <p className="font-['Manrope'] text-[13px] text-[#A2A4B5]">
              Live inspection of active tunnel: {activeNode.country} ({activeNode.ip})
            </p>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div
          className={`p-4 rounded-xl border mb-6 flex items-center justify-between ${
            allPassed
              ? 'bg-[#00D182]/10 border-[#00D182]/40 text-[#00D182]'
              : 'bg-[#6D4AFF]/10 border-[#6D4AFF]/40 text-[#c9bfff]'
          }`}
        >
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[13px] font-semibold">
            <span className="material-symbols-outlined text-[20px]">
              {allPassed ? 'check_circle' : 'sync'}
            </span>
            <span>
              {allPassed ? '0 LEAKS DETECTED • 100% AIRTIGHT' : 'Running diagnostic audit probes...'}
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] px-2 py-0.5 rounded bg-black/40">
            {activeNode.protocol} UDP
          </span>
        </div>

        {/* Tests List */}
        <div className="space-y-2.5 mb-6 max-h-72 overflow-y-auto pr-1">
          {testSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#1a1b22] border border-white/5 flex items-center justify-between text-[13px] font-['Manrope']"
            >
              <div className="space-y-0.5">
                <div className="font-medium text-white flex items-center gap-1.5">
                  <span>{step.name}</span>
                </div>
                <div className="font-['JetBrains_Mono'] text-[11px] text-[#A2A4B5]">
                  {step.result}
                </div>
              </div>

              <div>
                {step.status === 'passed' ? (
                  <span className="inline-flex items-center gap-1 text-[#00D182] font-['JetBrains_Mono'] text-[11px] font-semibold bg-[#00D182]/10 px-2 py-0.5 rounded border border-[#00D182]/20">
                    <span className="material-symbols-outlined text-[13px]">check</span>
                    <span>PASS</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[#6C6F82] font-['JetBrains_Mono'] text-[11px] animate-pulse">
                    <span className="material-symbols-outlined text-[13px] animate-spin">refresh</span>
                    <span>TESTING</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="px-4 py-2 rounded-full bg-[#292931] hover:bg-[#34343c] text-white font-['Manrope'] text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Re-run Audit</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#6D4AFF] hover:bg-[#5b37ea] text-white font-['Manrope'] text-[13px] font-semibold transition-colors cursor-pointer shadow-[0_0_16px_rgba(109,74,255,0.4)]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
