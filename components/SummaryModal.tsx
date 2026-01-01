
import React, { useState } from 'react';
// Added Info to the imports from lucide-react
import { X, CheckCircle2, AlertCircle, Clock, ChevronRight, Check, History, LayoutPanelLeft, FileDown, ShieldCheck, Info } from 'lucide-react';
import { ReportedProblem, ProblemStatus } from '../types';

interface SummaryModalProps {
  onClose: () => void;
  freeRoomsCount: number;
  problems: ReportedProblem[];
  onUpdateStatus: (id: string, newStatus: ProblemStatus) => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ onClose, freeRoomsCount, problems, onUpdateStatus }) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [showProblemList, setShowProblemList] = useState(false);

  const selectedProblem = problems.find(p => p.id === selectedProblemId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-200 dark:border-teal-900/30 animate-in zoom-in-95 duration-400 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-10 border-b border-slate-100 dark:border-teal-900/20 flex justify-between items-center bg-teal-50/50 dark:bg-teal-950/40 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cmc-teal to-teal-800 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-teal-500/40 active-glow">
              <LayoutPanelLeft size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Aperçu Campus</h2>
              <p className="text-[11px] font-black text-cmc-teal dark:text-teal-500 uppercase tracking-[0.2em] mt-2 opacity-100 flex items-center gap-2">
                <Clock size={12} /> État du Hub • Monitorage en direct
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-cmc-teal rounded-2xl hover:bg-slate-50 transition-all border border-slate-200 dark:border-teal-900/20 shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-12">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-slate-900 rounded-[2.5rem] border-2 border-teal-100 dark:border-teal-900/40 relative overflow-hidden group shadow-xl shadow-teal-500/5">
              <CheckCircle2 className="absolute -bottom-8 -right-8 text-cmc-teal opacity-5 group-hover:scale-110 transition-transform duration-700" size={160} />
              <p className="text-[11px] font-black text-cmc-teal uppercase tracking-[0.2em] mb-3">Salles Disponibles</p>
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-black text-cmc-teal dark:text-teal-400 tracking-tighter">{freeRoomsCount}</p>
                <span className="text-slate-400 text-sm font-bold uppercase">Unités</span>
              </div>
              <div className="mt-6 flex items-center gap-2.5 text-[11px] font-black text-teal-700/80 dark:text-teal-400 uppercase bg-teal-100/40 dark:bg-teal-900/30 w-fit px-4 py-2 rounded-xl border border-teal-200/50 dark:border-teal-800/30">
                <Check size={14} /> Opérationnel
              </div>
            </div>

            <button 
              onClick={() => setShowProblemList(!showProblemList)}
              className={`p-8 rounded-[2.5rem] border-2 relative overflow-hidden group text-left transition-all duration-500 shadow-xl ${
                problems.length > 0 
                  ? 'bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border-rose-100 dark:border-rose-900/40 shadow-rose-500/5' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-none opacity-60'
              }`}
            >
              <AlertCircle className="absolute -bottom-8 -right-8 text-rose-500 opacity-5 group-hover:scale-110 transition-transform duration-700" size={160} />
              <p className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] mb-3">Incidents Actifs</p>
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-black text-rose-700 dark:text-rose-300 tracking-tighter">{problems.length}</p>
                <span className="text-slate-400 text-sm font-bold uppercase">Alertes</span>
              </div>
              <div className={`mt-6 flex items-center gap-2.5 text-[11px] font-black uppercase w-fit px-4 py-2 rounded-xl border transition-colors ${
                problems.length > 0 
                  ? 'text-rose-600/80 bg-rose-100/40 dark:bg-rose-900/30 border-rose-200/50 dark:border-rose-800/30' 
                  : 'text-slate-400 border-slate-200'
              }`}>
                {showProblemList ? 'Masquer' : 'Afficher'} <ChevronRight size={14} className={`transition-transform duration-300 ${showProblemList ? 'rotate-90' : ''}`} />
              </div>
            </button>
          </div>

          {/* Incident Feed */}
          {showProblemList && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between px-4">
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Journal des Incidents</p>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 mx-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {problems.length === 0 ? (
                  <div className="col-span-2 py-16 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-60">
                    <ShieldCheck size={48} className="text-teal-600" />
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Hub Sécurisé • Aucune alerte</p>
                  </div>
                ) : (
                  problems.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProblemId(p.id)}
                      className={`group/item flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 ${
                        selectedProblemId === p.id 
                          ? 'bg-cmc-teal text-white border-cmc-teal shadow-xl shadow-teal-500/20 active-glow scale-[1.02]' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-teal-900/20 hover:border-cmc-teal hover:bg-teal-50/50 dark:hover:bg-teal-900/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          selectedProblemId === p.id ? 'bg-white/20' : 'bg-teal-100 dark:bg-teal-900/30 text-cmc-teal'
                        }`}>
                          <AlertCircle size={20} className={selectedProblemId === p.id ? 'text-white' : 'text-cmc-teal'} />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-black uppercase tracking-tight ${selectedProblemId === p.id ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{p.room}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                              selectedProblemId === p.id ? 'bg-white/10 text-white' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300'
                            }`}>
                              {p.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className={`transition-opacity duration-300 ${selectedProblemId === p.id ? 'opacity-100' : 'opacity-20 group-hover/item:opacity-60'}`} />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Detailed Problem Card */}
          {selectedProblem && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-10 border-2 border-cmc-teal/30 dark:border-teal-900/40 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{selectedProblem.room}</h3>
                    <div className="flex gap-2">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        selectedProblem.priority === "Plus Urgent" ? 'bg-rose-600 text-white' :
                        selectedProblem.priority === "Urgent" ? 'bg-orange-500 text-white' : 'bg-cmc-teal text-white'
                      }`}>
                        {selectedProblem.priority}
                      </span>
                      <span className="bg-white dark:bg-slate-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-teal-900/20 shadow-sm">
                        Statut: {selectedProblem.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                     <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Temps écoulé</p>
                     <p className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 justify-end">
                       <Clock size={16} className="text-cmc-teal" /> {new Date(selectedProblem.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                     </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-teal-900/20 shadow-inner">
                  <p className="text-[11px] font-black text-cmc-teal uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Info size={16} /> Détails de l'anomalie
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic border-l-4 border-cmc-teal/30 pl-6">
                    "{selectedProblem.description}"
                  </p>
                </div>

                <div className="flex gap-6 pt-4">
                  <button 
                    onClick={() => onUpdateStatus(selectedProblem.id, "Waiting")}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${
                      selectedProblem.status === "Waiting" 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/30' 
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-teal-900/20 hover:border-cmc-teal hover:bg-teal-50 dark:hover:bg-teal-900/20'
                    }`}
                  >
                    <History size={20} /> En Attente
                  </button>
                  <button 
                    onClick={() => {
                      onUpdateStatus(selectedProblem.id, "Handled");
                      setSelectedProblemId(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-cmc-teal to-teal-800 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/40 hover:translate-y-[-4px] active:scale-95 transition-all"
                  >
                    <CheckCircle2 size={20} /> Marquer Résolu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Export Button */}
          <div className="pt-4">
             <button 
               onClick={onClose}
               className="w-full py-5 bg-slate-900 dark:bg-cmc-teal text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/30 hover:translate-y-[-4px] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               <FileDown size={20} /> Exporter le rapport du Hub
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
