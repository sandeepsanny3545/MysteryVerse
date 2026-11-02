import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Shield, User, Search, Lightbulb, Clock, AlertTriangle, 
  CheckCircle2, ArrowRight, MessageSquare, Skull, Eye, HelpCircle, 
  Fingerprint, Sparkles, Send, X, AlertCircle
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useMystery } from '../context/MysteryContext';

export default function InvestigationRoomPage() {
  const navigate = useNavigate();
  const {
    currentMystery,
    discoveredClueIds,
    interrogatedSuspectIds,
    unlockedHintIds,
    suspectStress,
    interrogationLogs,
    timerSeconds,
    progressPercent,
    inspectClue,
    askSuspectQuestion,
    unlockHint
  } = useMystery();

  // Active modal states
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [selectedClue, setSelectedClue] = useState(null);
  const [activeStoryTab, setActiveStoryTab] = useState('synopsis'); // 'synopsis' | 'autopsy' | 'victim'
  const [customQuestionInput, setCustomQuestionInput] = useState('');

  if (!currentMystery) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif text-slate-100 mb-4">No Active Case Found</h2>
        <p className="text-slate-400 mb-6">Please create or select an investigation case to begin.</p>
        <Button onClick={() => navigate('/create')}>Go to Case Creator</Button>
      </div>
    );
  }

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenSuspect = (suspect) => {
    setSelectedSuspect(suspect);
  };

  const handleSendQuestion = (questionText) => {
    if (!questionText.trim() || !selectedSuspect) return;
    askSuspectQuestion(selectedSuspect.id, questionText);
    setCustomQuestionInput('');
  };

  const handleInspectClue = (clue) => {
    inspectClue(clue.id);
    setSelectedClue(clue);
  };

  const handleUnlockHint = (hint) => {
    unlockHint(hint.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Top Banner: Case Overview & Progress Bar */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-noir-800 mb-8 shadow-case-file">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-noir-800">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> {currentMystery.location}
              </span>
              <span className="text-noir-700">•</span>
              <span className="text-xs font-mono text-slate-400">
                DISPATCH: {currentMystery.dispatchTime}
              </span>
              <Badge
                variant={
                  currentMystery.difficulty === 'Easy'
                    ? 'easy'
                    : currentMystery.difficulty === 'Hard'
                    ? 'hard'
                    : 'medium'
                }
                size="sm"
              >
                {currentMystery.difficulty}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-100 tracking-wide">
              {currentMystery.title}
            </h1>
          </div>

          {/* Timer & Proceed to Accusation CTA */}
          <div className="flex items-center gap-4">
            <div className="bg-noir-900 border border-noir-800 px-4 py-2 rounded-xl text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Case Clock</div>
              <div className="text-lg font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 animate-pulse" />
                {formatTimer(timerSeconds)}
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="shadow-glow-crimson"
              onClick={() => navigate('/accuse')}
              icon={ArrowRight}
              iconPosition="right"
            >
              File Accusation
            </Button>
          </div>
        </div>

        {/* Investigation Progress Meter */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Investigation Thoroughness: <strong className="text-cyan-400">{progressPercent}%</strong>
            </span>
            <span className="text-slate-400">
              Clues Inspected: {discoveredClueIds.length}/{currentMystery.clues?.length || 0} • Suspects Questioned: {interrogatedSuspectIds.length}/{currentMystery.suspects?.length || 0}
            </span>
          </div>

          <div className="w-full h-2.5 bg-noir-900 rounded-full overflow-hidden border border-noir-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-crimson-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Investigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Left Column (2 Cols wide on desktop): Case Dossier & Suspect Interrogations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Story Dossier */}
          <div className="glass-panel rounded-2xl border border-noir-800 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 border-b border-noir-800 pb-3">
              <h2 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Case Dossier & Incident Log
              </h2>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-noir-900 p-1 rounded-lg border border-noir-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveStoryTab('synopsis')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeStoryTab === 'synopsis'
                      ? 'bg-noir-800 text-amber-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Synopsis
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryTab('autopsy')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeStoryTab === 'autopsy'
                      ? 'bg-noir-800 text-crimson-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Autopsy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryTab('victim')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeStoryTab === 'victim'
                      ? 'bg-noir-800 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Victim Bio
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeStoryTab === 'synopsis' && (
              <div className="text-sm text-slate-300 leading-relaxed space-y-3 font-sans animate-fade-in">
                <p>{currentMystery.briefing.synopsis}</p>
              </div>
            )}

            {activeStoryTab === 'autopsy' && (
              <div className="text-sm text-slate-300 leading-relaxed font-sans bg-noir-900/60 p-4 rounded-xl border border-noir-800/80 animate-fade-in space-y-2">
                <div className="flex items-center gap-2 text-crimson-400 font-mono text-xs font-bold uppercase">
                  <Skull className="w-4 h-4" /> Official Coroner Summary
                </div>
                <p>{currentMystery.briefing.autopsy}</p>
              </div>
            )}

            {activeStoryTab === 'victim' && (
              <div className="text-sm text-slate-300 leading-relaxed font-sans bg-noir-900/60 p-4 rounded-xl border border-noir-800/80 animate-fade-in space-y-2">
                <div className="font-serif font-bold text-slate-100 text-base">
                  {currentMystery.briefing.victim.name}
                  <span className="text-xs font-mono text-slate-400 font-normal ml-2">
                    Age {currentMystery.briefing.victim.age} • {currentMystery.briefing.victim.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300 font-mono">Known Feuds:</strong> {currentMystery.briefing.victim.knownFeuds}
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Suspect Cards & Interrogation Station */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-crimson-400" />
                Persons of Interest ({currentMystery.suspects?.length || 0})
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Click suspect to begin direct questioning
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentMystery.suspects?.map((suspect) => {
                const stress = suspectStress[suspect.id] || suspect.initialStress || 20;
                const isInterrogated = interrogatedSuspectIds.includes(suspect.id);

                return (
                  <div
                    key={suspect.id}
                    className="glass-panel-interactive rounded-2xl p-4 border border-noir-800 flex flex-col justify-between"
                  >
                    <div>
                      {/* Avatar & Header */}
                      <div className="relative mb-3">
                        <img
                          src={suspect.avatar}
                          alt={suspect.name}
                          className="w-full h-36 object-cover rounded-xl border border-noir-700"
                        />
                        {isInterrogated && (
                          <div className="absolute top-2 right-2 bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                            <CheckCircle2 className="w-3 h-3" /> Questioned
                          </div>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-slate-100 text-base">
                        {suspect.name}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-mono mb-2">
                        {suspect.role}
                      </p>

                      <p className="text-xs text-slate-300 italic line-clamp-2 mb-3 bg-noir-900/50 p-2 rounded border border-noir-800">
                        "{suspect.statement}"
                      </p>

                      {/* Stress Gauge Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Stress Gauge:</span>
                          <span
                            className={`font-bold ${
                              stress > 70
                                ? 'text-crimson-400'
                                : stress > 45
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {stress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-noir-900 rounded-full overflow-hidden border border-noir-800">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              stress > 70
                                ? 'bg-crimson-600'
                                : stress > 45
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full border-noir-700 hover:border-amber-500/50 hover:text-amber-300"
                      onClick={() => handleOpenSuspect(suspect)}
                      icon={MessageSquare}
                      iconPosition="left"
                    >
                      Interrogate Suspect
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Crime Scene Clues */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                Crime Scene Forensic Clues ({currentMystery.clues?.length || 0})
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Inspect items to reveal forensic analysis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentMystery.clues?.map((clue) => {
                const isDiscovered = discoveredClueIds.includes(clue.id);

                return (
                  <div
                    key={clue.id}
                    onClick={() => handleInspectClue(clue)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isDiscovered
                        ? 'bg-noir-850/80 border-cyan-500/40 shadow-sm'
                        : 'bg-noir-900/60 border-noir-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-noir-800 border border-noir-700 flex items-center justify-center text-cyan-400">
                          <Fingerprint className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-slate-100">
                            {clue.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {clue.location}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={clue.isSmokingGun ? 'smokingGun' : 'cyan'}
                        size="sm"
                      >
                        {clue.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {clue.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-noir-800/80">
                      <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                        {isDiscovered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Forensic Report Logged
                          </>
                        ) : (
                          'Click to inspect forensics'
                        )}
                      </span>
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Detective Radio, Chief Inspector Hints & Case Summary */}
        <div className="space-y-6">
          
          {/* Chief Inspector Dispatch Hints */}
          <div className="glass-panel p-5 rounded-2xl border border-noir-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-noir-800">
              <h3 className="font-serif font-bold text-slate-100 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Inspector Dispatch Hints
              </h3>
              <Badge variant="amber" size="sm">
                -{50} pts/hint
              </Badge>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              If your deduction stalls, request specialized insight from the Chief Detective Inspector. A small deduction score penalty applies.
            </p>

            <div className="space-y-3">
              {currentMystery.hints?.map((hint) => {
                const isUnlocked = unlockedHintIds.includes(hint.id);

                return (
                  <div
                    key={hint.id}
                    className="p-3.5 rounded-xl bg-noir-900/80 border border-noir-800"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif font-bold text-xs text-slate-200">
                        {hint.title}
                      </span>
                      {isUnlocked ? (
                        <span className="text-[10px] font-mono text-amber-400">Unlocked</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUnlockHint(hint)}
                          className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline"
                        >
                          Reveal (-{hint.penalty} pts)
                        </button>
                      )}
                    </div>

                    {isUnlocked ? (
                      <p className="text-xs text-slate-300 font-sans leading-relaxed mt-2 p-2.5 rounded bg-noir-950 border border-amber-500/20">
                        {hint.content}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">
                        Classified hint sealed. Click reveal to decrypt.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Case Notes / Checklist */}
          <div className="glass-panel p-5 rounded-2xl border border-noir-800">
            <h3 className="font-serif font-bold text-slate-100 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Investigation Checklist
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2">
                {discoveredClueIds.length > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>Examine physical crime scene clues</span>
              </li>
              <li className="flex items-center gap-2">
                {interrogatedSuspectIds.length >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>Interrogate at least 2 suspects</span>
              </li>
              <li className="flex items-center gap-2">
                {discoveredClueIds.length >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>Locate potential murder weapon</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-amber-500 shrink-0" />
                <span className="text-amber-400">File Formal Accusation</span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-noir-800">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-glow-crimson"
                onClick={() => navigate('/accuse')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Proceed to Accusation Chamber
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* Suspect Interrogation Dialogue Modal */}
      {selectedSuspect && (
        <Modal
          isOpen={!!selectedSuspect}
          onClose={() => setSelectedSuspect(null)}
          title={`Interrogation: ${selectedSuspect.name}`}
          subtitle={`${selectedSuspect.role} • Stress: ${suspectStress[selectedSuspect.id] || 25}%`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            {/* Suspect Header Info */}
            <div className="flex items-start gap-4 p-3 bg-noir-850 rounded-xl border border-noir-800">
              <img
                src={selectedSuspect.avatar}
                alt={selectedSuspect.name}
                className="w-16 h-16 rounded-lg object-cover border border-noir-700"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-slate-100">
                    {selectedSuspect.name}
                  </h4>
                  <Badge
                    variant={
                      (suspectStress[selectedSuspect.id] || 25) > 70
                        ? 'crimson'
                        : (suspectStress[selectedSuspect.id] || 25) > 45
                        ? 'amber'
                        : 'easy'
                    }
                    size="sm"
                  >
                    Stress: {suspectStress[selectedSuspect.id] || 25}%
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  <strong>Relationship:</strong> {selectedSuspect.relationship}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  <strong>Claimed Alibi:</strong> {selectedSuspect.alibi}
                </p>
                <p className="text-xs text-rose-300/90 italic mt-1">
                  <strong>Tell:</strong> {selectedSuspect.behavioralTell}
                </p>
              </div>
            </div>

            {/* Conversation Transcript Log */}
            <div className="h-64 overflow-y-auto bg-noir-950 p-4 rounded-xl border border-noir-800 space-y-3 font-mono text-xs">
              {(interrogationLogs[selectedSuspect.id] || []).map((log, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    log.sender === 'detective'
                      ? 'bg-amber-950/30 border border-amber-600/30 text-amber-200 ml-6'
                      : 'bg-noir-900 border border-noir-800 text-slate-200 mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold uppercase">
                      {log.sender === 'detective' ? 'Detective' : selectedSuspect.name}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="font-sans text-sm leading-relaxed">{log.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Questions Chips */}
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-2">
                Suggested Probing Inquiries:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSuspect.dialogueResponses?.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendQuestion(d.query)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 border border-noir-700 hover:border-amber-500/40 text-slate-300 text-left"
                  >
                    "{d.query}"
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Question Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customQuestionInput}
                onChange={(e) => setCustomQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion(customQuestionInput)}
                placeholder="Type your interrogation inquiry..."
                className="flex-1 bg-noir-950 border border-noir-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Button
                variant="amber"
                size="md"
                onClick={() => handleSendQuestion(customQuestionInput)}
                icon={Send}
                iconPosition="right"
              >
                Inquire
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Clue Forensic Inspector Modal */}
      {selectedClue && (
        <Modal
          isOpen={!!selectedClue}
          onClose={() => setSelectedClue(null)}
          title={`Forensic Analysis: ${selectedClue.title}`}
          subtitle={`Discovered at: ${selectedClue.location}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={selectedClue.isSmokingGun ? 'smokingGun' : 'cyan'}>
                {selectedClue.category}
              </Badge>
              {selectedClue.isSmokingGun && (
                <span className="text-xs font-mono text-rose-400 font-bold uppercase animate-pulse">
                  ⚠ Smoking Gun Evidence
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-noir-950 border border-noir-800 text-sm text-slate-300 leading-relaxed">
              <span className="text-xs font-mono text-slate-400 uppercase block mb-1">
                Visual Observation
              </span>
              <p>{selectedClue.description}</p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-700/40 text-sm text-cyan-200 leading-relaxed">
              <span className="text-xs font-mono text-cyan-400 uppercase block mb-1 flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4" /> Official Forensic Laboratory Findings
              </span>
              <p>{selectedClue.forensicReport}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedClue(null)}>
                Close Evidence File
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
