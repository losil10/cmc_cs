
import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MatrixGrid } from './components/MatrixGrid';
import { Uploader } from './components/Uploader';
import { IntegrationReportView } from './components/IntegrationReportView';
import { GroupDetailView } from './components/GroupDetailView';
import { ProblemModal } from './components/ProblemModal';
import { SummaryModal } from './components/SummaryModal';
import { GroupData, DayOfWeek, IntegrationReport as IReport, ReportedProblem, ProblemStatus, ProblemPriority } from './types';
import { DAYS, normalizeCohortID, MASTER_ROOM_LIST } from './constants';
import { LayoutDashboard, Calendar, Moon, Sun, Search as SearchIcon, FileBarChart, ArrowLeft, AlertCircle, BarChart3, Clock, Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const App: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [uploadedGroups, setUploadedGroups] = useState<Record<string, GroupData>>({});
  const [reportedProblems, setReportedProblems] = useState<ReportedProblem[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DAYS[0]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'upload' | 'report' | 'group'>('matrix');
  const [highlightedGroup, setHighlightedGroup] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [roomSearch, setRoomSearch] = useState('');
  const [selectedGroupView, setSelectedGroupView] = useState<string | null>(null);
  const [lastReport, setLastReport] = useState<IReport | null>(null);
  
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

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

  const handleReportProblem = (room: string, description: string, priority: ProblemPriority) => {
    const newProblem: ReportedProblem = {
      id: Math.random().toString(36).substr(2, 9),
      room,
      description,
      priority,
      status: "Reported",
      timestamp: Date.now()
    };
    setReportedProblems(prev => [...prev, newProblem]);
    setShowProblemModal(false);
  };

  const handleUpdateProblemStatus = (id: string, newStatus: ProblemStatus) => {
    if (newStatus === "Handled") {
      setReportedProblems(prev => prev.filter(p => p.id !== id));
    } else {
      setReportedProblems(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');

  const activeProblems = useMemo(() => reportedProblems.filter(p => p.status !== "Handled"), [reportedProblems]);
  
  const freeRoomsCount = useMemo(() => {
    const roomsWithOccupancy = new Set<string>();
    (Object.values(uploadedGroups) as GroupData[]).forEach(group => {
      group.entries.forEach(entry => {
        if (entry.day === selectedDay) {
          roomsWithOccupancy.add(entry.room);
        }
      });
    });
    return MASTER_ROOM_LIST.filter(room => !roomsWithOccupancy.has(room)).length;
  }, [uploadedGroups, selectedDay]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen w-full transition-colors duration-300 ease-in-out font-sans`}>
      <div className="flex h-screen w-full bg-[#F8FAFC] dark:bg-cmc-midnight text-slate-900 dark:text-slate-100 overflow-hidden">
        <Sidebar 
          groups={Object.values(uploadedGroups) as GroupData[]} 
          onSelectGroup={handleSelectGroup}
          selectedGroupName={highlightedGroup || selectedGroupView}
          isDarkMode={isDarkMode}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Header optimized for maximum visibility and high contrast */}
          <header className="h-16 bg-cmc-deep-blue border-b-[3px] border-cmc-teal px-8 flex items-center justify-between shadow-2xl shrink-0 z-30">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-cmc-teal p-2 rounded-xl shadow-lg shadow-teal-500/40 border border-white/20">
                  <LayoutDashboard size={18} className="text-white" />
                </div>
                <h1 className="text-lg font-black text-white tracking-tight uppercase">CMC <span className="text-cmc-mint-ice">{t('app_title')}</span></h1>
              </div>
              <div className="h-8 w-px bg-white/20 mx-2" />
              <nav className="flex items-center gap-2">
                {[
                  { id: 'matrix', label: t('nav_dashboard'), icon: null },
                  { id: 'upload', label: t('nav_sync'), icon: null },
                  { id: 'report', label: t('nav_audit'), icon: <FileBarChart size={14} /> }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 uppercase tracking-widest ${
                      activeTab === tab.id 
                        ? 'bg-cmc-teal text-white shadow-xl shadow-teal-500/50 translate-y-[-1px] active-glow border border-white/30' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
                <div className="w-px h-6 bg-white/20 mx-2" />
                <button 
                  onClick={() => setShowProblemModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 text-rose-300 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 uppercase tracking-widest"
                >
                  <AlertCircle size={14} /> {t('nav_report')}
                </button>
                <button 
                  onClick={() => setShowSummaryModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 text-cmc-mint-ice hover:bg-white/10 border border-transparent hover:border-cmc-teal/40 uppercase tracking-widest"
                >
                  <BarChart3 size={14} /> {t('nav_summary')}
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {activeTab === 'matrix' && (
                <div className="relative flex items-center">
                  <SearchIcon size={14} className="absolute left-3 text-cmc-mint-ice/70" />
                  <input 
                    type="text" 
                    placeholder={t('search_placeholder')}
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    className="bg-white/10 border-white/20 rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-cmc-teal transition-all w-56 text-white placeholder:text-cmc-mint-ice/40"
                  />
                </div>
              )}

              <button 
                onClick={toggleLanguage}
                className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 hover:border-cmc-teal hover:bg-white/20 transition-all font-black text-xs uppercase w-10 h-10 flex items-center justify-center"
              >
                {language.toUpperCase()}
              </button>

              <button 
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 hover:border-cmc-teal hover:bg-white/20 transition-all"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                <Calendar size={16} className="text-cmc-teal" />
                <select 
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                  className="bg-transparent text-sm font-black focus:outline-none cursor-pointer text-white uppercase tracking-tight"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day} className="text-slate-900">{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8 custom-scrollbar">
            {activeTab === 'matrix' && (
              <div className="max-w-[1600px] mx-auto space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('overview_title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <Clock size={14} className="text-cmc-teal" /> {t('overview_subtitle')} • {selectedDay}
                    </p>
                  </div>
                  {highlightedGroup && (
                    <div className="flex items-center gap-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50 px-5 py-2.5 rounded-2xl text-cmc-teal text-[11px] font-black uppercase shadow-sm active-glow">
                      <span>{t('cohort_focus')}: <strong>{highlightedGroup}</strong></span>
                      <button onClick={() => setHighlightedGroup(null)} className="ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-cmc-teal hover:text-white transition-colors">×</button>
                    </div>
                  )}
                </div>
                <MatrixGrid 
                  groups={(Object.values(uploadedGroups) as GroupData[]).filter(g => g.status === 'OK')} 
                  selectedDay={selectedDay} 
                  highlightedGroup={highlightedGroup}
                  roomFilter={roomSearch}
                  problems={activeProblems}
                />
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="max-w-4xl mx-auto">
                <Uploader 
                  uploadedGroups={uploadedGroups} 
                  onDataParsed={handleDataParsed} 
                  onIntegrationComplete={handleIntegrationComplete} 
                />
              </div>
            )}

            {activeTab === 'report' && (
              <div className="max-w-5xl mx-auto">
                <IntegrationReportView 
                   report={lastReport} 
                   allGroups={Object.values(uploadedGroups) as GroupData[]} 
                />
              </div>
            )}

            {activeTab === 'group' && selectedGroupView && uploadedGroups[selectedGroupView] && (
              <div className="max-w-4xl mx-auto">
                <button 
                  onClick={() => setActiveTab('matrix')}
                  className="flex items-center gap-2 text-cmc-teal font-black text-xs uppercase mb-8 hover:translate-x-[-4px] transition-transform"
                >
                  <ArrowLeft size={16} /> {t('nav_dashboard')}
                </button>
                <GroupDetailView group={uploadedGroups[selectedGroupView]} />
              </div>
            )}
          </div>
        </main>
      </div>

      {showProblemModal && (
        <ProblemModal 
          onClose={() => setShowProblemModal(false)}
          onReport={handleReportProblem}
        />
      )}

      {showSummaryModal && (
        <SummaryModal 
          onClose={() => setShowSummaryModal(false)}
          freeRoomsCount={freeRoomsCount}
          problems={activeProblems}
          onUpdateStatus={handleUpdateProblemStatus}
        />
      )}
    </div>
  );
};

export default App;
