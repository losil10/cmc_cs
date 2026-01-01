
import React, { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Package, RefreshCw } from 'lucide-react';
import { GroupData, IntegrationReport } from '../types';
import { FULL_GROUP_CHECKLIST } from '../constants';
import { parseSchedulePDF } from '../geminiService';

interface UploaderProps {
  uploadedGroups: Record<string, GroupData>;
  onDataParsed: (data: GroupData) => void;
  onIntegrationComplete: (report: IntegrationReport) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ uploadedGroups, onDataParsed, onIntegrationComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);
  const [pendingOverwrite, setPendingOverwrite] = useState<{file: File, groupData: GroupData} | null>(null);

  const processFiles = async (files: FileList) => {
    setIsUploading(true);
    setError(null);
    setSuccessCount(0);

    const updatedNames: string[] = [];

    try {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        const groupData = await parseSchedulePDF(file, file.name);
        
        if (uploadedGroups[groupData.name] && uploadedGroups[groupData.name].status === 'OK') {
          setPendingOverwrite({ file, groupData });
          setIsUploading(false);
          return;
        }

        onDataParsed(groupData);
        updatedNames.push(groupData.name);
      }

      if (updatedNames.length > 0) {
        generateReport(updatedNames);
      }
    } catch (err: any) {
      console.error(err);
      setError("AI Parsing Error: The CMC PDF format was unrecognized or API quota exceeded.");
    } finally {
      if (!pendingOverwrite) setIsUploading(false);
    }
  };

  const confirmOverwrite = () => {
    if (pendingOverwrite) {
      onDataParsed(pendingOverwrite.groupData);
      setSuccessCount(prev => prev + 1);
      
      const allUpdated = (Object.values(uploadedGroups) as GroupData[])
        .filter(g => g.status === 'OK')
        .map(g => g.name);
      
      if (!allUpdated.includes(pendingOverwrite.groupData.name)) {
        allUpdated.push(pendingOverwrite.groupData.name);
      }
      
      generateReport(allUpdated);
      setPendingOverwrite(null);
    }
  };

  const generateReport = (updatedNames: string[]) => {
    const report: IntegrationReport = {
      timestamp: new Date().toLocaleString('fr-MA', { timeZone: 'Africa/Casablanca' }),
      totalChecked: FULL_GROUP_CHECKLIST.length,
      okCount: updatedNames.length,
      missingCount: FULL_GROUP_CHECKLIST.length - updatedNames.length,
      missingGroups: FULL_GROUP_CHECKLIST.filter(g => !updatedNames.includes(g)),
      updatedGroups: updatedNames
    };
    setSuccessCount(updatedNames.length);
    onIntegrationComplete(report);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative group">
        {!pendingOverwrite && (
          <input 
            type="file" 
            multiple 
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isUploading}
          />
        )}
        
        <div className={`border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all shadow-inner ${
          isUploading 
            ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-teal-900/20 group-hover:border-cmc-teal group-hover:bg-teal-50/20'
        }`}>
          {pendingOverwrite ? (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95">
              <RefreshCw size={56} className="text-amber-500 animate-spin mb-6" style={{ animationDuration: '3s' }} />
              <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Overwrite CMC Record</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest max-w-md">
                Un emploi du temps existant pour <span className="text-cmc-teal">{pendingOverwrite.groupData.name}</span> a été trouvé. 
                Voulez-vous le remplacer ?
              </p>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={confirmOverwrite}
                  className="px-8 py-3 bg-cmc-teal text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:brightness-110 transition-all"
                >
                  Confirmer
                </button>
                <button 
                  onClick={() => setPendingOverwrite(null)}
                  className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center text-center animate-pulse">
              <Loader2 size={56} className="text-cmc-teal animate-spin mb-6" />
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Registry Ingestion</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-mono uppercase tracking-widest">Validation CMC via IA...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-cmc-teal text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-teal-500/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Upload size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">CMC Timetable Sync</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 max-w-sm font-bold leading-relaxed uppercase tracking-tighter">
                Déposez vos fichiers PDF. Le système extraira automatiquement les identifiants de cohorte via Gemini AI.
              </p>
              <button className="mt-10 px-10 py-4 bg-slate-900 dark:bg-cmc-teal text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs shadow-teal-500/20">
                Parcourir les fichiers
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-5 flex items-center gap-4 text-rose-700 dark:text-rose-400 animate-in slide-in-from-bottom-2">
          <AlertCircle size={24} className="shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {successCount > 0 && !isUploading && (
        <div className="bg-teal-600 dark:bg-teal-700 border border-teal-700 dark:border-teal-800 rounded-3xl p-6 flex items-center justify-between text-white shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-tight">CMC Sync Réussi</p>
              <p className="text-sm opacity-80 font-bold uppercase tracking-widest text-[10px]">{successCount} emplois du temps CMC traités.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {[
          { icon: <FileText size={20} />, title: "Standards CMC", desc: "Extraction automatique basée sur les métadonnées de Cité des métiers.", color: "teal" },
          { icon: <Package size={20} />, title: "Inventaire Campus", desc: "Filtrage strict pour les salles DIA. Isolation régionale CMC.", color: "teal" },
          { icon: <Loader2 size={20} />, title: "Mapping Instantané", desc: "Alignement piloté par l'IA pour le CMC Salle Monitore.", color: "teal" },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-teal-900/20 shadow-sm hover:shadow-md hover:border-cmc-teal transition-all">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/40 text-cmc-teal rounded-xl flex items-center justify-center mb-5">
              {item.icon}
            </div>
            <h4 className="font-black text-slate-800 dark:text-white text-[11px] uppercase tracking-widest mb-2">{item.title}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};