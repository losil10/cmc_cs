
import React, { useState, useMemo } from 'react';
import { GroupData, DayOfWeek, TimeSlot, MatrixData, ReportedProblem } from '../types';
import { TIME_SLOTS, MASTER_ROOM_LIST } from '../constants';
import { User, CheckCircle2, Filter, ChevronDown, Sparkles, AlertCircle, Clock, Check, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface MatrixGridProps {
  groups: GroupData[];
  selectedDay: DayOfWeek;
  highlightedGroup?: string | null;
  roomFilter?: string;
  problems?: ReportedProblem[];
}

type FilterValue = 'all' | 'free' | 'occupied';

export const MatrixGrid: React.FC<MatrixGridProps> = ({ groups, selectedDay, highlightedGroup, roomFilter = '', problems = [] }) => {
  const { t } = useLanguage();
  const [columnFilters, setColumnFilters] = useState<Record<TimeSlot, FilterValue>>({
    "08:30 - 11:00": 'all',
    "11:00 - 13:30": 'all',
    "13:30 - 16:00": 'all',
    "16:00 - 18:30": 'all'
  });

  const matrix: MatrixData = useMemo(() => {
    const data: MatrixData = {};
    MASTER_ROOM_LIST.forEach(room => {
      data[room] = {};
    });

    groups.forEach(group => {
      group.entries.forEach(entry => {
        if (entry.day === selectedDay && data[entry.room]) {
          if (TIME_SLOTS.includes(entry.timeSlot as TimeSlot)) {
            data[entry.room]![entry.timeSlot as TimeSlot] = {
              groupName: entry.groupName,
              professor: entry.professor
            };
          }
        }
      });
    });

    return data;
  }, [groups, selectedDay]);

  const filteredRooms = useMemo(() => {
    return MASTER_ROOM_LIST.filter(room => {
      if (roomFilter && !room.toLowerCase().includes(roomFilter.toLowerCase())) {
        return false;
      }

      return TIME_SLOTS.every(slot => {
        const filter = columnFilters[slot];
        const occupancy = matrix[room]?.[slot];
        
        if (filter === 'all') return true;
        if (filter === 'free') return !occupancy;
        if (filter === 'occupied') return !!occupancy;
        return true;
      });
    });
  }, [matrix, columnFilters, roomFilter]);

  const setFilter = (slot: TimeSlot, value: FilterValue) => {
    setColumnFilters(prev => ({ ...prev, [slot]: value }));
  };

  const getRoomProblem = (room: string) => problems.find(p => p.room === room);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-teal-900/20 overflow-hidden flex flex-col transition-all duration-500">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse table-fixed min-w-[1200px] border-hidden">
          <thead>
            <tr className="bg-cmc-deep-blue">
              <th className="sticky left-0 z-20 bg-cmc-deep-blue p-0 text-left border-r border-cmc-mint-ice/20 w-44 shadow-sm backdrop-blur-md">
                <div className="px-6 py-12 text-[11px] font-black uppercase tracking-widest text-cmc-mint-ice opacity-80">
                  {t('table_room_id')}
                </div>
              </th>
              {TIME_SLOTS.map(slot => (
                <th key={slot} className="relative p-0 text-center border-r border-cmc-mint-ice/20 border-b border-cmc-mint-ice/20 group/header">
                  <div className="flex flex-col h-full bg-cmc-deep-blue">
                    <div className="p-4 border-b border-cmc-mint-ice/10 flex items-center justify-center gap-2 bg-black/20">
                      <Clock size={12} className="text-cmc-mint-ice opacity-80" />
                      <span className="text-[12px] font-black uppercase tracking-wider text-cmc-mint-ice">{slot}</span>
                    </div>
                    {/* High-Impact Segmented Control */}
                    <div className="p-3 flex items-center justify-center">
                      <div className="flex bg-black/40 p-1 rounded-xl gap-1 w-full max-w-[210px] border border-white/10">
                        <button 
                          onClick={() => setFilter(slot, 'all')}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all tracking-tighter ${columnFilters[slot] === 'all' ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/10' : 'text-white/40 hover:text-white/80'}`}
                        >
                          {t('filter_all')}
                        </button>
                        <button 
                          onClick={() => setFilter(slot, 'free')}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 tracking-tighter ${columnFilters[slot] === 'free' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-1 ring-white/10' : 'text-white/40 hover:text-emerald-400'}`}
                        >
                          <Check size={11} strokeWidth={3} /> {t('filter_free')}
                        </button>
                        <button 
                          onClick={() => setFilter(slot, 'occupied')}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 tracking-tighter ${columnFilters[slot] === 'occupied' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-1 ring-white/10' : 'text-white/40 hover:text-rose-400'}`}
                        >
                          <ShieldAlert size={11} strokeWidth={3} /> {t('filter_busy')}
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={TIME_SLOTS.length + 1} className="p-40 text-center bg-white dark:bg-slate-900">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                       <Filter size={40} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest text-sm">{t('no_result_title')}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-tight">{t('no_result_desc')}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRooms.map(room => {
                const problem = getRoomProblem(room);
                const hasProblem = !!problem;
                
                let problemClass = "";
                let problemIconColor = "";
                if (hasProblem) {
                   if (problem.priority === "Plus Urgent") {
                      problemClass = "bg-rose-600 text-white";
                      problemIconColor = "text-white";
                   } else if (problem.priority === "Urgent") {
                      problemClass = "bg-orange-500 text-white";
                      problemIconColor = "text-white";
                   } else {
                      problemClass = "bg-amber-400 text-slate-900";
                      problemIconColor = "text-slate-900";
                   }
                }

                return (
                  <tr key={room} className="group transition-all duration-300 border-b border-slate-200 dark:border-teal-900/10 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className={`sticky left-0 z-10 p-0 border-r border-cmc-mint-ice/30 transition-all duration-300 h-full group-hover:brightness-125 ${hasProblem ? problemClass : 'bg-cmc-deep-blue text-cmc-mint-ice shadow-xl'}`}>
                      <div className="px-6 h-32 flex items-center gap-4">
                        {hasProblem && <AlertCircle size={24} className={`shrink-0 animate-pulse ${problemIconColor}`} />}
                        <span className="text-2xl font-black tracking-tighter drop-shadow-sm">{room}</span>
                      </div>
                    </td>
                    {TIME_SLOTS.map(slot => {
                      const occupancy = matrix[room]?.[slot];
                      const isHighlighted = highlightedGroup && occupancy?.groupName === highlightedGroup;

                      return (
                        <td key={`${room}-${slot}`} className={`p-0 border-r border-slate-200 dark:border-teal-900/10 h-32 relative overflow-hidden transition-colors ${!occupancy ? 'bg-white' : ''}`}>
                          {occupancy ? (
                            <div className={`relative h-full w-full p-5 flex flex-col justify-center items-center text-center transition-all duration-500 group/cell ${
                              isHighlighted 
                                ? 'bg-cmc-teal z-10 scale-[1.01] shadow-2xl active-glow ring-2 ring-white/30 ring-inset text-white' 
                                : 'bg-[#FFF1F2] dark:bg-rose-950/20 text-rose-800 dark:text-rose-200 hover:bg-rose-100/60 dark:hover:bg-rose-900/30'
                            }`}>
                              {isHighlighted && <Sparkles className="absolute -top-3 -right-3 text-cyan-200 animate-bounce" size={24} />}
                              
                              <span className={`text-[16px] font-black uppercase tracking-tight leading-none mb-3 truncate w-full group-hover/cell:scale-105 transition-transform ${isHighlighted ? 'text-white' : 'text-rose-900 dark:text-rose-100'}`}>
                                {occupancy.groupName}
                              </span>
                              
                              <div className={`flex items-center gap-2 text-[11px] font-bold px-4 py-1.5 rounded-2xl border backdrop-blur-sm transition-all ${
                                 isHighlighted ? 'bg-black/10 border-white/20' : 'bg-rose-100/50 dark:bg-black/20 border-rose-200/50 dark:border-rose-800/30'
                              }`}>
                                <User size={12} className="shrink-0" />
                                <span className="truncate max-w-[120px]">Prof. {occupancy.professor}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-[#f0fdfa] h-full w-full flex flex-col items-center justify-center text-teal-700 opacity-90 group-hover:opacity-100 group-hover:bg-[#DCFCE7] transition-all duration-500 shadow-inner">
                              <div className="w-12 h-12 rounded-2xl border-2 border-teal-200/50 flex items-center justify-center mb-2 bg-white shadow-xl group-hover:rotate-6 transition-transform">
                                 <CheckCircle2 size={24} className="text-cmc-teal" />
                              </div>
                              <span className="text-[12px] font-black tracking-[0.25em] uppercase text-cmc-deep-blue">{t('room_free')}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
