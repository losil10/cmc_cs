
import React, { useState } from 'react';
import { X, AlertCircle, Send, Info, ShieldAlert, Zap } from 'lucide-react';
import { MASTER_ROOM_LIST } from '../constants';
import { ProblemPriority } from '../types';

interface ProblemModalProps {
  onClose: () => void;
  onReport: (room: string, description: string, priority: ProblemPriority) => void;
}

export const ProblemModal: React.FC<ProblemModalProps> = ({ onClose, onReport }) => {
  const [room, setRoom] = useState(MASTER_ROOM_LIST[0]);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ProblemPriority>("Important");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onReport(room, description, priority);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden border border-slate-200 dark:border-teal-900/40 animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header with better contrast */}
        <div className="p-10 border-b border-slate-100 dark:border-teal-900/20 flex justify-between items-center bg-teal-50/50 dark:bg-teal-950/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cmc-teal to-teal-800 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/40">
              <AlertCircle size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Signaler un Problème</h2>
              <p className="text-cmc-teal dark:text-teal-500 text-xs font-bold uppercase tracking-widest mt-1.5 opacity-90">Rapport d'incident campus</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-slate-400 hover:text-cmc-teal hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 flex-1">
          {/* Select Field */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldAlert size={14} className="text-cmc-teal" /> Localisation du Problème
            </label>
            <div className="relative">
              <select 
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200/60 dark:border-slate-700/50 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-cmc-teal/20 focus:border-cmc-teal outline-none transition-all appearance-none cursor-pointer"
              >
                {MASTER_ROOM_LIST.map(r => (
                  <option key={r} value={r} className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">{r}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Zap size={16} />
              </div>
            </div>
          </div>

          {/* Textarea Field - FIXED FONT COLOR */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Info size={14} className="text-cmc-teal" /> Description de l'Incident
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'anomalie (ex: Panne projecteur...)"
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200/60 dark:border-slate-700/50 rounded-2xl py-5 px-6 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-4 focus:ring-cmc-teal/20 focus:border-cmc-teal outline-none transition-all min-h-[160px] resize-none"
              required
            />
          </div>

          {/* Priority Field */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap size={14} className="text-cmc-teal" /> Niveau de Priorité
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(["Important", "Urgent", "Plus Urgent"] as ProblemPriority[]).map((level) => {
                const isActive = priority === level;
                let activeStyles = "";
                if (isActive) {
                  if (level === "Plus Urgent") activeStyles = "bg-rose-600 text-white border-rose-600 shadow-xl shadow-rose-600/30";
                  else if (level === "Urgent") activeStyles = "bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/30";
                  else activeStyles = "bg-cmc-teal text-white border-cmc-teal shadow-xl shadow-teal-600/30";
                }
                
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${
                      isActive 
                        ? activeStyles + " scale-105"
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:border-cmc-teal hover:text-cmc-teal'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-cmc-teal to-teal-800 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/40 hover:translate-y-[-4px] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Send size={18} /> Envoyer le Rapport
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
