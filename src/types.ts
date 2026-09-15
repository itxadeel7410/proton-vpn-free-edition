export interface ServerNode {
  id: string;
  country: string;
  code: string;
  flag: string;
  city: string;
  ip: string;
  latency: number;
  portSpeed: string;
  protocol: 'WireGuard' | 'OpenVPN' | 'Stealth';
  load: number;
  isFree: boolean;
  region: 'Europe' | 'North America' | 'Asia';
  coordinates: { lat: number; lng: number };
  googleMapsUrl: string;
  baselineDlSpeed: number;
  baselineUlSpeed: number;
}

export type SpeedTestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'complete';

export interface SpeedTestResult {
  nodeId: string;
  nodeName: string;
  latency: number;
  jitter: number;
  downloadSpeed: number;
  uploadSpeed: number;
  grade: 'A+' | 'A' | 'B+';
  timestamp: string;
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnecting' | 'disconnected';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ReviewItem {
  outlet: string;
  award: string;
  quote: string;
  rating: number;
}

export interface PlatformItem {
  name: string;
  iconName: string;
  description: string;
  fileName: string;
  fileSize: string;
  version: string;
  sha256: string;
  architecture: string;
}
