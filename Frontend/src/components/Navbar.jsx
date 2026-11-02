import React from 'react';
import { Layers, Database, Sparkles, Activity, Plus } from 'lucide-react';

export default function Navbar({ backendStatus, onOpenNewTodo, onOpenArchitecture }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand & Badges */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TaskFlow FullStack
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                React + Spring Boot
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive Full Stack Todo App with Java Spring & Tailwind CSS
            </p>
          </div>
        </div>

        {/* Right: Actions & Live Connection Status */}
        <div className="flex items-center gap-3">
          {/* Backend Status Indicator */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              backendStatus.connected
                ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
            }`}
            title={backendStatus.connected ? 'Spring Boot REST API connected on :8080' : backendStatus.error || 'Connecting...'}
          >
            <span className="relative flex h-2 w-2">
              {backendStatus.connected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  backendStatus.connected ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></span>
            </span>
            <span>
              {backendStatus.connected ? 'Spring Boot Active' : 'Connecting to :8080...'}
            </span>
          </div>

          {/* Architecture / Learning Inspector Button */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm cursor-pointer"
            title="Inspect REST API and Full Stack Architecture"
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Learn & Inspect API</span>
          </button>

          {/* Create Task Button */}
          <button
            onClick={onOpenNewTodo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
