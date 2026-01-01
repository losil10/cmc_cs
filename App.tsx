
import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MatrixGrid } from './components/MatrixGrid';
import { Uploader } from './components/Uploader';
import { IntegrationReportView } from './components/IntegrationReportView';
import { GroupDetailView } from './components/GroupDetailView';
import { GroupData, DayOfWeek, IntegrationReport as IReport } from './types';
import { DAYS, FULL_GROUP_CHECKLIST, normalizeCohortID } from './constants';
import { LayoutDashboard, UploadCloud, Calendar, Moon, Sun, Search as SearchIcon, FileBarChart, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [uploadedGroups, setUploadedGroups] = useState<Record<string, GroupData>>({});
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DAYS[0]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'upload' | 'report' | 'group'>('matrix');
  const [highlightedGroup, setHighlightedGroup] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [roomSearch, setRoomSearch] = useState('');
  const [selectedGroupView, setSelectedGroupView] = useState<string | null>(null);
  const [lastReport, setLastReport] = useState<IReport | null>(null);

  const handleDataParsed = useCallback((newData: GroupData) => {
    const normalizedName = normalizeCohortID(newData.name);
    setUploadedGroups(prev => ({
      ...prev,
      [normalizedName]: {
        ...newData,
        name: normalizedName
      }
    }));
  }, []);

  const handleIntegrationComplete = useCallback((report: IReport) => {
    const normalizedReport: IReport = {
      ...report,
      missingGroups: report.missingGroups.map(normalizeCohortID),
      updatedGroups: report.updatedGroups.map(normalizeCohortID)
    };
    setLastReport(normalizedReport);
    setActiveTab('report');
  }, []);

  const handleSelectGroup = (name: string) => {
    const normalizedName = normalizeCohortID(name);
    setHighlightedGroup(prev => prev === normalizedName ? null : normalizedName);
    if (activeTab === 'matrix') {
      // Stay on matrix
    } else {
      setSelectedGroupView(normalizedName);
      setActiveTab('group');
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const totalGroupsCount = Object.values(uploadedGroups).filter(g => g.status === 'OK').length;

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen w-full transition-colors duration-300 ease-in-out`}>
      <div className="flex h-screen w-full bg-[#F1F5F9] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Sidebar - Persistent */}
        <Sidebar 
          groups={Object.values(uploadedGroups)} 
          onSelectGroup={handleSelectGroup}
          selectedGroupName={highlightedGroup || selectedGroupView}
          isDarkMode={isDarkMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shadow-sm shrink-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cmc-teal">
                    <path d="M25 40V70H75V45H55V20H25Z" stroke="currentColor" strokeWidth="8" fill="none" />
                    <path d="M45 40V70" stroke="currentColor" strokeWidth="8" />
                    <path d="M55 45H75" stroke="currentColor" strokeWidth="8" />
                    <path d="M25 40H45" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </div>
                <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight uppercase">CMC <span className="text-cmc-teal">Matrix Monitor</span></h1>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
              <nav className="flex gap-1">
                <button 
                  onClick={() => setActiveTab('matrix')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'matrix' ? 'bg-cmc-teal/10 dark:bg-cmc-teal/20 text-cmc-teal' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-cmc-teal/10 dark:bg-cmc-teal/20 text-cmc-teal' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Batch Sync
                </button>
                <button 
                  onClick={() => setActiveTab('report')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'report' ? 'bg-cmc-teal/10 dark:bg-cmc-teal/20 text-cmc-teal' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <FileBarChart size={16} /> Audit
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === 'matrix' && (
                <div className="relative flex items-center group">
                  <SearchIcon size={14} className="absolute left-3 text-slate-400 group-focus-within:text-cmc-teal" />
                  <input 
                    type="text" 
                    placeholder="Search Room..."
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cmc-teal transition-all w-40 md:w-56"
                  />
                </div>
              )}

              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-slate-50 dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <Calendar size={16} className="text-slate-400" />
                <select 
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                  className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer text-slate-700 dark:text-slate-300 pr-2"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day} className="dark:bg-[#1E293B]">{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          {/* Dynamic Content */}
          <div className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar transition-colors duration-300">
            {activeTab === 'matrix' && (
              <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Salle Monitore</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monitoring {totalGroupsCount} verified CMC cohorts for {selectedDay}.</p>
                  </div>
                  {highlightedGroup && (
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 px-4 py-1.5 rounded-full text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase shadow-sm animate-pulse">
                      Focus: {highlightedGroup}
                      <button onClick={() => setHighlightedGroup(null)} className="hover:text-amber-900 dark:hover:text-amber-200 ml-1 p-0.5">×</button>
                    </div>
                  )}
                </div>
                <MatrixGrid 
                  groups={Object.values(uploadedGroups).filter(g => g.status === 'OK')} 
                  selectedDay={selectedDay} 
                  highlightedGroup={highlightedGroup}
                  roomFilter={roomSearch}
                />
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Schedule Integration</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Syncing CMC timetables via AI parsing. All data is normalized to CMC standards.</p>
                </div>
                <Uploader 
                  uploadedGroups={uploadedGroups} 
                  onDataParsed={handleDataParsed} 
                  onIntegrationComplete={handleIntegrationComplete} 
                />
              </div>
            )}

            {activeTab === 'report' && (
              <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                <IntegrationReportView 
                   report={lastReport} 
                   allGroups={Object.values(uploadedGroups)} 
                />
              </div>
            )}

            {activeTab === 'group' && selectedGroupView && uploadedGroups[selectedGroupView] && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-left-4 duration-500">
                <button 
                  onClick={() => setActiveTab('matrix')}
                  className="flex items-center gap-2 text-cmc-teal font-black text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform"
                >
                  <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <GroupDetailView group={uploadedGroups[selectedGroupView]} />
              </div>
            )}
            
            {activeTab === 'group' && (!selectedGroupView || !uploadedGroups[selectedGroupView]) && (
              <div className="max-w-4xl mx-auto text-center py-20">
                <p className="text-slate-400 uppercase font-black tracking-widest">Select a group to view details</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
