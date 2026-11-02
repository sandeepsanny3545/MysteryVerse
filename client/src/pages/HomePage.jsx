import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Compass, Search, FileText, Skull, ArrowRight, Zap, Target, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { PRESET_PREMISES } from '../utils/mockData';
import { useMystery } from '../context/MysteryContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { initializeCase, createMystery } = useMystery();

  const handleStartPreset = (presetId) => {
    createMystery({ presetId });
    navigate('/investigate');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-crimson-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[250px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-noir-850/80 border border-amber-500/30 text-amber-400 text-xs font-mono mb-8 animate-fade-in shadow-glow-amber">
          <Shield className="w-3.5 h-3.5" />
          <span>OFFICIAL POLICE INVESTIGATION CHAMBER • ACTIVE SESSIONS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-slate-100 max-w-4xl mx-auto leading-[1.1] mb-6">
          Unmask the Killer.<br />
          <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-crimson-600 bg-clip-text text-transparent">
            Interrogate the AI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Step into a high-stakes investigation room. Examine crime scene forensics, interrogate living suspects with dynamic psychological stress meters, and formulate your deduction.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto text-base font-semibold px-8 py-3.5 shadow-glow-crimson group"
            onClick={() => navigate('/create')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Start Investigation
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto text-base font-medium px-6 py-3.5"
            onClick={() => navigate('/investigate')}
            icon={Search}
            iconPosition="left"
          >
            Enter Current Room
          </Button>
        </div>

        {/* Three Pillars Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mb-16">
          
          <div className="glass-panel p-6 rounded-2xl border border-noir-800 hover:border-amber-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100 mb-2">
              Dynamic AI Suspects
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Question unscripted suspects with shifting stress meters, hidden secrets, and physical deception tells that react to pressure.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-noir-800 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-cyan-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100 mb-2">
              Forensic Evidence
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Examine physical weapons, toxicology reports, digital server logs, and guest registries to break false alibis.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-noir-800 hover:border-crimson-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-crimson-600/10 border border-crimson-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-crimson-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100 mb-2">
              Accusation Chamber
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Name the true culprit, deduce the motive, identify the murder instrument, and receive an AI Chief Inspector ruling.
            </p>
          </div>

        </div>

        {/* Featured Case Dossiers Section */}
        <div className="text-left max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-100">
                Ready-to-Investigate Case Files
              </h2>
              <p className="text-sm text-slate-400">
                Choose an unsolved crime or generate your custom mystery
              </p>
            </div>
            <Link
              to="/create"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Custom Case Generator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRESET_PREMISES.map((preset) => {
              const diffVariant =
                preset.difficulty === 'Easy'
                  ? 'easy'
                  : preset.difficulty === 'Hard'
                  ? 'hard'
                  : 'medium';

              return (
                <div
                  key={preset.id}
                  className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between border border-noir-800 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                        {preset.tag}
                      </span>
                      <Badge variant={diffVariant} size="sm">
                        {preset.difficulty}
                      </Badge>
                    </div>

                    <h4 className="text-lg font-serif font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-2">
                      {preset.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {preset.premise}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-noir-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      ⏱ {preset.estimatedTime}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartPreset(
                        preset.id === 'preset-1'
                          ? 'the-midnight-masquerade'
                          : preset.id === 'preset-2'
                          ? 'the-neon-cipher-poisoning'
                          : 'the-crimson-velvet-express'
                      )}
                    >
                      Investigate
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
