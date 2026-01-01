
import React from 'react';
import { IntegrationReport, GroupData } from '../types';
import { FileBarChart, CheckCircle2, AlertTriangle, FileText, Download, Clock, Package } from 'lucide-react';

interface Props {
  report: IntegrationReport | null;
  allGroups: GroupData[];
}

export const IntegrationReportView: React.FC<Props> = ({ report, allGroups }) => {
  if (!report) {
    return (
      <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
        <FileBarChart size={48} className="mx-auto text-slate-200 mb-4" />
        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">No Audit Generated</h3>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Please run the CMC batch uploader to generate an integration audit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white dark:bg-[#1E293B] p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">CMC Integration Report</h1>
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={12} /> {report.timestamp}</span>
              <span className="flex items-center gap-1.5"><Package size={12} /> CMC Regional Hub</span>
            </div>
          </div>
          <div className="bg-cmc-teal text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cmc-teal/20">
            CMC Audit Finalized
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
             <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">CMC Validated</p>
             <p className="text-4xl font-black text-emerald-700 dark:text-emerald-300 tracking-tighter">{report.okCount}/{report.totalChecked}</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/30 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/50">
             <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">Missing Files</p>
             <p className="text-4xl font-black text-rose-700 dark:text-rose-300 tracking-tighter">{report.missingCount}</p>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-950/30 p-5 rounded-2xl border border-cyan-100 dark:border-cyan-900/50">
             <p className="text-[10px] font-black text-cmc-teal uppercase tracking-widest mb-1">Registry Refreshed</p>
             <p className="text-4xl font-black text-cmc-teal dark:text-cyan-300 tracking-tighter">{report.okCount}</p>
          </div>
        </div>

        {report.missingCount > 0 && (
          <div className="mb-8">
             <h3 className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} /> Critical: Missing CMC Files
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {report.missingGroups.map(g => (
                 <div key={g} className="bg-rose-50/50 dark:bg-rose-900/10 p-2 rounded-lg border border-rose-100/50 dark:border-rose-900/20 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                    MISSING - {g}
                 </div>
               ))}
             </div>
          </div>
        )}

        <div>
           <h3 className="text-[11px] font-black text-cmc-teal uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} /> Synchronized Registry
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
             {report.updatedGroups.map(g => (
               <div key={g} className="bg-emerald-50/50 dark:bg-emerald-900/10 p-2 rounded-lg border border-emerald-100/50 dark:border-emerald-900/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>OK - {g}</span>
                  <CheckCircle2 size={10} />
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="text-center font-mono text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest">
         CMC Salle Monitore • System Audit Log • Casablanca Hub
      </div>
    </div>
  );
};
