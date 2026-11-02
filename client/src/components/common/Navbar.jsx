import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Clock, Compass, FileSearch, AlertCircle, Award } from 'lucide-react';
import { useMystery } from '../../context/MysteryContext';

export default function Navbar() {
  const location = useLocation();
  const { currentMystery, timerSeconds, isTimerRunning, progressPercent } = useMystery();

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Create Mystery', path: '/create' },
    { name: 'Investigation Room', path: '/investigate' },
    { name: 'Accusation', path: '/accuse' },
    { name: 'Results', path: '/results' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-noir-950/85 backdrop-blur-md border-b border-noir-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-crimson-600/30 border border-amber-500/40 flex items-center justify-center group-hover:scale-105 transition-transform shadow-glow-amber">
              <Shield className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-wider text-slate-100 flex items-center gap-1.5">
                MYSTERY<span className="text-crimson-500">VERSE</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                AI Investigation Bureau
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-noir-800 text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-noir-850'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Case Status Widget & Live Timer */}
          <div className="flex items-center gap-3">
            {currentMystery && (
              <div className="hidden sm:flex items-center gap-2.5 bg-noir-900 border border-noir-800 px-3 py-1 rounded-full text-xs font-mono">
                <span className="flex items-center gap-1 text-amber-400">
                  <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-noir-700">|</span>
                <span className="text-slate-400">
                  Progress: <strong className="text-cyan-400">{progressPercent}%</strong>
                </span>
              </div>
            )}

            <Link
              to="/investigate"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all shadow-glow-crimson"
            >
              <FileSearch className="w-4 h-4" />
              <span>Enter Room</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-noir-900 overflow-x-auto text-xs font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                location.pathname === link.path
                  ? 'text-amber-400 font-semibold bg-noir-850'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
