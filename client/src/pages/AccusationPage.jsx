import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, AlertTriangle, Shield, CheckCircle2, User, 
  FileText, ArrowLeft, ArrowRight, Gavel, Check, Search
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useMystery } from '../context/MysteryContext';

export default function AccusationPage() {
  const navigate = useNavigate();
  const { currentMystery, discoveredClueIds, submitAccusation } = useMystery();

  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [selectedMotive, setSelectedMotive] = useState('');
  const [reasoningText, setReasoningText] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!currentMystery) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-slate-100 mb-4">No Active Case Found</h2>
        <Button onClick={() => navigate('/create')}>Go to Case Creator</Button>
      </div>
    );
  }

  const motiveOptions = [
    'Financial Embezzlement & Greed',
    'Blackmail & Threat of Exposure',
    'Corporate Espionage & Whistleblower Silencing',
    'Inheritance & Will Tampering',
    'Personal Vendetta & Revenge'
  ];

  const handleToggleEvidence = (clueId) => {
    setSelectedEvidenceIds(prev => 
      prev.includes(clueId) ? prev.filter(id => id !== clueId) : [...prev, clueId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      setFormError('You must select a primary suspect to indict.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      await submitAccusation({
        suspectId: selectedSuspectId,
        motive: selectedMotive || 'Self-preservation and financial gain',
        reasoning: reasoningText || 'The physical evidence and broken alibis confirm guilt beyond reasonable doubt.',
        selectedEvidenceIds
      });
      navigate('/results');
    } catch (err) {
      setFormError(`Accusation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-950/80 border border-crimson-600/50 text-crimson-400 text-xs font-mono mb-4 shadow-glow-crimson">
          <Gavel className="w-3.5 h-3.5" />
          <span>FORMAL INDICTMENT TRIBUNAL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-100 tracking-tight mb-3">
          The Accusation Chamber
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Weigh the evidence, unmask the perpetrator, and file your official indictment for <strong className="text-slate-200">{currentMystery.title}</strong>.
        </p>
      </div>

      {/* Warning Alert */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 flex items-start gap-3 mb-8">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Official Directive:</strong> Filing a formal indictment is legally binding for this case session. Accusing an innocent suspect incurs a <strong>-250 point penalty</strong> and lowers your final Detective Rating.
        </div>
      </div>

      {formError && (
        <div className="p-3 rounded-lg bg-crimson-950 border border-crimson-600 text-crimson-200 text-xs font-mono mb-6 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Suspect Selection */}
        <div className="glass-panel p-6 rounded-2xl border border-noir-850">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-crimson-600 text-white text-xs flex items-center justify-center font-mono font-bold">1</span>
              Name the Primary Culprit
            </label>
            <span className="text-xs font-mono text-slate-400">Select one suspect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentMystery.suspects?.map((suspect) => {
              const isSelected = selectedSuspectId === suspect.id;

              return (
                <div
                  key={suspect.id}
                  onClick={() => setSelectedSuspectId(suspect.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-noir-800 border-crimson-500 shadow-glow-crimson scale-[1.02]'
                      : 'bg-noir-900/60 border-noir-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="relative mb-3">
                      <img
                        src={suspect.avatar}
                        alt={suspect.name}
                        className="w-full h-32 object-cover rounded-lg border border-noir-700"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-crimson-600 text-white rounded-full p-1 shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-slate-100 text-base">
                      {suspect.name}
                    </h3>
                    <p className="text-xs text-amber-400 font-mono mb-2">
                      {suspect.role}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 italic">
                      "{suspect.statement}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-noir-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Alibi status:</span>
                    <span className={isSelected ? 'text-crimson-400 font-bold' : 'text-slate-500'}>
                      {isSelected ? 'Accused' : 'Suspect'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Establish the Motive */}
        <div className="glass-panel p-6 rounded-2xl border border-noir-850">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-noir-950 text-xs flex items-center justify-center font-mono font-bold">2</span>
              What was the Motive?
            </label>
            <span className="text-xs font-mono text-slate-400">Select or describe</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {motiveOptions.map((motive) => (
              <button
                type="button"
                key={motive}
                onClick={() => setSelectedMotive(motive)}
                className={`text-xs font-mono px-3.5 py-2 rounded-lg border transition-all ${
                  selectedMotive === motive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                    : 'bg-noir-900 border-noir-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {motive}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={selectedMotive}
            onChange={(e) => setSelectedMotive(e.target.value)}
            placeholder="Or type a specific custom motive..."
            className="w-full bg-noir-900 border border-noir-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Step 3: Attach Corroborating Clues */}
        <div className="glass-panel p-6 rounded-2xl border border-noir-850">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs flex items-center justify-center font-mono font-bold">3</span>
              Select Corroborating Evidence ({selectedEvidenceIds.length} attached)
            </label>
            <span className="text-xs font-mono text-slate-400">Physical proof</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentMystery.clues?.map((clue) => {
              const isSelected = selectedEvidenceIds.includes(clue.id);

              return (
                <div
                  key={clue.id}
                  onClick={() => handleToggleEvidence(clue.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-noir-800 border-cyan-500 text-cyan-200'
                      : 'bg-noir-900/60 border-noir-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border text-xs ${
                        isSelected
                          ? 'bg-cyan-500 border-cyan-400 text-noir-950 font-bold'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-xs text-slate-100">
                        {clue.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {clue.category}
                      </div>
                    </div>
                  </div>

                  {clue.isSmokingGun && (
                    <Badge variant="smokingGun" size="sm">
                      Key Clue
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Written Reasoning / Closing Deduction */}
        <div className="glass-panel p-6 rounded-2xl border border-noir-850">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-serif font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-noir-800 text-slate-200 text-xs flex items-center justify-center font-mono font-bold">4</span>
              Detective's Closing Deduction
            </label>
            <span className="text-xs font-mono text-slate-400">Summary justification</span>
          </div>

          <textarea
            rows={4}
            value={reasoningText}
            onChange={(e) => setReasoningText(e.target.value)}
            placeholder="Explain how the crime was executed, why their alibi collapses, and what the key evidence proves..."
            className="w-full bg-noir-900 border border-noir-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-crimson-500 font-sans"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-noir-850">
          <Button
            variant="ghost"
            onClick={() => navigate('/investigate')}
            icon={ArrowLeft}
            iconPosition="left"
          >
            Return to Investigation Room
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-10 shadow-glow-crimson font-bold text-base"
            disabled={isSubmitting || !selectedSuspectId}
            icon={Gavel}
            iconPosition="left"
          >
            {isSubmitting ? 'Delivering Indictment...' : 'Submit Formal Accusation'}
          </Button>
        </div>

      </form>
    </div>
  );
}
