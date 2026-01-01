
import React from 'react';
import { GroupData } from '../types';
import { Download, Calendar, User, MapPin, Clock, AlertCircle, FileText } from 'lucide-react';

interface Props {
  group: GroupData;
}

export const GroupDetailView: React.FC<Props> = ({ group }) => {
  if (group.status === 'MISSING') {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 p-12 rounded-[2rem] text-center border-2 border-dashed border-rose-200 dark:border-rose-800">
        <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-2xl font-black text-rose-800 dark:text-rose-300 uppercase tracking-tight">Données CMC introuvables</h2>
        <p className="text-sm text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest mt-2">
          Aucun fichier d'emploi du temps CMC n'a encore été associé à la cohorte {group.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-cmc-teal rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden active-glow">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <FileText size={120} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">{group.name}</h1>
            <p className="text-cyan-50 font-bold uppercase tracking-widest text-[11px] flex items-center gap-2">
              <Clock size={14} className="text-cyan-200" /> Révision CMC : {group.revisionDate || 'N/A'}
            </p>
          </div>
          
          <a 
            href={group.fileUrl} 
            download={`${group.name}_CMC_Timetable.pdf`}
            className="flex items-center gap-3 bg-white text-cmc-teal px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Download size={18} /> Télécharger l'emploi du temps
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-teal-900/20 shadow-xl">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Calendar size={14} className="text-cmc-teal" /> Aperçu hebdomadaire (Lundi)
          </h3>
          
          <div className="space-y-4">
            {group.mondaySummary && group.mondaySummary.length > 0 ? (
              group.mondaySummary.map((slot, i) => (
                <div key={i} className="flex gap-4 group/slot">
                   <div className="w-24 shrink-0 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter pt-1">
                      {slot.timeSlot}
                   </div>
                   <div className="flex-1 bg-teal-50/40 dark:bg-teal-950/10 p-4 rounded-2xl border border-teal-100/50 dark:border-teal-900/20 group-hover/slot:border-cmc-teal transition-colors">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-cmc-teal font-black text-xs uppercase tracking-tight">
                            <MapPin size={12} /> {slot.room}
                         </div>
                         <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase">
                            <User size={12} /> Prof. {slot.professor}
                         </div>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-widest">
                Aucun créneau cartographié pour lundi
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-teal-900/20 shadow-xl">
           <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <AlertCircle size={14} className="text-cmc-teal" /> Métadonnées CMC
           </h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                 <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Statut</span>
                 <span className="text-[10px] font-black text-emerald-500 uppercase">Opérationnel</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                 <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Intégrité du fichier</span>
                 <span className="text-[10px] font-black text-cmc-teal uppercase tracking-tighter">Vérifié • Standard CMC</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                 <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Sync Système</span>
                 <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase">31/12/2025</span>
              </div>
           </div>
           
           <div className="mt-12 bg-teal-50 dark:bg-teal-950/20 p-6 rounded-2xl border border-teal-100 dark:border-teal-900/30 shadow-inner">
              <p className="text-[10px] font-bold text-cmc-teal uppercase tracking-widest leading-relaxed">
                Cette page de cohorte est générée automatiquement à partir de l'audit centralisé CMC Salle Monitore.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};