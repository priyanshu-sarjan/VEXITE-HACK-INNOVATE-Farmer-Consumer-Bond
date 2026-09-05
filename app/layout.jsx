import './globals.css';

export const metadata = {
  title: 'AgriFresh 3D Spatial Architecture | SIH 2026 (SIH26033)',
  description: 'Smart Solar Micro-Cold Hubs, ESP32 IoT Telemetry, Autonomous MCP AI Logistics & Web3 Smart Escrow for Ministry of Consumer Affairs, Food & Public Distribution.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="" 
        />
      </head>
      <body className="bg-[#121316] text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
