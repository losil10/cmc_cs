
import React from 'react';
import { GroupData } from '../types';
import { FULL_GROUP_CHECKLIST, normalizeCohortID } from '../constants';
import { Users, CheckCircle, Search, Info, X, Upload, AlertCircle, Clock, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  groups: GroupData[];
  onSelectGroup: (name: string) => void;
  selectedGroupName?: string | null;
  isDarkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ groups, onSelectGroup, selectedGroupName, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const uploadedNames = groups.filter(g => g.status === 'OK').map(g => normalizeCohortID(g.name));
  
  const pendingGroups = FULL_GROUP_CHECKLIST.filter(name => !uploadedNames.includes(normalizeCohortID(name)));

  const filteredGroups = React.useMemo(() => {
    return groups.filter(g => g.status === 'OK' && normalizeCohortID(g.name).includes(normalizeCohortID(searchTerm)))
                 .sort((a, b) => a.name.localeCompare(b.name));
  }, [groups, searchTerm]);

  const filteredPending = React.useMemo(() => {
    return pendingGroups.filter(name => normalizeCohortID(name).includes(normalizeCohortID(searchTerm)))
                        .sort((a, b) => a.localeCompare(b));
  }, [pendingGroups, searchTerm]);

  return (
    <aside className="w-72 bg-cmc-midnight text-slate-300 flex flex-col shrink-0 border-r border-teal-900/30 transition-all duration-300 z-40">
      <div className="p-6 border-b border-teal-900/20 shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-cmc-teal rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-white font-black leading-none uppercase tracking-tight text-sm">CMC <span className="text-cmc-teal">REGISTRY</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-teal-500 font-bold mt-1">Salle Monitore</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cmc-teal transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search Cohorts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-teal-900/30 rounded-lg py-2 pl-9 pr-9 text-xs font-semibold focus:ring-2 focus:ring-cmc-teal text-white placeholder:text-slate-500 outline-none transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cmc-teal transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Active Cohorts</p>
            <span className="text-[10px] bg-teal-900/30 text-cmc-teal px-2 py-0.5 rounded-full font-bold border border-teal-800/30">
              {uploadedNames.length}
            </span>
          </div>
          
          <div className="space-y-1">
            {filteredGroups.length === 0 && !searchTerm && (
              <div className="px-4 py-8 text-center bg-slate-900/30 rounded-xl border border-dashed border-teal-900/20">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No CMC data synced</p>
              </div>
            )}
            {filteredGroups.map(group => {
              const isSelected = selectedGroupName === normalizeCohortID(group.name);
              return (
                <button
                  key={group.name}
                  onClick={() => onSelectGroup(group.name)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group text-left ${
                    isSelected 
                      ? 'bg-cmc-teal shadow-lg shadow-teal-500/20 text-white translate-x-1 active-glow' 
                      : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {group.name}
                    </span>
                    <span className={`text-[10px] font-medium ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                      CMC Sync Verified
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_8px_#67e8f9]" />
                  ) : (
                    <CheckCircle size={14} className="text-teal-700 opacity-60" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] uppercase font-black text-rose-500/70 tracking-wider">Missing CMC Files</p>
            <span className="text-[10px] bg-rose-900/20 text-rose-400 px-2 py-0.5 rounded-full font-bold border border-rose-900/20">
              {pendingGroups.length}
            </span>
          </div>
          
          <div className="space-y-1 opacity-60">
            {filteredPending.map(name => (
              <div
                key={name}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-transparent text-left"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500">
                    {name}
                  </span>
                  <span className="text-[9px] font-medium text-rose-500 uppercase tracking-tighter">
                    Pending Ingestion
                  </span>
                </div>
                <Clock size={12} className="text-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 bg-black/40 border-t border-teal-900/20 shrink-0">
        <div className="bg-slate-900/50 border border-teal-900/20 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Compliance Status</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cmc-teal transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(13,148,136,0.5)]" 
              style={{ width: `${(uploadedNames.length / FULL_GROUP_CHECKLIST.length) * 100}%` }} 
            />
          </div>
          <div className="flex justify-between items-center mt-3">
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Synced: {uploadedNames.length}/{FULL_GROUP_CHECKLIST.length}</p>
             <p className="text-[10px] text-cmc-teal font-black">{Math.round((uploadedNames.length / FULL_GROUP_CHECKLIST.length) * 100)}%</p>
          </div>
        </div>
      </div>
    </aside>
  );
};