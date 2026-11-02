import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Award, CheckCircle2, XCircle, Shield, AlertTriangle, 
  RotateCcw, ArrowRight, Clock, Search, BookOpen, Skull, 
  Sparkles, FileText, Check, ChevronRight
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useMystery } from '../context/MysteryContext';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { currentMystery, verdictResult, initializeCase } = useMystery();

  useEffect(() => {
    if (verdictResult?.isCorrect) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Silently catch if canvas-confetti is not rendered
      }
    }
  }, [verdictResult]);

  if (!verdictResult || !currentMystery) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Shield className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-2xl font-serif text-slate-100 mb-2">
          No Verdict Submitted Yet
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          You must investigate the case and submit a formal accusation in the Accusation Chamber to view the official case resolution.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/investigate')}>Go to Investigation Room</Button>
          <Button variant="secondary" onClick={() => navigate('/create')}>Create Mystery</Button>
        </div>
      </div>
    );
  }

  const {
    isCorrect,
    score,
    rank,
    accusedName,
    accusedRole,
    trueCulpritName,
    trueCulpritRole,
    murderWeapon,
    motive,
    explanation,
    timeTakenFormatted,
    cluesFoundCount,
    totalCluesCount,
    hintsUsedCount
  } = verdictResult;

  const handleReplay = () => {
    initializeCase(currentMystery);
    navigate('/investigate');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* 1. Dramatic Verdict Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border mb-8 text-center relative overflow-hidden ${
          isCorrect
            ? 'bg-gradient-to-b from-emerald-950/60 to-noir-900 border-emerald-500/60 shadow-lg'
            : 'bg-gradient-to-b from-crimson-950/60 to-noir-900 border-crimson-600/60 shadow-glow-crimson'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-noir-950/80 border text-xs font-mono mb-4 backdrop-blur-sm">
          {isCorrect ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> OFFICIAL CHIEF INSPECTOR RULING
            </span>
          ) : (
            <span className="text-crimson-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> INQUIRY COLLAPSE: WRONGFUL INDICTMENT
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-100 mb-3">
          {isCorrect ? 'CASE CLOSED: GUILTY VERDICT' : 'MISTRIAL: FALSE ACCUSATION'}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed mb-6">
          {isCorrect
            ? 'Your deductive reasoning matched the physical evidence beyond reasonable doubt. The true perpetrator has confessed and is now remanded in custody.'
            : 'You indicted an innocent subject. Under cross-examination, their alibi held firm while the real killer slipped through the cordon.'}
        </p>

        {/* Score & Rank Pills */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-noir-950/90 border border-noir-800 px-6 py-3 rounded-2xl">
          <div className="text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Case Score</span>
            <span className={`text-2xl font-mono font-black ${isCorrect ? 'text-amber-400' : 'text-crimson-400'}`}>
              {score} PTS
            </span>
          </div>

          <div className="h-8 w-px bg-noir-800 hidden sm:block" />

          <div className="text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Rank Awarded</span>
            <span className="text-lg font-serif font-bold text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              {rank}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Culprit Comparison Card */}
      <div className="glass-panel p-6 rounded-2xl border border-noir-850 mb-8">
        <h2 className="text-lg font-serif font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Skull className="w-5 h-5 text-crimson-500" />
          The Culprit Revelation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Your Accusation */}
          <div className="p-4 rounded-xl bg-noir-900 border border-noir-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Your Accused Suspect
            </span>
            <div className="font-serif font-bold text-base text-slate-100">
              {accusedName}
            </div>
            <div className="text-xs font-mono text-amber-400/90 mb-2">
              {accusedRole}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              Status:
              {isCorrect ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Accurate (+500 pts)
                </span>
              ) : (
                <span className="text-crimson-400 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Innocent (-250 pts)
                </span>
              )}
            </div>
          </div>

          {/* Actual True Killer */}
          <div className="p-4 rounded-xl bg-noir-900 border border-crimson-900/40">
            <span className="text-[10px] font-mono uppercase text-crimson-400 block mb-1 font-bold">
              The True Killer
            </span>
            <div className="font-serif font-bold text-base text-slate-100">
              {trueCulpritName}
            </div>
            <div className="text-xs font-mono text-slate-400 mb-2">
              {trueCulpritRole}
            </div>
            <div className="text-xs font-mono text-slate-400">
              Method: <span className="text-slate-200">{murderWeapon}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. True Case Narrative / Post-Mortem Explanation */}
      <div className="glass-panel p-6 rounded-2xl border border-noir-850 mb-8">
        <h2 className="text-lg font-serif font-bold text-slate-100 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          The Canonical Case Post-Mortem
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-4">
          How the crime unfolded from inception to execution:
        </p>

        <div className="p-5 rounded-xl bg-noir-950 border border-noir-800 text-sm text-slate-300 leading-relaxed font-sans space-y-3">
          <p>{explanation}</p>
          <div className="pt-3 border-t border-noir-800/80 text-xs text-amber-400/90 font-mono">
            <strong>True Motive:</strong> {motive}
          </div>
        </div>
      </div>

      {/* 4. Detailed Scorecard Breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-noir-850 mb-10">
        <h2 className="text-lg font-serif font-bold text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Detective Performance Scorecard
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-noir-900 rounded-xl border border-noir-800">
            <span className="text-[10px] font-mono text-slate-400 block">TIME ELAPSED</span>
            <span className="text-base font-mono font-bold text-slate-100">{timeTakenFormatted}</span>
          </div>

          <div className="p-3 bg-noir-900 rounded-xl border border-noir-800">
            <span className="text-[10px] font-mono text-slate-400 block">CLUES FOUND</span>
            <span className="text-base font-mono font-bold text-cyan-400">
              {cluesFoundCount} / {totalCluesCount}
            </span>
          </div>

          <div className="p-3 bg-noir-900 rounded-xl border border-noir-800">
            <span className="text-[10px] font-mono text-slate-400 block">HINTS USED</span>
            <span className="text-base font-mono font-bold text-amber-400">{hintsUsedCount}</span>
          </div>

          <div className="p-3 bg-noir-900 rounded-xl border border-noir-800">
            <span className="text-[10px] font-mono text-slate-400 block">ACCURACY</span>
            <span className={`text-base font-mono font-bold ${isCorrect ? 'text-emerald-400' : 'text-crimson-400'}`}>
              {isCorrect ? '100%' : '0%'}
            </span>
          </div>
        </div>

        {/* Backend Score Calculation Breakdown */}
        {verdictResult.scoreBreakdown && (
          <div className="mt-4 pt-4 border-t border-noir-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400">Official Scoring Formula:</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">
                Base: <strong className={isCorrect ? 'text-emerald-400' : 'text-slate-400'}>+{verdictResult.scoreBreakdown.basePoints}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">
                Clues: <strong>+{verdictResult.scoreBreakdown.clueBonus}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-rose-400">
                Hints: <strong>-{verdictResult.scoreBreakdown.hintPenalty}</strong>
              </span>
              <span className="text-slate-600">=</span>
              <span className="text-amber-400 font-bold">
                Total: {verdictResult.scoreBreakdown.totalScore} PTS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Navigation & Replay Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="md"
          onClick={handleReplay}
          icon={RotateCcw}
          iconPosition="left"
        >
          Replay This Case
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/')}
          >
            Return to HQ
          </Button>

          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto shadow-glow-crimson"
            onClick={() => navigate('/create')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Investigate Next Mystery
          </Button>
        </div>
      </div>

    </div>
  );
}
