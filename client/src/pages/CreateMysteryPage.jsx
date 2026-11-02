import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileEdit, Sparkles, Shield, AlertTriangle, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { PRESET_PREMISES } from '../utils/mockData';
import { useMystery } from '../context/MysteryContext';

export default function CreateMysteryPage() {
  const navigate = useNavigate();
  const { createMystery } = useMystery();

  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [premiseText, setPremiseText] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const difficultyOptions = [
    {
      level: 'Easy',
      badgeVariant: 'easy',
      time: '10 Mins',
      desc: '2 Suspects • Clear forensic contradiction • Generous hints'
    },
    {
      level: 'Medium',
      badgeVariant: 'medium',
      time: '15 Mins',
      desc: '3 Suspects • Hidden alibi discrepancies • Balanced forensic depth'
    },
    {
      level: 'Hard',
      badgeVariant: 'hard',
      time: '20 Mins',
      desc: '3 Suspects • Red herrings • Encrypted logs & high-stakes deduction'
    }
  ];

  const quickPromptTemplates = [
    {
      title: 'The Clocktower Strangulation',
      text: 'At 11:45 PM during the city mayor\'s re-election rally, the bell keeper was found strangled inside the locked mechanical clocktower with the gears jammed by a gold pocket watch.'
    },
    {
      title: 'The Art Collector\'s Final Auction',
      text: 'A world-famous art collector collapsed during a private VIP auction of a cursed Venetian mask. The mask was replaced with a replica while the lights flickered for 20 seconds.'
    },
    {
      title: 'The Cyber-Deck Sabotage',
      text: 'Inside an underground VR simulation parlor, a legendary hacker suffered fatal neurological shock. Their physical rig was spliced into an unlisted high-voltage terminal.'
    }
  ];

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setPremiseText(preset.premise);
    setSelectedDifficulty(preset.difficulty);
  };

  const [generationError, setGenerationError] = useState('');

  const handleApplyTemplate = (text) => {
    setSelectedPresetId(null);
    setPremiseText(text);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationError('');

    try {
      if (selectedPresetId) {
        await createMystery({ presetId: selectedPresetId });
      } else {
        await createMystery({
          premise: premiseText || 'An unexpected high-stakes murder mystery in a locked mansion.',
          difficulty: selectedDifficulty
        });
      }
      navigate('/investigate');
    } catch (err) {
      console.error('Case generation error:', err);
      setGenerationError(`Backend Case Generation Error: ${err.message}. Please verify the backend server is active.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noir-850 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
          <FileEdit className="w-3.5 h-3.5" />
          <span>CASE BRIEFING COMPILER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-100 tracking-tight mb-3">
          Create Mystery Case
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Enter an original crime premise or select a curated dossier. Select your investigation difficulty to calibrate suspect resistance and clues.
        </p>
      </div>

      {generationError && (
        <div className="p-4 rounded-xl bg-crimson-950/90 border border-crimson-600 text-crimson-200 text-xs font-mono mb-6 flex items-start gap-3 shadow-glow-crimson animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-crimson-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-crimson-300 font-bold mb-0.5">Integration Failure:</strong>
            {generationError}
          </div>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-8">
        
        {/* Step 1: Difficulty Selection */}
        <div className="glass-panel p-6 rounded-2xl border border-noir-850">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono font-bold">1</span>
              Select Investigation Difficulty
            </label>
            <span className="text-xs font-mono text-slate-400">Calibrates AI Suspect Stress</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyOptions.map((opt) => {
              const isSelected = selectedDifficulty === opt.level;
              return (
                <div
                  key={opt.level}
                  onClick={() => {
                    setSelectedDifficulty(opt.level);
                    setSelectedPresetId(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-noir-800 border-amber-500 shadow-glow-amber scale-[1.02]'
                      : 'bg-noir-900/60 border-noir-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-bold text-slate-100">
                      {opt.level}
                    </span>
                    <Badge variant={opt.badgeVariant} size="sm">
                      {opt.time}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Premise Input */}
        <div className="glass-panel p-6 rounded-2xl border border-noir-850">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-crimson-600/20 text-crimson-400 text-xs flex items-center justify-center font-mono font-bold">2</span>
              Case Premise & Incident Context
            </label>
            <span className="text-xs font-mono text-slate-400">Required</span>
          </div>

          <textarea
            rows={5}
            value={premiseText}
            onChange={(e) => {
              setPremiseText(e.target.value);
              setSelectedPresetId(null);
            }}
            placeholder="Describe the incident: location, the victim's profile, how they were discovered, and the suspected foul play..."
            className="w-full bg-noir-900 border border-noir-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all font-sans leading-relaxed"
          />

          {/* Quick Idea Chips */}
          <div className="mt-4">
            <span className="text-xs font-mono text-slate-400 block mb-2">
              Quick Premise Ideas (click to apply):
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPromptTemplates.map((template) => (
                <button
                  type="button"
                  key={template.title}
                  onClick={() => handleApplyTemplate(template.text)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-amber-500/40 text-slate-300 transition-colors"
                >
                  + {template.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preset Dossiers Alternative */}
        <div className="glass-panel p-6 rounded-2xl border border-noir-850">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Or Choose a Master Noir Dossier
            </label>
            <span className="text-xs font-mono text-slate-400">Pre-compiled cases</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRESET_PREMISES.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-noir-800 border-cyan-500 shadow-glow-cyan'
                      : 'bg-noir-900/60 border-noir-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      {preset.difficulty}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <h4 className="text-xs font-serif font-bold text-slate-100 mb-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {preset.victim}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-center gap-2.5 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Consulting Google Gemini AI & Initializing Case in MongoDB Atlas...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-noir-850">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            size="md"
          >
            ← Cancel to Headquarters
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
            disabled={isGenerating || (!premiseText.trim() && !selectedPresetId)}
            icon={Sparkles}
            iconPosition="left"
          >
            {isGenerating ? 'Compiling Case File...' : 'Generate & Enter Room'}
          </Button>
        </div>

      </form>
    </div>
  );
}
