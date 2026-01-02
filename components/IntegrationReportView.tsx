
import React from 'react';
import { IntegrationReport, GroupData } from '../types';
import { FileBarChart, CheckCircle2, AlertTriangle, FileText, Download, Clock, Package } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface Props {
  report: IntegrationReport | null;
  allGroups: GroupData[];
}

export const IntegrationReportView: React.FC<Props> = ({ report, allGroups }) => {
  const { t } = useLanguage();

  if (!report) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-teal-900/20">
        <FileBarChart size={48} className="mx-auto text-teal-100 dark:text-teal-900 mb-4" />
        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('audit_none_title')}</h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">{t('audit_none_desc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-teal-900/20">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">{t('audit_title')}</h1>
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-cmc-teal" /> {report.timestamp}</span>
              <span className="flex items-center gap-1.5"><Package size={12} className="text-cmc-teal" /> Hub Régional Casablanca</span>
            </div>
          </div>
          <div className="bg-cmc-teal text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-500/20">
            {t('audit_finalized')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-teal-50 dark:bg-teal-950/30 p-5 rounded-2xl border border-teal-100 dark:border-teal-900/50">
             <p className="text-[10px] font-black text-cmc-teal uppercase tracking-widest mb-1">{t('audit_validated')}</p>
             <p className="text-4xl font-black text-cmc-teal dark:text-teal-400 tracking-tighter">{report.okCount}/{report.totalChecked}</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/30 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/50">
             <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">{t('audit_missing')}</p>
             <p className="text-4xl font-black text-rose-700 dark:text-rose-300 tracking-tighter">{report.missingCount}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-teal-900/20">
             <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{t('audit_updated')}</p>
             <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{report.okCount}</p>
          </div>
        </div>

        {report.missingCount > 0 && (
          <div className="mb-8 p-6 bg-rose-50/30 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/20">
             <h3 className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} /> {t('audit_critial')}
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {report.missingGroups.map(g => (
                 <div key={g} className="bg-white/80 dark:bg-slate-900 p-2 rounded-lg border border-rose-100 dark:border-rose-900/20 text-[10px] font-bold text-rose-600 dark:text-rose-400 text-center">
                    MISSING - {g}
                 </div>
               ))}
             </div>
          </div>
        )}

        <div>
           <h3 className="text-[11px] font-black text-cmc-teal uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} /> {t('audit_synced')}
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
             {report.updatedGroups.map(g => (
               <div key={g} className="bg-teal-50/50 dark:bg-teal-900/10 p-2 rounded-lg border border-teal-100 dark:border-teal-900/20 text-[10px] font-bold text-teal-700 dark:text-teal-400 flex items-center justify-between px-3">
                  <span>OK - {g}</span>
                  <CheckCircle2 size={10} className="text-cmc-teal" />
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
