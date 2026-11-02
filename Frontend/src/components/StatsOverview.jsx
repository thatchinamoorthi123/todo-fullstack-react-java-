import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

export default function StatsOverview({ todos = [] }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter((t) => !t.completed && t.priority === 'HIGH').length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    {
      title: 'Total Tasks',
      value: total,
      subtext: 'Stored in Database',
      icon: ListTodo,
      color: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      title: 'Completed',
      value: completed,
      subtext: `${progressPercent}% completion rate`,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Pending',
      value: pending,
      subtext: 'Awaiting completion',
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/20',
      textColor: 'text-amber-400',
    },
    {
      title: 'High Priority',
      value: highPriority,
      subtext: 'Requires urgent focus',
      icon: AlertTriangle,
      color: 'from-rose-500/20 to-red-500/10',
      border: 'border-rose-500/20',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${stat.border} bg-gradient-to-br ${stat.color} bg-slate-900/60 backdrop-blur-sm shadow-sm flex items-center justify-between transition-all hover:scale-[1.01]`}
          >
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{stat.subtext}</p>
            </div>
            <div className={`p-3 rounded-lg bg-slate-800/80 ${stat.textColor}`}>
              <IconComponent className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
