import React, { useState } from 'react';
import { Check, Trash2, Edit3, Calendar, Tag, AlertCircle } from 'lucide-react';

const PRIORITY_THEMES = {
  HIGH: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(todo.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}" from the database?`)) {
      setIsDeleting(true);
      try {
        await onDelete(todo.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const priorityBadgeStyle = PRIORITY_THEMES[todo.priority] || PRIORITY_THEMES.MEDIUM;

  return (
    <div
      className={`group relative p-4 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 shadow-lg shadow-black/20'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-600 hover:border-indigo-400 bg-slate-800/60'
          }`}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-base font-semibold leading-snug transition-all ${
                todo.completed
                  ? 'line-through text-slate-500'
                  : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {todo.title}
            </h3>

            {/* Priority Tag */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border tracking-wide uppercase ${priorityBadgeStyle}`}
            >
              {todo.priority || 'MEDIUM'}
            </span>

            {/* Category Tag */}
            {todo.category && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <Tag className="w-2.5 h-2.5 text-indigo-400" />
                {todo.category}
              </span>
            )}
          </div>

          {/* Description */}
          {todo.description && (
            <p
              className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                todo.completed ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
            {todo.dueDate && (
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3 text-slate-400" />
                Due: {todo.dueDate}
              </span>
            )}
            <span>ID #{todo.id}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition cursor-pointer"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
