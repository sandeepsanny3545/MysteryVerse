import React from 'react';
import { Shield, Sparkles, Terminal, FileCode2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-noir-800 bg-noir-950/90 py-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand statement */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          <span className="font-serif font-semibold text-slate-300 tracking-wider">
            MysteryVerse
          </span>
          <span className="text-noir-700">|</span>
          <span>AI-Powered Mystery Investigation Bureau</span>
        </div>

        {/* Center Tech Stack Pills */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 bg-noir-900 px-2 py-0.5 rounded border border-noir-800">
            <Sparkles className="w-3 h-3 text-amber-400" /> React + Vite
          </span>
          <span className="flex items-center gap-1 bg-noir-900 px-2 py-0.5 rounded border border-noir-800">
            <Terminal className="w-3 h-3 text-cyan-400" /> Tailwind CSS
          </span>
          <span className="flex items-center gap-1 bg-noir-900 px-2 py-0.5 rounded border border-noir-800">
            <FileCode2 className="w-3 h-3 text-crimson-400" /> Gemini Intelligence
          </span>
        </div>

        {/* Status text */}
        <div className="text-slate-500 font-mono text-center sm:text-right">
          Department of Forensic Deduction • Confidential Case Logs
        </div>
      </div>
    </footer>
  );
}
