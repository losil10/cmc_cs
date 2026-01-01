
import React, { useState, useMemo } from 'react';
import { GroupData, DayOfWeek, TimeSlot, MatrixData } from '../types';
import { TIME_SLOTS, MASTER_ROOM_LIST } from '../constants';
import { User, CheckCircle2, Filter, ChevronDown, Sparkles } from 'lucide-react';

interface MatrixGridProps {
  groups: GroupData[];
  selectedDay: DayOfWeek;
  highlightedGroup?: string | null;
  roomFilter?: string;
}

type FilterValue = 'all' | 'free' | 'occupied';

export const MatrixGrid: React.FC<MatrixGridProps> = ({ groups, selectedDay, highlightedGroup, roomFilter = '' }) => {
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

  const toggleFilter = (slot: TimeSlot) => {
    setColumnFilters(prev => {
      const current = prev[slot];
      let next: FilterValue = 'all';
      if (current === 'all') next = 'free';
      else if (current === 'free') next = 'occupied';
      else next = 'all';
      return { ...prev, [slot]: next };
    });
  };

  const getFilterStyles = (val: FilterValue) => {
    switch(val) {
      case 'free': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50';
      case 'occupied': return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50';
      default: return 'text-slate-400 bg-slate-50 dark:bg-[#1E293B] border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors duration-300">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse table-fixed min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 transition-colors">
              <th className="sticky left-0 z-20 bg-slate-100 dark:bg-[#0F172A] p-5 text-left text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 w-36 shadow-md transition-colors">
                Classroom ID
              </th>
              {TIME_SLOTS.map(slot => (
                <th key={slot} className="relative p-0 text-center text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 group/header">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
                      <span className="truncate tracking-widest">{slot}</span>
                    </div>
                    <button 
                      onClick={() => toggleFilter(slot)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 transition-all hover:brightness-95 active:scale-95 ${getFilterStyles(columnFilters[slot])}`}
                    >
                      <Filter size={12} className={columnFilters[slot] !== 'all' ? 'animate-pulse' : ''} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {columnFilters[slot] === 'all' ? 'All' : `${columnFilters[slot]}`}
                      </span>
                      <ChevronDown size={10} className="opacity-50" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={TIME_SLOTS.length + 1} className="p-32 text-center bg-white dark:bg-[#1E293B]">
                  <div className="flex flex-col items-center opacity-30">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                       <Filter size={32} className="text-slate-400 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No Results for Search</p>
                    <button 
                      onClick={() => setColumnFilters({
                        "08:30 - 11:00": 'all', "11:00 - 13:30": 'all', 
                        "13:30 - 16:00": 'all', "16:00 - 18:30": 'all'
                      })}
                      className="mt-6 text-cmc-teal text-xs font-black uppercase tracking-widest hover:underline"
                    >
                      Reset Dashboard
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRooms.map(room => (
                <tr key={room} className="border-b border-slate-100 dark:border-slate-800 group transition-colors">
                  <td className="sticky left-0 z-10 bg-slate-50 dark:bg-[#1E293B] p-5 text-xs font-black text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 group-hover:bg-cmc-teal/5 dark:group-hover:bg-cmc-teal/10 transition-colors">
                    {room}
                  </td>
                  {TIME_SLOTS.map(slot => {
                    const occupancy = matrix[room]?.[slot];
                    const isHighlighted = highlightedGroup && occupancy?.groupName === highlightedGroup;

                    return (
                      <td key={`${room}-${slot}`} className="p-0 border-r border-slate-100 dark:border-slate-800 h-28 relative overflow-hidden">
                        {occupancy ? (
                          <div className={`relative h-full w-full p-4 flex flex-col justify-center items-center text-center transition-all duration-300 ${
                            isHighlighted 
                              ? 'bg-cmc-teal z-10 scale-[1.02] shadow-2xl ring-4 ring-cyan-400 dark:ring-cyan-500/50 ring-offset-0 animate-pulse text-white' 
                              : 'bg-[#FEE2E2] dark:bg-[#991B1B] text-[#991B1B] dark:text-[#FEE2E2]'
                          }`}>
                            {isHighlighted && <Sparkles className="absolute -top-3 -right-3 text-cyan-200" size={20} />}
                            
                            <span className="text-[14px] font-black uppercase tracking-tight leading-none mb-2 truncate w-full">
                              {occupancy.groupName}
                            </span>
                            
                            <div className={`flex items-center gap-2 text-[10px] font-bold opacity-80 truncate max-w-full px-3 py-1 rounded-full border ${
                               isHighlighted ? 'bg-black/10 border-white/20' : 'bg-red-200/50 dark:bg-black/20 border-red-300/30 dark:border-red-900/20'
                            }`}>
                              <User size={12} className="shrink-0" />
                              <span className="truncate">Prof. {occupancy.professor}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#DCFCE7] dark:bg-[#166534] h-full w-full flex flex-col items-center justify-center text-[#166534] dark:text-[#DCFCE7] opacity-80 dark:opacity-90 group-hover:opacity-100 transition-all duration-300">
                            <div className="w-8 h-8 rounded-full border-2 border-emerald-300/30 dark:border-emerald-500/30 flex items-center justify-center mb-1">
                               <CheckCircle2 size={16} className="opacity-80" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Free</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
